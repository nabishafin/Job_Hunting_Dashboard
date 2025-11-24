import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Lucide, LoadingIcon } from "../../base-components";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { TIME_SLOTS } from "../../constants";
import { useAddTimeslotMutation, useUpdateTimeslotMutation } from "../../redux/features/timeslot/timeslotApi";

// ... existing imports
const AddTimeSlot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useSelector(selectAccessToken);
  const handleUnAuthenticate = useUnauthenticate();

  const [addTimeslot, { isLoading: isAdding }] = useAddTimeslotMutation();
  const [updateTimeslot, { isLoading: isUpdating }] = useUpdateTimeslotMutation();

  const slotData = location.state?.data || null;
  const isEdit = !!slotData;

  const initialValues = {
    startTime: slotData?.startTime || "",
    endTime: slotData?.endTime || "",
    price: slotData?.price || "",
    type: slotData?.type || "", // NEW
  };

  const validationSchema = Yup.object({
    startTime: Yup.string().required("Start time is required"),
    endTime: Yup.string().required("End time is required"),
    price: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .min(0, "Price cannot be negative"),
    type: Yup.string().required("Type is required"), // NEW
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      startTime: values.startTime,
      endTime: values.endTime,
      price: Number(values.price),
      type: values.type,
    };

    // Calculate changed fields for update - REVERTED per user request
    // const changedFields = {};
    // if (isEdit) {
    //   Object.keys(payload).forEach((key) => {
    //     if (payload[key] !== initialValues[key]) {
    //       changedFields[key] = payload[key];
    //     }
    //   });
    // }

    try {
      if (isEdit) {
        // Send full payload as requested
        await updateTimeslot({ id: slotData._id, data: payload }).unwrap();
        toast.success("Time slot updated successfully");
      } else {
        await addTimeslot(payload).unwrap();
        toast.success("Time slot added successfully");
      }
      navigate("/time-slots");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
      if (error?.status === 401) {
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
          {isEdit ? "Edit Time Slot" : "Add Time Slot"}
        </p>
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => navigate(-1)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="form-group">
                  <label>
                    Start Time <span className="required">*</span>
                  </label>
                  <Field
                    type="time"
                    name="startTime"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="startTime"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* End Time */}
                <div className="form-group">
                  <label>
                    End Time <span className="required">*</span>
                  </label>
                  <Field
                    type="time"
                    name="endTime"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="endTime"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Price */}
                <div className="form-group">
                  <label>
                    Price <span className="required">*</span>
                  </label>
                  <Field
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="text-red-600"
                  />
                </div>

                {/* Type (Dropdown) */}
                <div className="form-group">
                  <label>
                    Type <span className="required">*</span>
                  </label>
                  <Field
                    as="select"
                    name="type"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </Field>
                  <ErrorMessage
                    name="type"
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
                disabled={isSubmitting || isAdding || isUpdating}
              >
                {isSubmitting || isAdding || isUpdating ? (
                  <LoadingIcon
                    icon="tail-spin"
                    color="white"
                    className="w-8 h-6 ml-2"
                  />
                ) : isEdit ? (
                  "Update Slot"
                ) : (
                  "Save Slot"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTimeSlot;

