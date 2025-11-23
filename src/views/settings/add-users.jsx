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

const AddUsers = () => {
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
    fname: userData?.firstName || "",
    lname: userData?.lastName || "",
    email: userData?.email || "",
    password: "",
    status: userData?.status || 1,
    profileVerified: userData?.profileVerified || true,
    role: userData?.role || "user",
    userType: userData?.userType || 1,
    isEdit: userData ? true : false,

    // phoneNumber: userData?.phoneNumber || "",
    // address: userData?.address || "",
    // gender: userData?.gender || "male",
    // country: userData?.country || "",
    // city: userData?.city || "",
    // isProfileActive: userData?.isProfileActive || false,
    // hasFreeAccess: userData?.hasFreeAccess || false,
    // banned: userData?.banned || false,
  };

  const validationSchema = Yup.object({
    fname: Yup.string()
      .max(50, "Maximum 50 characters")
      .matches(
        /^[A-Za-z\s'-]+$/,
        "Only letters, spaces, hyphens, and apostrophes are allowed"
      )
      .required("First name cannot be empty"),
    lname: Yup.string()
      .max(50, "Maximum 50 characters")
      .matches(
        /^[A-Za-z\s'-]+$/,
        "Only letters, spaces, hyphens, and apostrophes are allowed"
      )
      .required("Last name cannot be empty"),

    email: Yup.string()
      .email("Please enter a valid email address")
      .max(254, "Maximum 254 characters")
      .required("Email is required"),
    // password: Yup.string()
    //   .min(8, "Password must be at least 8 characters long")
    //   .matches(/[0-9]/, "Password must contain a number")
    //   .matches(/[!@#$%^&*]/, "Password must contain a special character")
    //   .when("isEdit", {
    //     is: false,
    //     then: (schema) => schema.required("Password is required"),
    //   }),
    // confirmPassword: Yup.string()
    //   .oneOf([Yup.ref("password"), null], "Passwords must match")
    //   .when("isEdit", {
    //     is: false,
    //     then: (schema) => schema.required("Confirm Password is required"),
    //   }),
    // status: Yup.string().required("Status is required"),
    // phoneNumber: Yup.string()
    //   .matches(
    //     /^[+0-9\s]+$/,
    //     "Please enter a valid phone number, including country code"
    //   )
    //   .max(15, "Maximum 15 characters"),
    // address: Yup.string()
    //   .max(100, "Maximum 100 characters")
    //   .required("Address cannot be empty"),
    userType: Yup.string().required("User Type is required"),
    // country: Yup.string().required("Country is required"),
    // city: Yup.string().required("city is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // console.log(values, "values");
      // return;
      const url = isEdit ? `${UPDATE_USER}/${userData._id}` : REGISTER_USER;
      const method = isEdit ? httpRequest.post : httpRequest.post;
      const payload = {
        ...values,
        ...(isEdit ? {} : { password: values.password }), // Include password only if not in edit mode
      };

      Object.keys(values).forEach((key) => {
        if (values[key] === "") {
          delete payload[key];
        }
      });

      const response = await method(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.data?.message || "User details saved successfully."
        );
        navigate("/users");
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

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row mt-2 mb-4 justify-between items-center">
        <p className="text-xl font-bold uppercase">
          {isEdit ? "Edit User" : "Add New User"}
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
            <div className="border-0 border-gray-200 bg-white dark:bg-transparent shadow-md rounded-lg p-6">
              <div className="flex gap-4 ">
                <div className="w-full">
                  <p>First Name</p>
                  <Field
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="fname"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Last Name</p>
                  <Field
                    type="text"
                    name="lname"
                    placeholder="Last Name"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="lname"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
              <div className="w-full mt-4">
                <p>Email</p>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 mt-2 border rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600"
                />
              </div>

              {/* <div className="w-full">
                  <p>Address</p>
                  <Field
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-600"
                  />
                </div> */}

              {!isEdit && (
                <>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="w-full">
                      <p>Password</p>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full p-2 mt-2 border rounded-md"
                        disabled={isEdit}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-600"
                      />
                    </div>
                  </div>
                  {/* <span className="text-red-500 text-[12px]">Leave Empty if you don't want to update the password!</span> */}
                </>
              )}

              {/* <div className="w-full">
                  <p>Confirm Password</p>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full p-2 mt-2 border rounded-md"
                    disabled={isEdit}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-600"
                  />
                </div> */}

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>User Type</p>
                  <Field
                    as="select"
                    name="userType"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="1">Individual</option>
                    <option value="2">Company</option>
                  </Field>
                  <ErrorMessage
                    name="userType"
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
                    <option value="2">Blocked</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* <div className="flex gap-5 mt-4 items-center">
                <label>
                  <Field type="checkbox" name="isProfileActive" />
                  <span className="ml-2">Is Profile Active</span>
                </label>
                <label>
                  <Field type="checkbox" name="hasFreeAccess" />
                  <span className="ml-2">Has Free Access</span>
                </label>
                <label>
                  <Field type="checkbox" name="banned" />
                  <span className="ml-2">Banned</span>
                </label>
              </div> */}
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
                  <>{isEdit ? "Update user" : "Save user"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddUsers;
