import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { PROTEIN_STYLE_DROPDOWN } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

const AddProteinTypeDropdown = () => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const linksData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  console.log(linksData);

  useEffect(() => {
    if (linksData) {
      setIsEdit(true);
    }
  }, [linksData]);

  const formik = useFormik({
    initialValues: {
      proteinStyle: linksData?.proteinStyle || "",
    },
    validationSchema: Yup.object({
      proteinStyle: Yup.string().required("Protein Type option is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      let url = isEdit
        ? `${PROTEIN_STYLE_DROPDOWN}/${linksData._id}`
        : PROTEIN_STYLE_DROPDOWN;
      let method = isEdit ? httpRequest.put : httpRequest.post;

      try {
        const response = await method(url, values, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          toast.success(
            response?.data?.message || "Protein Type dropdown saved successfully"
          );
          setLoading(false);
          navigate("/protein-type-option");
        } else {
          toast.error("An error occurred while saving the protein type dropdown");
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
          {isEdit ? "Edit" : "Add "} Add Protein Type Dropdown
        </p>
      </div>
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        <div className="flex gap-4">
          {/* Platform Name Field */}
          <div className="w-full">
            <p>Protein Type</p>
            <input
              type="text"
              name="proteinStyle"
              value={values.proteinStyle}
              placeholder="Please enter the protein type"
              className="w-full p-2 mt-2 border rounded-md"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.proteinStyle && errors.name && (
              <div className="text-red-500 text-sm">{errors.proteinStyle}</div>
            )}
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

export default AddProteinTypeDropdown;
