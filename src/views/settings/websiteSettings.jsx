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
import useCreateOrEdit from "../../hooks/useCreateOrEdit";


const WebsiteSettings = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    phone: "+1 (415) 555-0137",
    whatsApp: "+1 (415) 555-0199",
    officeAddress: "500 Market St, San Francisco, CA 94105",
    emailAddress: "support@example.com",
    faxNumber: "+1 (415) 555-0142",
    facebook: "https://www.facebook.com/example",
    instagram: "https://www.instagram.com/example",
    linkedin: "https://www.linkedin.com/company/example"
  });
  const navigate = useNavigate();
  const { submitData } = useCreateOrEdit();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // Dummy mode: using local state instead of fetching from API
  //   // getSettings();
  // }, []);

  const getSettings = async () => {
    // Dummy mode: no API request; ensure not loading
    setLoading(false);
  };

  const initialValues = {
    phone: userData?.phone || "",
    whatsApp: userData?.whatsApp || "",
    officeAddress: userData?.officeAddress || "",
    emailAddress: userData?.emailAddress || "",
    faxNumber: userData?.faxNumber || "",
    facebook: userData?.facebook || "",
    instagram: userData?.instagram || "",
    linkedin: userData?.linkedin || "",
  };

  console.log(initialValues, "aaaa")


  const validationSchema = Yup.object({
    phone: Yup.string().required("Phone number is required"),
    // whatsApp: Yup.string().required("WhatsApp number is required"),
    emailAddress: Yup.string().email("Invalid email").required("Email is required"),
    // officeAddress: Yup.string().required("Office address is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Dummy save: simulate network delay and persist in local state
      await new Promise((res) => setTimeout(res, 500));
      setUserData(values);
      toast.success("Information updated successfully (dummy)");
    } finally {
      setSubmitting(false);
    }
  };
if (loading) return <p>Loading...</p>;
  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="border-0 border-gray-200 bg-white dark:bg-transparent shadow-md rounded-lg p-6">
              <div className="intro-y flex flex-col sm:flex-row mt-2 mb-4 justify-between items-center">
                <p className="text-xl font-bold uppercase">
                  {"Website Settings"}
                </p>
              </div>
              <div className="flex gap-4 ">
                <div className="w-full">
                  <p>Phone Number</p>
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>WhatsApp Number</p>
                  <Field
                    type="text"
                    name="whatsApp"
                    placeholder="WhatsApp Number"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="whatsApp"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="w-full mt-4">
                <p>Office Address</p>
                <Field
                  as="textarea"
                  name="officeAddress"
                  placeholder="Office Address"
                  className="p-2 mt-1 border rounded-md w-full"
                />
                <ErrorMessage
                  name="officeAddress"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <div className="w-full">
                  <p>Email Address</p>
                  <Field
                    type="text"
                    name="emailAddress"
                    placeholder="Email Address"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="emailAddress"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Fax Number</p>
                  <Field
                    type="text"
                    name="faxNumber"
                    placeholder="Fax Number"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="faxNumber"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
            </div>


            {/* SOCIAL MEDIA */}
            <div className="border-0 border-gray-200 bg-white dark:bg-transparent shadow-md rounded-lg p-6 mt-6">
              <div className="intro-y flex flex-col sm:flex-row mt-2 mb-4 justify-between items-center">
                <p className="text-xl font-bold uppercase">{"Social Media"}</p>
              </div>
              <div className="flex gap-4 ">
                <div className="w-full">
                  <p>Facebook</p>
                  <Field
                    type="url"
                    name="facebook"
                    placeholder="Facebook"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="facebook"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Instagram</p>
                  <Field
                    type="url"
                    name="instagram"
                    placeholder="Instagram"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="instagram"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

             
              <div className="flex justify-end mt-4 gap-4">
                <div className="w-full">
                  <p>LinkedIn</p>
                  <Field
                    type="url"
                    name="linkedin"
                    placeholder="LinkedIn"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="linkedin"
                    component="div"
                    className="text-red-600"
                  />
                </div>
               
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
                  <>{"Update Settings"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WebsiteSettings;
