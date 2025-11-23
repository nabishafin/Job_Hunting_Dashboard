import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon, Lucide } from "../../base-components";
import { REGISTER_USER, UPDATE_USER } from "../../constants";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { MdStarOutline } from "react-icons/md";


const AddTestimonial = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const userData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      setIsEdit(true);
    }
  }, [userData]);

  const initialValues = {
    name: userData?.name || "",
    subTitle: userData?.subTitle || "",
    description: userData?.description || "",
    // rating: userData?.rating || "",
    status: userData?.status || 1,
    price: userData?.price || "",
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
      .required("Name cannot be empty"),
    subTitle: Yup.string().required("Sub Title is required"),
    // rating: Yup.number().required("Rating is required"),
    description: Yup.string().required("Testimonial is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit
        ? `/admin/edit-testimonial/${userData._id}`
        : "/admin/add-testimonial";
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
      formData.append("rating", rating);
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
          response?.data?.message || "Testimonial details saved successfully."
        );
        navigate("/testimonials");
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

  const [rating, setRating] = useState(userData?.rating || 4);
  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate);

    // other logic
  };

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row mt-2 mb-4 justify-between items-center">
        <p className="text-xl font-bold uppercase">
          {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
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
                  <p>Name</p>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
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
                  <p>Sub Title</p>
                  <Field
                    type="text"
                    name="subTitle"
                    placeholder="Sub Title"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="subTitle"
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
                <p>Rating</p>
                <div className="star-rating mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${
                        star <= (rating) ? "filled" : ""
                      }`}
                      onClick={() => setRating(star)}
                    >
                      <MdStarOutline />
                    </span>
                  ))}
                  <span className=" text-[12px] font-semibold">{rating} / 5</span>
                </div>
                {/* <Field
                    type="number"
                    name="rating"
                    placeholder="Height"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                    step="0.01"
                  /> */}
                <ErrorMessage
                  name="rating"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="w-full mt-4">
                <p>Testimonial</p>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter Testimonial"
                  className="p-2 mt-1 border rounded-md w-full"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600"
                />
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
                  <>{isEdit ? "Update Testimonial" : "Save Testimonial"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTestimonial;
