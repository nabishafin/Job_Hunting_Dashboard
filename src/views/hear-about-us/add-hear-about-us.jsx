import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { CANCELLATION_REASON, HEAR_ABOUT_US } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

const AddHearAboutUs = () => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const hearAboutUsData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  console.log(hearAboutUsData);
  

  useEffect(() => {
    if (hearAboutUsData) {
      setIsEdit(true);
    }
  }, [hearAboutUsData]);

  const formik = useFormik({
    initialValues: {
      reason: hearAboutUsData?.reason || "",
    },
    validationSchema: Yup.object({
      reason: Yup.string().required("Reason is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      let url = isEdit ? `${HEAR_ABOUT_US}/${hearAboutUsData._id}` : HEAR_ABOUT_US;
      let method = isEdit ? httpRequest.put : httpRequest.post;

      try {
        const response = await method(url, values, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(response?.data?.message || "Saved successfully");
          setLoading(false);
          navigate("/hear-about-us");
        } else {
          toast.error("An error occurred while saving the cancellation reason");
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
          {/* {isEdit ? "Edit" : "Add "} Hear About Us */}
        </p>
      </div>
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        <div className="flex gap-4">
          {/* Platform Name Field */}
          <div className="w-full">
            {/* <p>C</p> */}
            <input
              type="text"
              name="reason"
              value={values.reason}
              placeholder="Enter hear about us "
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.reason && errors.name && (
              <div className="text-red-500 text-sm">{errors.reason}</div>
            )}
          </div>

          {/* Link Field */}
          {/* <div className="w-1/2">
            <p>Link</p>
            <input
              type="text"
              name="link"
              value={values.link}
              placeholder="Link"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.link && errors.link && (
              <div className="text-red-500 text-sm">{errors.link}</div>
            )}
          </div> */}
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

export default AddHearAboutUs;
