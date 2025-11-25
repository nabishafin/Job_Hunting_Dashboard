import React, { useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { usePostSettingsMutation } from "../../redux/features/setting/SettingsApi";

const WebsiteSettings = () => {
  const location = useLocation();
  const [userData, setUserData] = useState({
    phone: "+1 (415) 555-0137",
    whatsapp: "+1 (415) 555-0199",
    officeAdress: "500 Market St, San Francisco, CA 94105",
    emailAdress: "support@example.com",
    fax: "+1 (415) 555-0142",
    facebook: "https://www.facebook.com/example",
    instagram: "https://www.instagram.com/example",
    linkedIn: "https://www.linkedin.com/company/example"
  });
  const navigate = useNavigate();

  const [postSettings, { isLoading }] = usePostSettingsMutation();

  const initialValues = {
    phone: userData?.phone || "",
    whatsapp: userData?.whatsapp || "",
    officeAdress: userData?.officeAdress || "",
    emailAdress: userData?.emailAdress || "",
    fax: userData?.fax || "",
    facebook: userData?.facebook || "",
    instagram: userData?.instagram || "",
    linkedIn: userData?.linkedIn || "",
  };

  const validationSchema = Yup.object({
    phone: Yup.string().required("Phone number is required"),
    emailAdress: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postSettings(values).unwrap();
      toast.success("Settings updated successfully");
      setUserData(values);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to update settings");
    } finally {
      setSubmitting(false);
    }
  };
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
                    name="whatsapp"
                    placeholder="WhatsApp Number"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="whatsapp"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="w-full mt-4">
                <p>Office Address</p>
                <Field
                  as="textarea"
                  name="officeAdress"
                  placeholder="Office Address"
                  className="p-2 mt-1 border rounded-md w-full"
                />
                <ErrorMessage
                  name="officeAdress"
                  component="div"
                  className="text-red-600"
                />
              </div>
              <div className="flex justify-end mt-4 gap-4">
                <div className="w-full">
                  <p>Email Address</p>
                  <Field
                    type="text"
                    name="emailAdress"
                    placeholder="Email Address"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="emailAdress"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Fax Number</p>
                  <Field
                    type="text"
                    name="fax"
                    placeholder="Fax Number"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="fax"
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
                    name="linkedIn"
                    placeholder="LinkedIn"
                    className="w-full p-2 mt-2 border rounded-md"
                    min="0"
                  />
                  <ErrorMessage
                    name="linkedIn"
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
