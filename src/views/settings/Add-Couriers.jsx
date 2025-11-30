import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { MAPS_API_KEY } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Lucide } from "../../base-components";
import { StandaloneSearchBox, useJsApiLoader } from "@react-google-maps/api";
import { useAddCourierMutation, useUpdateCourierMutation } from "../../redux/features/couriers/couriersApi";

const AddCouriers = () => {
  const location = useLocation();
  const courierData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const companyLocationRef = useRef(null);

  // RTK Query hooks
  const [addCourier, { isLoading: isAdding }] = useAddCourierMutation();
  const [updateCourier, { isLoading: isUpdating }] = useUpdateCourierMutation();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
    libraries: ["places"],
  });

  useEffect(() => {
    if (courierData) {
      setIsEdit(true);
    }
  }, [courierData]);

  const initialValues = {
    firstName: courierData?.name?.firstName || "",
    lastName: courierData?.name?.lastName || "",
    email: courierData?.email || "",
    phone: courierData?.phone || "",
    password: "", // Only for new couriers
    companyName: courierData?.companyName || "",
    communicationMode: courierData?.communicationMode || "",
    companyLocation: courierData?.companyLocation || "",
    howKnow: courierData?.howKnow || "",
    courierExperience: courierData?.courierExperience || "",
    legalForm: courierData?.legalForm || "",
    kvkNumber: courierData?.kvkNumber || "",
    document: courierData?.document || "",
    status: courierData?.status || "active",
    profileVerified: courierData?.profileVerified || "unverified",
    role: "courier",
    emailStatus: "verified",
    isBlocked: false,
    isDeleted: false,
    isEdit: !!courierData,
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(9, "Must be at least 9 digits")
      .required("Phone Number is required"),

    // Password only required for new couriers
    ...(!isEdit && {
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),

    companyName: Yup.string().required("Company Name is required"),
    communicationMode: Yup.string().required("Communication Mode is required"),
    companyLocation: Yup.string().required("Company Location is required"),
    howKnow: Yup.string().required("This field is required"),
    courierExperience: Yup.string().required("Courier Experience is required"),
    legalForm: Yup.string().required("Legal Form is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Construct payload matching TUser interface
      const payload = {
        name: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        email: values.email,
        phone: values.phone,
        role: "courier",
        status: values.status,
        emailStatus: "verified",
        isBlocked: false,
        isDeleted: false,
        companyName: values.companyName,
        companyLocation: values.companyLocation,
        communicationMode: values.communicationMode,
        howKnow: values.howKnow,
        courierExperience: values.courierExperience,
        legalForm: values.legalForm,
        kvkNumber: values.kvkNumber || "",
        document: values.document || "",
        profileVerified: values.profileVerified,

        // Only include password for new couriers
        ...(isEdit ? {} : { password: values.password }),
      };

      let response;

      if (isEdit) {
        // Update existing courier
        response = await updateCourier({
          id: courierData._id,
          ...payload,
        }).unwrap();
      } else {
        // Create new courier
        response = await addCourier(payload).unwrap();
      }

      toast.success(response.message || "Courier saved successfully!");
      navigate("/couriers");
    } catch (error) {
      console.error("Error saving courier:", error);
      toast.error(error?.data?.message || "Failed to save courier");
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
                      name="phone"
                      placeholder="Phone Number"
                      className="w-full p-2 mt-2 border rounded-md pl-12"
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Password - Only for new couriers */}
                {!isEdit && (
                  <div className="form-group">
                    <label>
                      Password <span className="required">*</span>
                    </label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full p-2 mt-2 border rounded-md"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600"
                    />
                  </div>
                )}

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
                    <option value="whatsapp">WhatsApp</option>
                    <option value="textMessage">Text message</option>
                  </Field>
                  <ErrorMessage
                    name="communicationMode"
                    component="div"
                    className="text-red-600"
                  />
                </div>

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
                            }
                          }
                        }}
                      >
                        <input
                          name="companyLocation"
                          className={`w-full p-2 mt-2 border rounded-md ${touched.companyLocation && errors.companyLocation
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
                    name="howKnow"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="">Select Option</option>
                    <option value="google">Google</option>
                    <option value="socialMedia">Social Media</option>
                    <option value="website">Website</option>
                  </Field>
                  <ErrorMessage
                    name="howKnow"
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
                    name="courierExperience"
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
                    name="courierExperience"
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
                    name="legalForm"
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
                    name="legalForm"
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
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
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
                    <option value="verified">Verified</option>
                    <option value="unverified">Not Verified</option>
                  </Field>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="custom_black_button"
                disabled={isSubmitting || isAdding || isUpdating}
              >
                {isSubmitting || isAdding || isUpdating ? (
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
