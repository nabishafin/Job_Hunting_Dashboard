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

const AddItems = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const userData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  console.log(userData, "userData");
  useEffect(() => {
    if (userData) {
      setIsEdit(true);
      setPreview(userData?.image);
    }
  }, [userData]);

  const initialValues = {
    name: userData?.name || "",
    ilength: userData?.length || "",
    iwidth: userData?.width || "",
    iheight: userData?.height || "",
    status: userData?.status || 1,
    price: userData?.price || "",
    description: userData?.description || "",
    image: userData?.image || null,
    isEdit: userData ? true : false,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .max(50, "Maximum 50 characters")
      .matches(
        /^[A-Za-z\s'-]+$/,
        "Only letters, spaces, hyphens, and apostrophes are allowed"
      )
      .required("First name cannot be empty"),
    ilength: Yup.number().required("Length is required"),
    iwidth: Yup.number().required("Width is required"),
    iheight: Yup.number().required("Height is required"),
    price: Yup.number().required("Price is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit
        ? `/admin/edit-items/${userData._id}`
        : "/admin/add-items";
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
          response?.data?.message || "Item details saved successfully."
        );
        navigate("/items");
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
          {isEdit ? "Edit Item" : "Add New Item"}
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
                  <p>Item Name</p>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="w-full">
                  <p>Item Length</p>
                  <Field
                    type="number"
                    name="ilength"
                    min="0"
                    step="0.01"
                    placeholder="Item Length"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="ilength"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Item Width</p>
                  <Field
                    type="number"
                    name="iwidth"
                    placeholder="Width"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                    step="0.01"
                  />
                  <ErrorMessage
                    name="iwidth"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Item Height</p>
                  <Field
                    type="number"
                    name="iheight"
                    placeholder="Height"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                    step="0.01"
                  />
                  <ErrorMessage
                    name="iheight"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Price ($)</p>
                  <Field
                    type="number"
                    name="price"
                    placeholder="Price"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                    step="0.01"
                  />
                  <ErrorMessage
                    name="price"
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
                <p>Upload Image</p>
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
                  <>{isEdit ? "Update Item" : "Save Item"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddItems;
