import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { PRICING_PLANS } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

const ADDPLANS = () => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const linksData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const [descriptions, setDescriptions] = useState(
    linksData?.descriptions || [""]
  );
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();

  useEffect(() => {
    if (linksData) {
      setIsEdit(true);
    }
  }, [linksData]);

  const addDescription = () => {
    setDescriptions([...descriptions, ""]);
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
  };

  const removeDescription = (index) => {
    const newDescriptions = descriptions.filter((_, i) => i !== index);
    setDescriptions(newDescriptions);
  };

  const formik = useFormik({
    initialValues: {
      name: linksData?.name || "",
      usdPrice: linksData?.usdPrice || "",
      cadPrice: linksData?.cadPrice || "",
      length: linksData?.length || "",
      status: linksData?.status || false
      
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Plan Name is required"),
      usdPrice: Yup.number().required("USD Price is required").min(0),
      cadPrice: Yup.number().required("CAD Price is required").min(0),
      length: Yup.number().required("Length is required").min(0),

    }),
    onSubmit: async (values) => {
      setLoading(true);
      console.log(values);

      let url = isEdit ? `${PRICING_PLANS}/${linksData._id}` : PRICING_PLANS;
      let method = isEdit ? httpRequest.put : httpRequest.post;

      try {
        const response = await method(
          url,
          { ...values, descriptions },

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          toast.success(response?.data?.message || "Plan saved successfully");
          setLoading(false);
          navigate("/plans");
        } else {
          toast.error("An error occurred while saving the Link");
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
          {isEdit ? "Edit" : "Add "} plan
        </p>
      </div>

      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        <div className="flex gap-4">
          {/* Plan Name Field */}
          <div className="flex-1">
            <p className="text-md">Plan Name</p>
            <input
              type="text"
              name="name"
              value={values.name}
              placeholder="Plan Name"
              className="w-full p-2 mt-2 border rounded-md "
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.name && errors.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
            )}
          </div>

          {/* Price Field */}
          <div className="flex-1">
            <p className="text-md">CAD Price</p>
            <input
              type="number"
              name="cadPrice"
              value={values.cadPrice}
              placeholder="CAD Price"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.cadPrice && errors.cadPrice && (
              <div className="text-red-500 text-sm">{errors.cadPrice}</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-md">USD Price</p>
            <input
              type="number"
              name="usdPrice"
              value={values.usdPrice}
              placeholder="USD Price"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.usdPrice && errors.usdPrice && (
              <div className="text-red-500 text-sm">{errors.usdPrice}</div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-md">Length (Days)</p>
            <input
              type="number"
              name="length"
              value={values.length}
              placeholder="Length (Days)"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.length && errors.length && (
              <div className="text-red-500 text-sm">{errors.length}</div>
            )}
          </div>
        </div>

        {/* Descriptions and Submit Button Sections (unchanged) */}
        <div className="mt-4">
          <p className="text-md">Descriptions</p>
          {descriptions.map((description, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={description}
                placeholder="Description"
                className="w-full p-2 border rounded-md"
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
              />
              <button
                onClick={() => removeDescription(index)}
                className="ml-2 px-2 py-1 btn btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addDescription}
            className="mt-2 px-4 py-2 btn btn-secondary"
          >
            Add description
          </button>
        </div>
        <div>
          <div className="mt-4 flex items-center">
            <label className="mr-2">Active</label>
            <input
              type="checkbox"
              name="status"
              checked={values.status === true}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

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

export default ADDPLANS;
