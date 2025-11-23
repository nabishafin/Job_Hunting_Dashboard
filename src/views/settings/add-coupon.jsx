import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { COUPONS } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

const AddCoupon = () => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const couponData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();

  useEffect(() => {
    if (couponData) {
      setIsEdit(true);
    }
  }, [couponData]);

  // Formik initialization with validation schema
  const formik = useFormik({
    initialValues: {
      name: couponData?.name || "",
      discountPercentage: couponData?.discountPercentage || "",
      couponCode: couponData?.couponCode || "",
      maxUsed: couponData?.maxUsed || "",
      // couponusage: couponData?.maxUsed || "",
      // limit: couponData?.limit || "",
      status: couponData?.status !== undefined ? couponData.status : true,
      expiryDate: couponData?.expiryDate
        ? new Date(couponData.expiryDate).toISOString().split("T")[0]
        : "",
      usageCount: couponData?.usageCount || 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Coupon Name is required"),
      discountPercentage: Yup.number()
        .required("Discount Percentage is required")
        .min(0, "Discount must be at least 0%")
        .max(100, "Discount cannot exceed 100%"),
      couponCode: Yup.string().required("Coupon Code is required"),
      maxUsed: Yup.number().required("Max Used is required").min(1),
      expiryDate: Yup.date().required("Expiry Date is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      let url = isEdit ? `${COUPONS}/${couponData._id}` : COUPONS;
      let method = isEdit ? httpRequest.put : httpRequest.post;

      try {
        const response = await method(url, values, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response?.data?.message || "Coupon saved successfully");
          setLoading(false);
          navigate("/coupons");
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

  const [loading, setLoading] = useState(false);

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
          {isEdit ? "Edit coupon" : "Add coupon"}
        </p>
      </div>
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        <div className="flex   gap-4">
          {/* Coupon Name */}
          <div className="w-full md:w-1/2">
            <p>Coupon Name</p>
            <input
              type="text"
              name="name"
              value={values.name}
              placeholder="Coupon Name"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
            )}
          </div>

          {/* Discount Percentage */}
          <div className="w-full md:w-1/2">
            <p>Discount Percentage</p>
            <input
              type="number"
              name="discountPercentage"
              value={values.discountPercentage}
              placeholder="Discount Percentage"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.discountPercentage && errors.discountPercentage && (
              <div className="text-red-500 text-sm">
                {errors.discountPercentage}
              </div>
            )}
          </div>
        </div>

        {/* Coupon Code */}
        <div className="flex   gap-4 mt-4">
          <div className="w-full md:w-1/2">
            <p>Coupon code</p>
            <input
              type="text"
              name="couponCode"
              value={values.couponCode}
              placeholder="Coupon Code"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.couponCode && errors.couponCode && (
              <div className="text-red-500 text-sm">{errors.couponCode}</div>
            )}
          </div>

          {/* Max used */}
          <div className="w-full md:w-1/2">
            <p>Coupon usage</p>
            <input
              type="number"
              name="maxUsed"
              value={values.maxUsed}
              placeholder="Max number of times coupon can be used"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.maxUsed && errors.maxUsed && (
              <div className="text-red-500 text-sm">{errors.maxUsed}</div>
            )}
          </div>
        </div>

        {/* Expiry Date */}
        <div className="mt-4">
          <p>Expiry date</p>
          <input
            type="date"
            name="expiryDate"
            value={values.expiryDate}
            placeholder="Expiry Date"
            className="w-full p-2 mt-2 border rounded-md"
            onChange={handleChange}
            onBlur={handleBlur}
            min={new Date().toISOString().split("T")[0]}
          />
          {touched.expiryDate && errors.expiryDate && (
            <div className="text-red-500 text-sm">{errors.expiryDate}</div>
          )}
        </div>

        {/* Active/Inactive Checkbox */}
        <div className="mt-4 flex items-center">
          <label className="mr-2">Active</label>
          <input
            type="checkbox"
            name="status"
            checked={values.status}
            onChange={(e) => formik.setFieldValue("status", e.target.checked)}
          />
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

export default AddCoupon;
