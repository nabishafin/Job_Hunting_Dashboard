import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { REGISTER_USER, UPDATE_USER } from "../../constants";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { Lucide } from "../../base-components";

const AddBlog = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const userData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setIsEdit(true);
      setPreview(userData.image);
    }
  }, [userData]);

  const initialValues = {
    title: userData?.title || "",
    status: userData?.status || 1,
    description: userData?.description || "",
    image: userData?.image || null,
    isEdit: userData ? true : false,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .max(50, "Maximum 50 characters")
      .required("Title cannot be empty"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit
        ? `/admin/edit-blog/${userData._id}`
        : "/admin/add-blog";
      const method = isEdit ? httpRequest.post : httpRequest.post;

      const formData = new FormData();

      // Append non-empty fields to formData
      Object.keys(values).forEach((key) => {
        if (
          values[key] !== "" &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          formData.append(key, values[key]);
        }
      });

      // console.log(formData, "formData");
      // return;

      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.data?.message || "Blog details saved successfully."
        );
        navigate("/blogs");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unknown error occurred."
      );
      console.error("Error:", error?.response?.data);

      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
    } finally {
      setSubmitting(false);
    }
  };
   const [preview, setPreview] = useState(null);

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row mt-2 mb-4 justify-between items-center">
        <p className="text-xl font-bold uppercase">
          {isEdit ? "Edit Blog" : "Add New Blog"}
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
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="border-0 border-gray-200 bg-white dark:bg-transparent shadow-md rounded-lg p-6">
              <div className="flex gap-4 ">
                <div className="w-full">
                  <p>Title</p>
                  <Field
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                <div className="w-full">
                  <p>Status</p>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="w-full mt-4">
                <p>Description</p>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter Description"
                  className="p-2 mt-1 border rounded-md w-full"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="w-full mt-4">
                <p>Image</p>
               <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(event) => {
          const file = event.currentTarget.files[0];

          if (file) {
            // Set the binary File object for API
            setFieldValue("image", file);

            // Read as base64 for preview only
            const reader = new FileReader();
            reader.onload = () => {
              setPreview(reader.result); // base64 preview
            };
            reader.readAsDataURL(file); // do not send this to backend
          }
        }}
        className="mt-2"
      />

                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-red-600"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Current"
                    className="h-32 mb-2  w-32 rounded-full border mt-4"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="custom_black_button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingIcon
                    icon="tail-spin"
                    color="white"
                    className="w-8 h-6 ml-2"
                  />
                ) : (
                  <>{isEdit ? "Update Blog" : "Save Blog"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddBlog;
