import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { GROCERY_INGREDIENTS } from "../../constants";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Formik, Field, FieldArray, Form } from "formik";
import * as Yup from "yup";

const IngredientsForm = () => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const recipieData = location.state?.data;
  const editIndex = location.state?.index;
  const activetab = location.state?.activeTabIndex;
  const disableIngredientForm = location.state?.disableIngredientForm || null;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  console.log(editIndex);

  console.log("active tab", activetab);

  useEffect(() => {
    if (recipieData) {
      setIsEdit(true);
    }
  }, [recipieData]);

  const initialValues = {
    name: recipieData?.name || "",
    displayNumber: recipieData?.order || "",
    ingredients: recipieData?.ingredients || [
      {
        name: "",
        specificity1: "",
        specificity2: "",
        specificity3: "",
        quantity: "",
        measurement: "",
        calories: "",
        proteins: "",
        fats: "",
        carbs: "",
        sugar: "",
        sodium: "",
      },
    ],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
    displayNumber: Yup.number().required("Display number is required"),
    ingredients: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Ingredient name is required"),
        // specificity1: Yup.string().required("Specificity 1 is required"),
        // specificity2: Yup.string().required("Specificity 2 is required"),
        // specificity3: Yup.string().required("Specificity 3 is required"),
        quantity: Yup.string().required("Quantity is required"),
        measurement: Yup.string().required("Measurement is required"),
        calories: Yup.number()
          .required("Calories is required")
          .min(0, "Calories must be 0 or higher"),
        // proteins: Yup.number()
        //   .required("Proteins is required")
        //   .min(0, "Proteins must be 0 or higher"),
        // fats: Yup.number()
        //   .required("Fats is required")
        //   .min(0, "Fats must be 0 or higher"),
        // carbs: Yup.number()
        //   .required("Carbs is required")
        //   .min(0, "Carbs must be 0 or higher"),
        // sugar: Yup.number()
        //   .required("Sugar is required")
        //   .min(0, "Sugar must be 0 or higher"),
        // sodium: Yup.number()
        //   .required("Sodium is required")
        //   .min(0, "Sodium must be 0 or higher"),
      })
    ),
    // .min(1, "At least one ingredient is required"),
  });

  const handleSubmit = async (values) => {
    console.log(values);
    setLoading(true);
    const url = isEdit
      ? `${GROCERY_INGREDIENTS}/${recipieData._id}`
      : GROCERY_INGREDIENTS;
    const method = isEdit ? httpRequest.put : httpRequest.post;

    const payload = disableIngredientForm
      ? { name: values.name, displayNumber: values.displayNumber }
      : values;

    try {
      const response = await method(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message);
        navigate("/Ingredients", { state: { activetab:  response?.data.category?.order - 1   } });
      } else {
        toast.error("Only super Admins can login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data.message || "An unknown error occurred."
      );
      console.error("Submit failed:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-4">
        <button
          className="btn btn-primary"
          onClick={() =>
            navigate("/Ingredients", { state: { activetab: activetab } })
          }
        >
          Back
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="pb-6 text-lg font-semibold">Grocery Ingredients</p>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={disableIngredientForm ? null : validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            {editIndex === undefined && (
              <div>
                <p>Category name</p>
                <Field
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  className="w-full p-2 mt-2 border rounded-md"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
            )}
            {
              editIndex === undefined && ( <div className="pt-4">
                <p>Display number</p>
                <Field
                  type="number"
                  name="displayNumber"
                  placeholder="Display Number"
                  className="w-full p-2 mt-2 border rounded-md"
                />
                {errors.displayNumber && touched.displayNumber && (
                  <p className="text-red-500 text-sm">{errors.displayNumber}</p>
                )}
              </div>)
            }
           

            {!disableIngredientForm && (
              <FieldArray name="ingredients">
                {({ remove, push }) => (
                  <>
                    {values.ingredients.map(
                      (ingredient, index) =>
                        (editIndex === index || editIndex === undefined) && (
                          <div
                            key={index}
                            className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6 mt-4"
                          >
                            {editIndex === undefined && (
                              <div className="flex justify-end">
                                {values.ingredients.length > 1 && (
                                  <X
                                    color="red"
                                    cursor="pointer"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to remove this item?"
                                        )
                                      ) {
                                        remove(index);
                                      }
                                    }}
                                  />
                                )}
                              </div>
                            )}
                            <div className="flex flex-wrap">
                              <div className="flex-1 pr-2 pb-2">
                                <p>Ingredient name</p>
                                <Field
                                  type="text"
                                  name={`ingredients[${index}].name`}
                                  placeholder="Ingredient Name"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.name &&
                                  touched.ingredients?.[index]?.name && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].name}
                                    </p>
                                  )}
                              </div>
                              <div className="flex-1 pl-2">
                                <p>Specificity 1</p>
                                <Field
                                  type="text"
                                  name={`ingredients[${index}].specificity1`}
                                  placeholder="Specificity 1"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.specificity1 &&
                                  touched.ingredients?.[index]
                                    ?.specificity1 && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].specificity1}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="flex flex-wrap">
                              <div className="flex-1 pr-2">
                                <p>Specificity 2</p>
                                <Field
                                  type="text"
                                  name={`ingredients[${index}].specificity2`}
                                  placeholder="Specificity 2"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.specificity2 &&
                                  touched.ingredients?.[index]
                                    ?.specificity2 && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].specificity2}
                                    </p>
                                  )}
                              </div>
                              <div className="flex-1 pl-2 pb-2">
                                <p>Specificity 3</p>
                                <Field
                                  type="text"
                                  name={`ingredients[${index}].specificity3`}
                                  placeholder="Specificity 3"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.specificity3 &&
                                  touched.ingredients?.[index]
                                    ?.specificity3 && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].specificity3}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="flex flex-wrap">
                              <div className="flex-1 pr-2">
                                <p>Quantity</p>
                                <Field
                                  type="text"
                                  name={`ingredients[${index}].quantity`}
                                  placeholder="Quantity"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.quantity &&
                                  touched.ingredients?.[index]?.quantity && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].quantity}
                                    </p>
                                  )}
                              </div>
                              <div className="flex-1 pl-2">
                                <p>Measurement</p>
                                <Field
                                  type="text"
                                  name={`ingredients[${index}].measurement`}
                                  placeholder="Measurement (e.g., kg, pieces)"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.measurement &&
                                  touched.ingredients?.[index]?.measurement && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].measurement}
                                    </p>
                                  )}
                              </div>
                            </div>

                            <div className="flex flex-wrap pt-2">
                              <div className="flex-1 pr-2">
                                <p>Calories</p>
                                <Field
                                  type="number"
                                  name={`ingredients[${index}].calories`}
                                  placeholder="Calories"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.calories &&
                                  touched.ingredients?.[index]?.calories && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].calories}
                                    </p>
                                  )}
                              </div>
                              <div className="flex-1 pl-2">
                                <p>Protein</p>
                                <Field
                                  type="number"
                                  name={`ingredients[${index}].proteins`}
                                  placeholder="Protein"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.proteins &&
                                  touched.ingredients?.[index]?.proteins && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].proteins}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="flex flex-wrap pt-2">
                              <div className="flex-1 pr-2">
                                <p>Carbs</p>
                                <Field
                                  type="number"
                                  name={`ingredients[${index}].carbs`}
                                  placeholder="Carbs"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.carbs &&
                                  touched.ingredients?.[index]?.carbs && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].carbs}
                                    </p>
                                  )}
                              </div>
                              <div className="flex-1 pl-2">
                                <p>Fat</p>
                                <Field
                                  type="number"
                                  name={`ingredients[${index}].fats`}
                                  placeholder="Fat"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.fats &&
                                  touched.ingredients?.[index]?.fats && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].fats}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="flex flex-wrap pt-2">
                              <div className="flex-1 pr-2">
                                <p>Sugar</p>
                                <Field
                                  type="number"
                                  name={`ingredients[${index}].sugar`}
                                  placeholder="Sugar"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.sugar &&
                                  touched.ingredients?.[index]?.sugar && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].sugar}
                                    </p>
                                  )}
                              </div>
                              <div className="flex-1 pl-2">
                                <p>Sodium</p>
                                <Field
                                  type="number"
                                  name={`ingredients[${index}].sodium`}
                                  placeholder="Sodium"
                                  className="w-full p-2 border rounded-md mt-2"
                                />
                                {errors.ingredients?.[index]?.sodium &&
                                  touched.ingredients?.[index]?.sodium && (
                                    <p className="text-red-500 text-sm">
                                      {errors.ingredients[index].sodium}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        )
                    )}
                    {editIndex === undefined && (
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            name: "",
                            specificity1: "",
                            specificity2: "",
                            specificity3: "",
                            quantity: "",
                            measurement: "",
                            calories: "",
                            proteins: "",
                            carbs: "",
                            fats: "",
                            sugar: "",
                            sodium: "",
                          })
                        }
                        className="mt-4 px-4 py-2 btn btn-secondary shadow-md"
                      >
                        Add Ingredient
                      </button>
                    )}
                  </>
                )}
              </FieldArray>
            )}

            <button
              type="submit"
              className={`mt-4 px-4 py-2 ml-2 btn btn-primary shadow-md ${
                loading ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  className="w-8 h-6 ml-2"
                />
              ) : (
                "Submit"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default IngredientsForm;
