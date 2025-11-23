import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import {
  MAPS_API_KEY,
  REGISTER_COURIER,
  UPDATE_COURIER,
} from "../../constants";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { Lucide } from "../../base-components";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";

const AddCouriers = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const courierData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const navigate = useNavigate();
  const companyLocationRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (courierData) {
      setIsEdit(true);
      // Initialize preview images if in edit mode
      if (courierData.documents && courierData.documents.length > 0) {
        setPreviewImages(
          courierData.documents.map(
            (doc) => `data:image/png;base64,${doc.base64}`
          )
        );
      }
    }
  }, [courierData]);

  const initialValues = {
    firstName: courierData?.firstName || "",
    lastName: courierData?.lastName || "",
    email: courierData?.email || "",
    phoneNumber: courierData?.phoneNumber || "",
    companyName: courierData?.companyName || "",
    communicationMode: courierData?.communicationMode || "",
    companyLocation: courierData?.companyLocation?.address || "",
    lat: courierData?.companyLocation?.lat || 0,
    lng: courierData?.companyLocation?.lng || 0,
    howYouKnow: courierData?.howYouKnow || "",
    experienceWithCourier: courierData?.experienceWithCourier || "",
    companyLegalForm: courierData?.companyLegalForm || "",
    documents: courierData?.documents || [],
    status: courierData?.status || 1,
    profileVerified: courierData?.profileVerified || true,
    isEdit: !!courierData,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(9, "Must be at least 9 digits")
      .required("Phone Number is required"),
    companyName: Yup.string().required("Company Name is required"),
    communicationMode: Yup.string().required("Communication Mode is required"),
    companyLocation: Yup.string().required("Company Location is required"),
    howYouKnow: Yup.string().required("This field is required"),
    experienceWithCourier: Yup.string().required(
      "Experience With Courier is required"
    ),
    companyLegalForm: Yup.string().required("Legal Form is required"),
    lat: Yup.number().required("Latitude is required"),
    lng: Yup.number().required("Longitude is required"),
    documents: Yup.array().when("isEdit", {
      is: false,
      then: Yup.array()
        .min(1, "At least one document is required")
        .required("Documents are required"),
    }),
  });

  const handleFileUpload = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newPreviewImages = [];
    const newDocuments = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviewImages.push(reader.result);
        newDocuments.push({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: reader.result.split(",")[1],
        });

        if (newPreviewImages.length === files.length) {
          setPreviewImages((prev) => [...prev, ...newPreviewImages]);
          setFieldValue("documents", [
            ...initialValues.documents,
            ...newDocuments,
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index, setFieldValue) => {
    const newPreviewImages = [...previewImages];
    const newDocuments = [...initialValues.documents];

    newPreviewImages.splice(index, 1);
    newDocuments.splice(index, 1);

    setPreviewImages(newPreviewImages);
    setFieldValue("documents", newDocuments);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const url = isEdit
        ? `${UPDATE_COURIER}/${courierData._id}`
        : REGISTER_COURIER;
      const method = isEdit ? httpRequest.post : httpRequest.post;

      const payload = {
        ...values,
        companyLocation: {
          address: values.companyLocation,
          lat: values.lat,
          lng: values.lng,
        },
      };

      const response = await method(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.data?.message || "Courier details saved successfully."
        );
        navigate("/couriers");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.msg || "An unknown error occurred."
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
      <div className="intro-y flex flex-col sm:flex-row mt-2 mb-4 justify-between items-center">
        <p className="text-xl font-bold uppercase">
          {isEdit ? "Edit Courier" : "Add New Courier"}
        </p>
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => navigate(-1)}
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
        {({
          isSubmitting,
          setFieldValue,
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            <div className="border-0 border-gray-200 bg-white dark:bg-transparent shadow-md rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="form-group">
                  <label>
                    First Name <span className="required">*</span>
                  </label>
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Last Name */}
                <div className="form-group">
                  <label>
                    Last Name <span className="required">*</span>
                  </label>
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label>
                    Email <span className="required">*</span>
                  </label>
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

                {/* Phone Number */}
                <div className="form-group">
                  <label>
                    Phone Number <span className="required">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-700 font-bold">
                      +31
                    </div>
                    <Field
                      type="text"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      className="w-full p-2 mt-2 border rounded-md pl-12"
                    />
                  </div>
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Company Name */}
                <div className="form-group">
                  <label>
                    Company Name <span className="required">*</span>
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="companyName"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Communication Mode */}
                <div className="form-group">
                  <label>
                    Communication Mode <span className="required">*</span>
                  </label>
                  <Field
                    as="select"
                    name="communicationMode"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="">Select Mode</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Text message">Text message</option>
                  </Field>
                  <ErrorMessage
                    name="communicationMode"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Company Location */}
                {/* Company Location */}
                <div className="form-group col-span-2">
                  <label>
                    Company Location <span className="required">*</span>
                  </label>

                  {isLoaded ? (
                    <div className="w-full">
                      <StandaloneSearchBox
                        onLoad={(ref) => (companyLocationRef.current = ref)}
                        onPlacesChanged={() => {
                          if (companyLocationRef.current) {
                            const places =
                              companyLocationRef.current.getPlaces();
                            if (places && places.length > 0) {
                              const place = places[0];
                              setFieldValue(
                                "companyLocation",
                                place.formatted_address
                              );
                              setFieldValue(
                                "lat",
                                place.geometry.location.lat()
                              );
                              setFieldValue(
                                "lng",
                                place.geometry.location.lng()
                              );
                            }
                          }
                        }}
                      >
                        <input
                          name="companyLocation"
                          className={`w-full p-2 mt-2 border rounded-md ${
                            touched.companyLocation && errors.companyLocation
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Company Location"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.companyLocation}
                          required
                        />
                      </StandaloneSearchBox>
                    </div>
                  ) : (
                    <div>Loading Google Maps API...</div>
                  )}

                  <ErrorMessage
                    name="companyLocation"
                    component="div"
                    className="text-red-600"
                  />
                </div>
               

                {/* How You Know */}
                <div className="form-group">
                  <label>
                    How You Know About Us <span className="required">*</span>
                  </label>
                  <Field
                    as="select"
                    name="howYouKnow"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="">Select Option</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Website">Website</option>
                    <option value="Google">Google</option>
                  </Field>
                  <ErrorMessage
                    name="howYouKnow"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Experience */}
                <div className="form-group">
                  <label>
                    Courier Experience <span className="required">*</span>
                  </label>
                  <Field
                    as="select"
                    name="experienceWithCourier"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="">Select Experience</option>
                    <option value="Parcel delivery DHL/PostNL">
                      Parcel delivery DHL/PostNL
                    </option>
                    <option value="Mover">Mover</option>
                    <option value="Furniture transporter">
                      Furniture transporter
                    </option>
                    <option value="Others">
                      Other: laminate layer, pallet transporter, etc.
                    </option>
                  </Field>
                  <ErrorMessage
                    name="experienceWithCourier"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Legal Form */}
                <div className="form-group">
                  <label>
                    Legal Form <span className="required">*</span>
                  </label>
                  <Field
                    as="select"
                    name="companyLegalForm"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="">Select Legal Form</option>
                    <option value="Sole proprietorship/self-employed">
                      Sole proprietorship/self-employed
                    </option>
                    <option value="BV">BV</option>
                    <option value="VOF">VOF</option>
                    <option value="Zzp">Zzp</option>
                    <option value="Eenmanszaak">Eenmanszaak</option>
                  </Field>
                  <ErrorMessage
                    name="companyLegalForm"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Status */}
                <div className="form-group">
                  <label>Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value={1}>Active</option>
                    <option value={2}>Blocked</option>
                  </Field>
                </div>

                {/* Profile Verified */}
                <div className="form-group">
                  <label>Profile Verified</label>
                  <Field
                    as="select"
                    name="profileVerified"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value={true}>Verified</option>
                    <option value={false}>Not Verified</option>
                  </Field>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="form-group mt-4">
                <label>
                  Documents {!isEdit && <span className="required">*</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                  <input
                    type="file"
                    id="document-upload"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setFieldValue)}
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer block"
                  >
                    <div className="flex flex-col items-center justify-center py-4">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF, DOC up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
                <ErrorMessage
                  name="documents"
                  component="div"
                  className="text-red-600"
                />
              </div>

              {/* Preview Uploaded Images */}
              {previewImages.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Uploaded Documents:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative">
                        {image.startsWith("data:image") ? (
                          <img
                            src={image}
                            alt={`Preview ${index}`}
                            className="h-24 w-24 object-cover rounded border"
                          />
                        ) : (
                          <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded border">
                            <span className="text-xs text-gray-500">
                              Document {index + 1}
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index, setFieldValue)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  <>{isEdit ? "Update Courier" : "Save Courier"}</>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddCouriers;
