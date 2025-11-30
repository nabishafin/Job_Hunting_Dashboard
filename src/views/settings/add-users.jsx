import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useAddUserMutation, useUpdateUserByIdMutation } from "../../redux/features/user/userApi";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lucide } from "../../base-components";

const AddUsers = () => {
  const location = useLocation();
  const userData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUserById, { isLoading: isUpdating }] = useUpdateUserByIdMutation();

  useEffect(() => {
    if (userData) setIsEdit(true);
  }, [userData]);

  // -------- INITIAL FORM VALUES ----------
  const initialValues = {
    fname: userData?.name?.firstName || "",
    lname: userData?.name?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    password: "",
    role: userData?.role || "user",
    userType: userData?.userType || "user",
    status: userData?.status || "active",
  };

  // -------- FORM VALIDATION ----------
  const validationSchema = Yup.object({
    fname: Yup.string()
      .required("First name required")
      .max(50),
    lname: Yup.string()
      .required("Last name required")
      .max(50),
    email: Yup.string()
      .email("Invalid email")
      .required("Email required"),

    phone: Yup.string()
      .required("Phone number required")
      .max(20, "Max 20 characters"),

    ...(isEdit
      ? {}
      : {
        password: Yup.string()
          .required("Password required")
          .min(6, "Minimum 6 characters"),
      }),

    userType: Yup.string().required("User type required"),
  });

  // -------- SUBMIT HANDLER ----------
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        name: {
          firstName: values.fname,
          lastName: values.lname,
        },
        email: values.email,
        phone: values.phone,
        role: values.role,
        userType: values.userType,
        status: values.status,
        emailStatus: "verified",
        isBlocked: false,
        isDeleted: false,
        ...(isEdit ? {} : { password: values.password }),
      };

      let response;

      if (isEdit) {
        console.log("Updating User - ID:", userData._id);
        console.log("Updating User - Payload:", payload);
        response = await updateUserById({
          id: userData._id,
          ...payload,
        }).unwrap();
      } else {
        response = await addUser(payload).unwrap();
      }

      toast.success(response.message || "User saved successfully");
      navigate("/users");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-bold uppercase">
          {isEdit ? "Edit User" : "Add New User"}
        </p>

        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => window.history.back()}
        >
          <Lucide icon="ArrowLeft" /> Back
        </button>
      </div>

      {/* -------- FORM -------- */}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div className="bg-white dark:bg-transparent shadow-md rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-full">
                  <p>First Name</p>
                  <Field
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage name="fname" component="div" className="text-red-600" />
                </div>

                <div className="w-full">
                  <p>Last Name</p>
                  <Field
                    type="text"
                    name="lname"
                    placeholder="Last Name"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage name="lname" component="div" className="text-red-600" />
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
                <ErrorMessage name="email" component="div" className="text-red-600" />
              </div>

              <div className="w-full mt-4">
                <p>Phone Number</p>
                <Field
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="w-full p-2 mt-2 border rounded-md"
                />
                <ErrorMessage name="phone" component="div" className="text-red-600" />
              </div>

              {!isEdit && (
                <div className="w-full mt-4">
                  <p>Password</p>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600" />
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>User Type</p>
                  <Field as="select" name="userType" className="w-full p-2 mt-2 border rounded-md">
                    <option value="user">User</option>
                    <option value="company">Company</option>
                  </Field>
                </div>

                <div className="w-full">
                  <p>Role</p>
                  <Field as="select" name="role" className="w-full p-2 mt-2 border rounded-md">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Field>
                </div>

                <div className="w-full">
                  <p>Status</p>
                  <Field as="select" name="status" className="w-full p-2 mt-2 border rounded-md">
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="custom_black_button" disabled={isSubmitting}>
                {isSubmitting || isAdding || isUpdating ? (
                  <LoadingIcon icon="tail-spin" color="white" className="w-8 h-6 ml-2" />
                ) : (
                  <>{isEdit ? "Update User" : "Save User"}</>
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
