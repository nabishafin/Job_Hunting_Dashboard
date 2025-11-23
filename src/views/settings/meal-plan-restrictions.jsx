import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import {  MEAL_RESTRICTIONS } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { init } from "../../base-components/litepicker";

const MealPlanRestrictions = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const [MealPlanRestrictionsData, setMealPlanRestrictionsData] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();


  const getMealPlanRestrictions = async () => {

    try{

      setMealPlanRestrictionsData({
        breakfast: 1,
        lunch: 1,
        dinner: 1,
        dessert: 1,
        snacks: 1,
        addon: 1,
      });

    }catch(error){
      console.error("Error:", error?.response?.data);
     
 
  }finally{
      setPageLoading(false);
    }
  }

  useEffect(() => {
   getMealPlanRestrictions()
  }, []);

  // Formik initialization with validation schema
  const formik = useFormik({
    enableReinitialize: true, 
    initialValues: {
      breakfast: MealPlanRestrictionsData?.breakfast || "",
      lunch: MealPlanRestrictionsData?.lunch || "",
      dinner: MealPlanRestrictionsData?.dinner || "",
      dessert: MealPlanRestrictionsData?.dessert || "",
      snacks: MealPlanRestrictionsData?.snacks || '',
     addon: MealPlanRestrictionsData?.addon || "",

    },
    validationSchema: Yup.object({
        breakfast: Yup.number().required("Breakfast restriction is required"),
      lunch: Yup.number()
        .required("Lunch restriction is required"),
  
      dinner: Yup.string().required("Dinner restriction is required"),
      dessert: Yup.number().required("Dessert restriction is required"),
        snacks: Yup.number().required("Snacks restriction is required"),
      addon: Yup.number().required("Addon restriction is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      let url = MEAL_RESTRICTIONS ;
      let method = httpRequest.put

      try {
        const response = await method(url, values, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response?.data?.message || "Restriction saved successfully");
          setLoading(false);
        } else {
          toast.error("An error occurred while saving the coupon");
        }
      } catch (error) {
        toast.error(
          error?.response?.data.message || "An unknown error occurred."
        );
        if (error?.response?.status === 401) {
          unauthenticate();
        }
        console.error("Error:", error?.response?.data);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = formik;


  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
        <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-2">
        <button
          className="btn btn-primary"
          onClick={() => window.history.go(-1)}
        >
          Back
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="pb-6 text-lg font-semibold">
          {isEdit ? "Set meal plan restrictions" : "Add meal plan restrictions"}
        </p>
      </div>
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        <div className="flex   gap-4">
          <div className="w-full md:w-1/2">
            <p>Breakfast</p>
            <input
              type="number"
              name="breakfast"
              value={values.breakfast}
              placeholder="Breakfast restriction"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.breakfast && errors.breakfast && (
              <div className="text-red-500 text-sm">{errors.breakfast}</div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <p>Lunch</p>
            <input
              type="number"
              name="lunch"
              value={values.lunch}
              placeholder="Lunch restriction"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.lunch && errors.lunch && (
              <div className="text-red-500 text-sm">
                {errors.lunch}
              </div>
            )}
          </div>
        </div>

        <div className="flex   gap-4 mt-4">
          <div className="w-full md:w-1/2">
            <p>Dinner</p>
            <input
              type="text"
              name="dinner"
              value={values.dinner}
              placeholder="Dinner restriction"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.dinner && errors.dinner && (
              <div className="text-red-500 text-sm">{errors.dinner}</div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <p>Dessert</p>
            <input
              type="number"
              name="dessert"
              value={values.dessert}
              placeholder="Dessert restriction"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.dessert && errors.dessert && (
              <div className="text-red-500 text-sm">{errors.dessert}</div>
            )}
          </div>
        </div>


        <div className="flex   gap-4 mt-4">
          <div className="w-full md:w-1/2">
            <p>Add On</p>
            <input
              type="text"
              name="addon"
              value={values.addon}
              placeholder="Add On restriction"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.addon && errors.addon && (
              <div className="text-red-500 text-sm">{errors.addon}</div>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <p>Snacks</p>
            <input
              type="number"
              name="snacks"
              value={values.snacks}
              placeholder="Snacks restriction"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.snacks && errors.snacks && (
              <div className="text-red-500 text-sm">{errors.snacks}</div>
            )}
          </div>
        </div>
      </div>


      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`mt-4 px-4 py-2 ml-2 btn btn-primary shadow-md ${
          loading || isSubmitting ? "cursor-not-allowed opacity-70" : ""
        }`}
        disabled={loading || isSubmitting}
      >
        {loading || isSubmitting ? (
          <LoadingIcon
            icon="tail-spin"
            color="white"
            className="w-6 h-4 ml-2"
          />
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};

export default MealPlanRestrictions;
