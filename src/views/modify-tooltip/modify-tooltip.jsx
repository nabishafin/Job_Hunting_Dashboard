import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { COUPONS, TOOLTIP_RESTRICTIONS } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

const ModifyTooltip = () => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const [tooltipData, setTooltipData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();

  const [formValues, setFormValues] = useState({
    preferences: "",
    mySubscription: "",
    mySavedPreferences: "",
    levelOfComplexity: "",
    maximumCalories: "",
    totalTimeNeeded: "",
    hideCalories: "",
    discountCode: "",
  });

  const getMealPlanRestrictions = async () => {
    try {
      setTooltipData({
        preferences: "Preferences",
        mySubscription: "My Subscription",
        mySavedPreferences: "My Saved Preferences",
        levelOfComplexity: "Level Of Complexity",
        maximumCalories: "Maximum Calories",
        totalTimeNeeded: "Total Time Needed",
        hideCalories: "Hide Calories",
        discountCode: "Discount Code",
      });
    } catch (error) {
      console.error("Error:", error?.response?.data);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getMealPlanRestrictions();
  }, []);

  useEffect(() => {
    if (tooltipData) {
      setFormValues({
        preferences: tooltipData.preferences || "",
        mySubscription: tooltipData.mySubscription || "",
        mySavedPreferences: tooltipData.mySavedPreferences || "",
        levelOfComplexity: tooltipData.levelOfComplexity || "",
        maximumCalories: tooltipData.maximumCalories || "",
        totalTimeNeeded: tooltipData.totalTimeNeeded || "",
        hideCalories: tooltipData.hideCalories || "",
        discountCode: tooltipData.discountCode || "",
      });
    }
  }, [tooltipData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const url = TOOLTIP_RESTRICTIONS;
    const method = httpRequest.put;

    try {
      const response = await method(url, formValues, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message || "Tooltip saved successfully");
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
    } finally {
      setLoading(false);
    }
  };

  console.log(tooltipData);

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
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="py-3 text-lg font-semibold">Set tooltips text</p>
      </div>
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        {Object.keys(formValues).map((key) => (
          <div key={key} className="flex gap-4 mt-4">
            <div className="w-full">
              <label className="block font-normal">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <textarea
                type="text"
                name={key}
                value={formValues[key]}
                placeholder={`Enter ${key
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()} data`}
                className="w-full p-2 mt-2 border rounded-md"
                onChange={handleChange}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className={`mt-4 px-4 py-2 btn btn-primary shadow-md ${
          loading ? "cursor-not-allowed opacity-70" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
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

export default ModifyTooltip;
