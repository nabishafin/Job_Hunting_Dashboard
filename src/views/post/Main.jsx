import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { GET_RECIPES, MEAL_PLANS, RECIPES } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import dayjs from "dayjs";
import { categories, complexities } from "../../utils/static";
import { X, Trash2 } from "lucide-react";
import { LoadingIcon } from "../../base-components";
import Select from "react-select";

const WeeklyPlanForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const [recipes, setRecipes] = useState([]);
  const location = useLocation();
  const mealData = location.state?.data;
  const index = location.state?.index;
  const [isEdit, setIsEdit] = useState(false);
  const [availabledays, setAvailableDays] = useState();
  const [title, setTitle] = useState(mealData?.title || "");
  const [comments, setComments] = useState(mealData?.comments || "");
  console.log("rec", recipes);

  const [isWeeklyPlanPublished, setIsWeeklyPlanPublished] = useState(
    mealData?.isWeeklyPlanPublished || false
  );
  const [startDate, setStartDate] = useState(
    mealData?.startDate
      ? new Date(mealData.startDate).toISOString().split("T")[0]
      : ""
  );
  const [publishDate, setpublishDate] = useState(
    mealData?.publishDate
      ? new Date(mealData.publishDate).toISOString().split("T")[0]
      : ""
  );
  console.log(mealData);
  useEffect(() => {
    if (mealData) {
      setIsEdit(true);
    }
    getRecipes();
  }, [mealData]);
  console.log("start date ", startDate);
  const getRecipes = async () => {
    try {
      const response = await httpRequest.post(
        GET_RECIPES,
        { searchQuery: "" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setRecipes(response.data.results);
      }
    } catch (error) {
      console.log(error);

      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
    }
  };

  const getWeekDates = (startDate) => {
    const start = dayjs(startDate).startOf("isoWeek");
    return Array.from({ length: 7 }, (_, i) => ({
      date: start.add(i, "day").format("YYYY-MM-DD"),
      label: start.add(i, "day").format("dddd, MMM D"),
      days: start.add(i, "day").format("dddd"),
    }));
  };

  const initialValues = {
    // mealsPerDay: mealData?.mealsPerDay || "",
    // snacksPerDay: mealData?.snacksPerDay || "",
    // addOnsPerDay: mealData?.addOnsPerDay || "",
    // isPublished: mealData?.isPublished ?? false,
    meals: [
      {
        mealTitle: "",
        portionSize: "",
        recipes: "",
      },
    ],
    days: [],
  };

  const [weeklyPlans, setWeeklyPlans] = useState(
    mealData?.plans || [initialValues]
  );

  const handleWeeklyPlanChange = (
    planIndex,
    field,
    value,
    setFieldValue,
    values
  ) => {
    const updatedWeeklyPlans = [...weeklyPlans];

    if (field.startsWith("meals[")) {
      const matches = field.match(/^meals\[(\d+)\]\.(.+)$/);
      if (matches) {
        const mealIndex = parseInt(matches[1], 10);
        const mealField = matches[2];

        updatedWeeklyPlans[planIndex].meals[mealIndex] = {
          ...updatedWeeklyPlans[planIndex].meals[mealIndex],
          [mealField]: value,
        };
        setFieldValue(field, value);
      }
    } else {
      updatedWeeklyPlans[planIndex][field] = value;
      setFieldValue(field, value);
    }

    setWeeklyPlans(updatedWeeklyPlans);
  };

  const validationSchema = Yup.object().shape({
    // mealsPerDay: Yup.number().required("Meals per day is required").min(1),
    // snacksPerDay: Yup.number().required("Snacks per day is required").min(0),
    // addOnsPerDay: Yup.number().required("Add-ons per day is required").min(0),
    meals: Yup.array()
      .of(
        Yup.object().shape({
          mealTitle: Yup.string().required("Meal title is required"),
          comments: Yup.string().required("Comment is required"),
          portionSize: Yup.string().required("Portion size is required"),
          complexityLevel: Yup.string().required(
            "Complexity level is required"
          ),
        })
      )
      .min(1, "At least one meal is required"),
  });

  const handleSubmit = async () => {
    setLoading(true);
    if (!startDate) {
      toast.error("Please select a start date");
      setLoading(false);
      return;
    }
    if (!title) {
      toast.error("Please enter a title");
      setLoading(false);
      return;
    }
    if (!publishDate) {
      toast.error("Please select a publish date");
      setLoading(false);
      return;
    }
    const payload = {
      startDate,
      publishDate,
      title,
      comments,
      isWeeklyPlanPublished,
      plans: weeklyPlans,
    };
    console.log(payload);

    try {
      const url = isEdit ? `${MEAL_PLANS}/${mealData._id}` : MEAL_PLANS;
      const method = isEdit ? httpRequest.put : httpRequest.post;
      const response = await method(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.data?.message ||
            (isEdit
              ? "Weekly plan updated successfully"
              : "Weekly plan created successfully")
        );
        navigate("/meal-plan");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong");

      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
      setLoading(false);
    }
  };

  const removeWeeklyPlan = (index) => {
    // Show a confirmation prompt
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this weekly plan?"
    );

    if (confirmDelete) {
      // Remove the weekly plan from the weeklyPlans array
      const updatedWeeklyPlans = [...weeklyPlans];
      updatedWeeklyPlans.splice(index, 1);
      setWeeklyPlans(updatedWeeklyPlans);
    }
  };

  console.log("weekly plans", weeklyPlans);

  const selectedDays = weeklyPlans.map((plan) => plan.days).flat();
  const weekDates = startDate ? getWeekDates(startDate) : [];
  console.log("selectedDays", selectedDays);

  const addWeeklyPlan = () => {
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    if (selectedDays.length >= 7) {
      toast.error("You can't add more than 7 days");
      return;
    }
    // console.log(values);
    // setPlans([...plans, values]);

    setWeeklyPlans([...weeklyPlans, initialValues]);
  };

  const removeMealPlan = (index) => {
    const updatedWeeklyPlans = [...weeklyPlans];
    updatedWeeklyPlans.splice(index, 1);
    setWeeklyPlans(updatedWeeklyPlans);
  };

  const handleChange = (selectedOption) => {
    handleWeeklyPlanChange(
      planIndex,
      `meals[${index}].recipes`,
      selectedOption ? selectedOption.value : "",
      setFieldValue,
      values
    );
  };

  return (
    <div className="p-4 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-2">
        <button
          className="btn btn-primary"
          onClick={() => window.history.go(-1)}
        >
          Back
        </button>
      </div>
      {index === undefined && (
        <>
          {" "}
          <h2 className="text-lg font-semibold pb-4">
            {isEdit ? "Edit" : "Create"} Weekly Meal Plan
          </h2>
          <div className="form-group mb-4">
            <label htmlFor="startDate" className="block font-semibold">
              Meal plan date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Disallow previous dates
              max="9999-12-31" // Restrict the maximum year to 4 digits
              className="w-full p-2 mt-2 border rounded-md"
            />

            <div>
              <input
                type="text"
                id="weeklyPlanTitle"
                value={title}
                className="w-full p-2 mt-2 border rounded-md"
                placeholder="Enter Weekly Plan Title"
                maxLength={25}
                onChange={(e) => setTitle(e.target.value)}
              />
              {title.length > 25 ? (
                <p className="text-sm text-red-500">
                  Maximum of 25 characters allowed
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  {25 - title.length} characters remaining
                </p>
              )}
            </div>

            <textarea
              id="weeklyPlanTitle"
              value={comments}
              className="w-full p-2 mt-2 border rounded-md"
              placeholder="Enter comments"
              onChange={(e) => setComments(e.target.value)}
            />
            <div className="pt-4">
              <label htmlFor="startDate" className="block font-semibold">
                Scheduled publish date
              </label>
            </div>
            <div className="form-group flex items-center gap-6">
              <div>
                <input
                  type="date"
                  id="publishDate"
                  value={publishDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setpublishDate(e.target.value)}
                  className="w-full p-2 mt-2 border rounded-md"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isWeeklyPlanPublished}
                    name="isWeeklyPlanPublished"
                    className="mr-2"
                    onChange={(e) => setIsWeeklyPlanPublished(e.target.checked)}
                  />
                  Publish
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {weeklyPlans.map((plan, planIndex) => (
        <Formik
          key={planIndex}
          initialValues={plan}
          validationSchema={validationSchema}
          onSubmit={(values) => addWeeklyPlan(values)}
          enableReinitialize
        >
          {({ values, setFieldValue }) => {
            console.log("values", values);
            // setWeeklyPlans([...weeklyPlans, values]);
            return (
              <>
                <Form className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6 p-4 mb-4">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold">
                      Plan {planIndex + 1}
                    </h3>
                    {index === undefined && (
                      <div className="flex justify-end">
                        <Trash2
                          color="red"
                          cursor={"pointer"}
                          onClick={() => removeWeeklyPlan(planIndex)}
                        />
                      </div>
                    )}
                  </div>
                  {index === undefined && (
                    <div className="form-group">
                      <label className="block">Days</label>
                      <div className="grid grid-cols-2 gap-4">
                        {weekDates.map(
                          (day, index) =>
                            (!selectedDays.includes(day.days) ||
                              values.days.includes(day.days)) && (
                              <label key={index} className="flex items-center">
                                <Field
                                  type="checkbox"
                                  name="days"
                                  value={day.days}
                                  className="mr-2"
                                  onChange={(e) => {
                                    const newDays = e.target.checked
                                      ? [...values.days, day.days]
                                      : values.days.filter(
                                          (date) => date !== day.days
                                        );
                                    handleWeeklyPlanChange(
                                      planIndex,
                                      "days",
                                      newDays,
                                      setFieldValue,
                                      values
                                    );
                                    // validateForm();
                                  }}
                                />
                                {day.label}
                              </label>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* <div className="form-group flex space-x-4 mb-2 mt-4">
                    <div className="w-1/3">
                      <p> Meals Per Day</p>
                      <Field
                        type="number"
                        name="mealsPerDay"
                        placeholder="Meals Per Day"
                        className="w-full p-2 mt-1 border rounded-md"
                        onChange={(e) =>
                          handleWeeklyPlanChange(
                            planIndex,
                            "mealsPerDay",
                            e.target.value,
                            setFieldValue,
                            values
                          )
                        }
                        min="1"
                      />
                      <ErrorMessage
                        name="mealsPerDay"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className="w-1/3">
                      <p> Snacks Per Day</p>
                      <Field
                        type="number"
                        name="snacksPerDay"
                        placeholder="Snacks Per Day"
                        className="w-full p-2 mt-1 border rounded-md"
                        min="1"
                        onChange={(e) =>
                          handleWeeklyPlanChange(
                            planIndex,
                            "snacksPerDay",
                            e.target.value,
                            setFieldValue,
                            values
                          )
                        }
                      />
                      <ErrorMessage
                        name="snacksPerDay"
                        component="div"
                        className="text-red-500"
                      />
                    </div>

                    <div className="w-1/3">
                      <p> Add-ons Per Day</p>
                      <Field
                        type="number"
                        name="addOnsPerDay"
                        placeholder="Add-ons Per Day"
                        className="w-full p-2 mt-1 border rounded-md"
                        min="1"
                        onChange={(e) =>
                          handleWeeklyPlanChange(
                            planIndex,
                            "addOnsPerDay",
                            e.target.value,
                            setFieldValue,
                            values
                          )
                        }
                      />
                      <ErrorMessage
                        name="addOnsPerDay"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                  </div> */}

                  <FieldArray name="meals">
                    {({ push, remove }) => (
                      <div>
                        <h3 className="font-semibold mt-4">Meals</h3>
                        {values.meals.map((meal, index) => (
                          <div
                            key={index}
                            className="p-4 mt-2 border-2 border-gray-200  rounded-md relative"
                          >
                            <div className="absolute mb-1 mr-1 flex items-center justify-center top-1 right-1">
                              <X
                                onClick={() => {
                                  const confirmDelete = window.confirm(
                                    "Are you sure you want to remove this meal?"
                                  );
                                  if (confirmDelete) {
                                    // remove(index);
                                    handleWeeklyPlanChange(
                                      planIndex,
                                      "meals",
                                      values.meals.filter(
                                        (meal, i) => i !== index
                                      ),
                                      setFieldValue,
                                      values
                                    );
                                  }
                                }}
                                color="red"
                                cursor="pointer"
                              />
                            </div>

                            <div className="form-group flex space-x-4">
                              <div className="flex flex-col w-full">
                                <p>Meal Title</p>
                                <Field
                                  as="select"
                                  name={`meals[${index}].mealTitle`}
                                  className="p-2 mt-1 border rounded-md"
                                  onChange={(e) =>
                                    handleWeeklyPlanChange(
                                      planIndex,
                                      `meals[${index}].mealTitle`,
                                      e.target.value,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                >
                                  <option value="" disabled>
                                    Select a meal Title
                                  </option>
                                  {categories.map((title) => (
                                    <option key={title} value={title.name}>
                                      {title.categoryName}
                                    </option>
                                  ))}
                                </Field>
                              </div>

                              <div className="flex flex-col w-full">
                                <p>Portion Size</p>
                                <Field
                                  type="number"
                                  name={`meals[${index}].portionSize`}
                                  placeholder="Portion Size"
                                  className="p-2 mt-1 border rounded-md"
                                  min="1"
                                  onChange={(e) =>
                                    handleWeeklyPlanChange(
                                      planIndex,
                                      `meals[${index}].portionSize`,
                                      e.target.value,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="form-group mt-2">
                              <p>Recipe</p>
                              <div className="w-full p-2 mt-1 border rounded-md bg-white">
                                <Select
                                  placeholder="Select Recipe"
                                  value={
                                    meal.recipes
                                      ? {
                                          value:
                                            meal.recipes._id || meal.recipes, // Use `_id` or the value directly
                                          label:
                                            meal.recipes.name || // Use name if available
                                            recipes.find(
                                              (recipe) =>
                                                recipe._id === meal.recipes
                                            )?.name ||
                                            meal.recipes, // Fall back to the raw value
                                        }
                                      : null
                                  }
                                  options={recipes?.map((recipe) => ({
                                    value: recipe._id,
                                    label: recipe.name,
                                  }))}
                                  onChange={(selectedOption) =>
                                    handleWeeklyPlanChange(
                                      planIndex,
                                      `meals[${index}].recipes`,
                                      selectedOption?.value,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                  className="basic-single"
                                  classNamePrefix="select"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center">
                          <div>
                            <button
                              type="button"
                              className="btn btn-outline text-black p-2 rounded-md mt-4"
                              onClick={() =>
                                push({
                                  mealTitle: "",
                                  portionSize: "",
                                  complexityLevel: "",
                                  recipes: "",
                                })
                              }
                            >
                              Add Meal
                            </button>
                          </div>
                          {/* <div className="form-group">
                            <label className="flex items-center">
                              <Field
                                type="checkbox"
                                name="isPublished"
                                className="mr-2"
                                onChange={(e) =>
                                  handleWeeklyPlanChange(
                                    planIndex,
                                    "isPublished",
                                    e.target.checked,
                                    setFieldValue,
                                    values
                                  )
                                }
                              />
                              Published
                            </label>
                          </div> */}
                        </div>
                      </div>
                    )}
                  </FieldArray>
                </Form>
              </>
            );
          }}
        </Formik>
      ))}
      {index === undefined && (
        <button
          type="button"
          className="btn btn-danger text-white p-2 rounded-md mt-4"
          onClick={addWeeklyPlan}
        >
          Add another Plan
        </button>
      )}
      <div className="text-right mt-4">
        <button
          type="button"
          className="btn btn-primary text-white p-2 rounded-md"
          onClick={() => handleSubmit()}
        >
          {loading ? (
            <LoadingIcon
              icon="tail-spin"
              color="white"
              className="w-8 h-6 ml-2"
            />
          ) : (
            "Save Meal Plan"
          )}
        </button>
      </div>
    </div>
  );
};

export default WeeklyPlanForm;
