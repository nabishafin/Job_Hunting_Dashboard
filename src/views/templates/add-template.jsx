import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { ARTISTS, TEMPLATES } from "../../constants";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { Lucide } from "../../base-components";

const AddTemplates = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const artistData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (artistData) {
      setIsEdit(true);
    }
  }, [artistData]);

  const initialValues = {
    template: artistData?.template || "",
    theme_category: artistData?.theme_category || "",
    narrative_text: artistData?.narrative_text || "",
    enneagram_match: artistData?.enneagram_match || "",
    auto_assignment_priority: artistData?.auto_assignment_priority || "",
    template_id: artistData?.template_id || "",
    // style: artistData?.style || "",
    status: artistData?.status || "Active",
  };

  const validationSchema = Yup.object({
    template: Yup.string().required("Template is required"),
    theme_category: Yup.string()
      .required("Theme category is required"),
      narrative_text: Yup.string()
      // .max(10, "Country must be at most 10 characters")
      .required("Narrative Text is required"),
      enneagram_match: Yup.string()
      // .max(10, "Description must be at most 10 characters")
      .required("enneagram_match is required"),
      auto_assignment_priority: Yup.string().required("auto_assignment_priority is required"),
    // .max(100, "Domain must be at most 100 characters")
    template_id: Yup.string().required("template_id is required"),
    // .max(100, "Medium must be at most 100 characters")
    // style: Yup.string().required("Style is required"),
    // .max(100, "Style must be at most 100 characters"),
    status: Yup.string().required("Status is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit ? `${TEMPLATES}/${artistData._id}` : TEMPLATES;
      const method = isEdit ? httpRequest.put : httpRequest.post;

      const response = await method(url, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.data?.message || "Artist details saved successfully."
        );
        navigate("/templates");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unknown error occurred."
      );
      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-4 justify-between">
        <p className="text-lg font-semibold">
          {isEdit ? "Edit Templates" : "Add New Templates"}
        </p>
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => window.history.back(-1)}
          aria-label="Go Back"
        >
          <Lucide icon="ArrowLeft" />
          Back
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-full">
                  <p>Template</p>
                  <Field
                    as="textarea"
                    name="template"
                    placeholder="template"
                    className="w-full p-2 mt-2 border rounded-md"
                    rows="4"
                  />
                  <ErrorMessage
                    name="template"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Theme Category</p>
                  <Field
                    type="text"
                    name="theme_category"
                    placeholder="Theme Category"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="theme_category"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Narrative Text</p>
                  <Field
                    as="textarea"
                    name="narrative_text"
                    placeholder="narrative_text"
                    className="w-full p-2 mt-2 border rounded-md"
                    rows="4"
                  />
                  <ErrorMessage
                    name="narrative_text"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Enneagram Match</p>
                  <Field
                    type="text"
                    name="enneagram_match"
                    placeholder="enneagram_match"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="enneagram_match"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Auto Assignment Priority</p>
                  <Field
                    type="text"
                    name="auto_assignment_priority"
                    placeholder="auto_assignment_priority"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="auto_assignment_priority"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Template Id</p>
                  <Field
                    type="text"
                    name="template_id"
                    placeholder="template_id"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="template_id"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* <div className="mt-4">
                <p>Enneagram Match</p>
                <Field
                  as="textarea"
                  name="enneagram_match"
                  placeholder="enneagram_match"
                  className="w-full p-2 mt-2 border rounded-md"
                  rows="4"
                />
                <ErrorMessage
                  name="enneagram_match"
                  component="div"
                  className="text-red-600"
                />
              </div> */}

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Status</p>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary p-2 mt-6 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  className="w-8 h-6 ml-2"
                />
              ) : (
                "Save Artist"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTemplates;
