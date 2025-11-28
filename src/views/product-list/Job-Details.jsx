// components/JobDetails.js
import React, { useEffect, useState } from "react";
// import { GET_JOB_DETAILS } from '../../constants'; // Add this constant
import { useParams } from "react-router-dom";
import ProductPopup from "./Product-Popup";
import AddressPopup from "./Address-Popup";
import { Lucide, Modal, ModalBody } from "../../base-components";
import toast from "react-hot-toast";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import PickupTypeSelector from "./PickupTypeSelector";
import TimeSlotEditModal from "./TimeSlotEditModal";
import FloorSelectPopup from "./FloowStepPopup";
// import AddProductAdmin from "./AddProductAdmin";
import ExtraServiceModal from "./ExtraServiceModal";
import { useGetJobByIdQuery, useUpdateJobMutation } from "../../redux/features/job/jobApi";

const JobDetails = () => {
  const jobId = useParams().id;
  const { data: jobData, isLoading } = useGetJobByIdQuery(jobId);
  const [updateJob] = useUpdateJobMutation();
  const jobDetails = jobData?.data || {};

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const { submitData } = useCreateOrEdit();
  const [date, setDate] = useState("");

  // to handle product editing
  const [selectedItem, setSelectedItem] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);

  const handleEdit = (item, ind) => {
    setSelectedItem(item);
    setItemIndex(ind);
    setPopupOpen(true);
  };

  //update address popup state
  const [openAddressPopup, setOpenAddressPopup] = useState(false);
  const [pickupTypePopup, setPickUpTypePopup] = useState(false);
  const [timeSlotPopup, setTimeSlotPopup] = useState(false);
  const [floorSelectPopup, setFloorStepPopup] = useState(false);
  const [timeSlotType, setTimeSlotType] = useState("");
  const [addressType, setAddressType] = useState("");
  // const [isOpen, setIsOpen] = useState(false);
  const [extraServiceIndex, setExtraServiceIndex] = useState(null);
  const [extraServiceInitialValues, setExtraServiceInitialValues] = useState(
    {}
  );
  const [extraServiceModalOpen, setExtraServiceModalOpen] = useState(false);

  const {
    _id: jobNumber,
    status,
    paymentStatus,
    pickupAddress: fromAddress,
    deliveryAddress: toAddress,
    items = [],
    pickupContact,
    deliveryContact,
    transportationType,
    pickupDateInfo,
    deliveryDateInfo,
    extraService,
    totalPrice,
    elevatorCost,
    timeSlotCost,
    createdAt,
    userId,
    courierId,
    userType = "Standard", // Default
    companyName,
    vinNumber,
  } = jobDetails;

  const pickupType = transportationType?.name || "N/A";
  const pickupDate = pickupDateInfo?.date;
  const timeSlot = {
    start: pickupDateInfo?.timeSlot || "N/A",
    end: deliveryDateInfo?.timeSlot || "N/A",
    cost: timeSlotCost || 0
  };
  const extraServices = extraService?.floor || {}; // Mapping floor details

  // Construct extraServicesCost array from the extraService object
  // Construct extraServicesCost array from the extraService object
  const extraServicesCost = [];
  if (extraService?.floor) {
    extraServicesCost.push({
      options: extraService.floor.options || `Floor Charge (Level ${extraService.floor.level || 0})`,
      price: extraService.floor.price || 0,
      type: 'floor'
    });
  }
  if (extraService?.service) {
    extraServicesCost.push({
      options: extraService.service.options || "Service Charge",
      price: extraService.service.price || 0,
      type: 'service'
    });
  }

  const handleUpdate = async (updatedFields) => {
    // Merge existing jobDetails with updatedFields for PUT request
    // We need to exclude read-only fields like _id, createdAt, updatedAt, __v, etc. if the API is strict,
    // but usually spreading is enough if the API ignores extra fields or if we want to keep them.
    // However, to be safe and follow the user's JSON structure, we should construct the object carefully.

    // Based on user's JSON, the body should look like:
    /*
    {
      "from": "...",
      "to": "...",
      "transportationType": { ... },
      "items": [ ... ],
      "pickupDateInfo": { ... },
      "deliveryDateInfo": { ... },
      "extraService": { ... },
      "pickupAddress": { ... },
      "deliveryAddress": { ... },
      "contact": { ... }, // This seems new/different from current mapping
      "totalDistance": "...",
      "totalPrice": ...
    }
    */

    // Current jobDetails has mapped fields (fromAddress, toAddress) which might confuse the merge if we just spread jobDetails.
    // We should use the raw values or re-map them back to API expected keys.

    const payload = {
      ...jobDetails, // Spread original data
      ...updatedFields, // Override with updates
      // Ensure address fields are correctly named for API (if they were re-mapped in destructuring, they exist in jobDetails as original keys too)
      pickupAddress: updatedFields.pickupAddress || jobDetails.pickupAddress,
      deliveryAddress: updatedFields.deliveryAddress || jobDetails.deliveryAddress,
    };

    // Remove internal or read-only fields if necessary (optional, depends on API strictness)
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.userId; // User info usually not updatable via job update
    delete payload.courierId; // Courier info usually not updatable via job update

    try {
      await updateJob({ id: jobId, updatedData: payload }).unwrap();
      toast.success("Job updated successfully!");
    } catch (error) {
      toast.error("Failed to update job: " + (error.data?.message || error.message));
    }
  };

  const handleAddItem = async (newItem) => {
    // Construct the specific payload for adding an item
    const payload = {
      items: {
        add: [newItem]
      }
    };

    try {
      await updateJob({ id: jobId, updatedData: payload }).unwrap();
      toast.success("Item added successfully!");
    } catch (error) {
      toast.error("Failed to add item: " + (error.data?.message || error.message));
    }
  };

  const handleEditItem = async (updatedItem) => {
    // Remove old item and add updated item with new ID
    const itemToAdd = { ...updatedItem };
    const oldItemId = itemToAdd._id;
    delete itemToAdd._id; // Remove _id so backend generates a new one

    const payload = {
      items: {
        remove: [oldItemId],
        add: [itemToAdd]
      }
    };

    try {
      await updateJob({ id: jobId, updatedData: payload }).unwrap();
      toast.success("Item updated successfully!");
    } catch (error) {
      toast.error("Failed to update item: " + (error.data?.message || error.message));
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    handleUpdate({ pickupDateInfo: { ...pickupDateInfo, date: selectedDate } });
  };

  // Status styling
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };

  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
  };

  const handleDelete = async (index) => {
    const itemToDelete = items[index];
    if (!itemToDelete || !itemToDelete._id) {
      toast.error("Cannot delete item: Item ID not found");
      return;
    }

    const payload = {
      items: {
        remove: [itemToDelete._id]
      }
    };

    try {
      await updateJob({ id: jobId, updatedData: payload }).unwrap();
      toast.success("Item deleted successfully!");
      setDeleteConfirmationModal(false);
      setItemIndex(null);
    } catch (error) {
      toast.error("Failed to delete item: " + (error.data?.message || error.message));
    }
  };

  useEffect(() => {
    if (pickupDate) {
      setDate(new Date(pickupDate).toISOString().split('T')[0]);
    }
  }, [pickupDate]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Job Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Job #{jobNumber}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
            >
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColors[paymentStatus]}`}
            >
              Payment:{" "}
              {paymentStatus?.charAt(0).toUpperCase() + paymentStatus?.slice(1)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-600">
            Created: {new Date(createdAt).toLocaleDateString()}
          </p>
          {/* <p className="text-gray-600">
            Pickup: {new Date(pickupDate).toLocaleDateString()}
          </p> */}
        </div>
      </div>
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
              Transport Details
              <button
                onClick={() => {
                  setOpenAddressPopup(true);
                  setAddressType("transport");
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            </h2>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  From Address
                </h3>
                <p className="font-medium">{fromAddress?.streetAddress}</p>
                <p>
                  {fromAddress?.cityOrState}
                </p>
                <p>
                  {fromAddress?.country} - {fromAddress?.zipCode}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">To Address</h3>
                <p className="font-medium">{toAddress?.streetAddress}</p>
                <p>
                  {toAddress?.cityOrState}
                </p>
                <p>
                  {toAddress?.country} - {toAddress?.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md uppercase font-bold">Items ({items.length})</h2>
              <h2
                className="custom_black_button_small"
                onClick={() => {
                  setSelectedItem({
                    name: "",
                    img: "",
                    quantity: 1,
                    dimensions: "",
                    materialContent: "",
                    price: 0,
                    length: "",
                    width: "",
                    height: ""
                  });
                  setIsAddingNewItem(true);
                  setPopupOpen(true);
                }}
              >
                Add New Item
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dimensions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.img && (
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-10 h-10 rounded-md object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>{item.dimensions}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium">
                        €{(item.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(item, index)}
                          className="text-blue-500 hover:underline mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setItemIndex(index);
                            setDeleteConfirmationModal(true);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Extra Services */}
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center gap-3 mb-4">
              <h2 className="text-md uppercase font-bold">Extra Services</h2>
              {/* <button
                className="custom_black_button_small"
                onClick={() => {
                  setExtraServiceInitialValues({});
                  setExtraServiceIndex(null);
                  setExtraServiceModalOpen(true);
                }}
              >
                Add Extra
              </button> */}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {extraServicesCost?.map((item, index) => (
                    console.log(item),
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                        {item.options || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium">
                        €{(item.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setExtraServiceInitialValues(item);
                            setExtraServiceIndex(index);
                            setExtraServiceModalOpen(true);
                          }}
                          className="text-blue-500 hover:underline mr-3"
                        >
                          Edit
                        </button>
                        {/* <button
                          onClick={() => {
                            const confirmDelete = window.confirm(
                              "Are you sure you want to delete this extra service?"
                            );
                            if (confirmDelete) {
                              toast.error("Delete not implemented for this field yet");
                            }
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl flex justify-between font-bold mb-4">
              Contact Information
              <button
                onClick={() => {
                  setOpenAddressPopup(true);
                  setAddressType("contact");
                }}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Pickup Contact
                </h3>
                <p className="font-medium">
                  {pickupContact?.firstName || userId?.name?.firstName} {pickupContact?.lastName || userId?.name?.lastName}
                </p>
                <p>{pickupContact?.phoneNumber || userId?.phone}</p>
                <p>{pickupContact?.email || userId?.email}</p>
                <p className="mt-2">{pickupContact?.smartHomeAddress}</p>
                <p>
                  {pickupContact?.zipCode}, {pickupContact?.city}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Delivery Contact
                </h3>
                <p className="font-medium">
                  {deliveryContact?.firstName || courierId?.name?.firstName || "N/A"} {deliveryContact?.lastName || courierId?.name?.lastName}
                </p>
                <p>{deliveryContact?.phoneNumber || courierId?.phone}</p>
                <p>{deliveryContact?.email || courierId?.email}</p>
                <p className="mt-2">{deliveryContact?.smartHomeAddress}</p>
                <p>
                  {deliveryContact?.zipCode}, {deliveryContact?.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Meta Info */}
        <div className="space-y-6">
          {/* Job Summary */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">Job Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date:</span>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="border border-gray-300 px-2 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Type:</span>
                <span className="font-medium">{pickupType}</span>
                <span
                  className="font-medium cursor-pointer"
                  onClick={() => setPickUpTypePopup(true)}
                >
                  Edit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Time Slot:</span>
                <span className="font-medium">{timeSlot.start}</span>
                <span
                  className="text-gray-600 cursor-pointer"
                  onClick={() => {
                    setTimeSlotPopup(true);
                    setTimeSlotType("pickup");
                  }}
                >
                  Edit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delievery Time Slot:</span>
                <span className="font-medium">{timeSlot.end}</span>
                <span
                  className="text-gray-600 cursor-pointer"
                  onClick={() => {
                    setTimeSlotPopup(true);
                    setTimeSlotType("delivery");
                  }}
                >
                  Edit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Slot Cost:</span>
                <span className="font-medium">€{(timeSlot.cost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Helpers:</span>
                <span className="font-medium">{extraServices.helpers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Floor:</span>
                <span className="font-medium">{extraServices?.options || extraServices?.level || 0}</span>
                <span
                  className="font-medium cursor-pointer"
                  onClick={() => setFloorStepPopup(true)}
                >
                  Edit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Elevator:</span>
                <span className="font-medium">
                  {extraServices?.elevator ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Elevator Cost:</span>
                <span className="font-medium">€{(elevatorCost || 0).toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Price:</span>
                  <span>€{(totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-3">
              <div>
                <p className="font-medium">
                  {userId?.name?.firstName} {userId?.name?.lastName}
                </p>
                <p className="text-gray-600">{userId?.email}</p>
              </div>
              <div>
                <p className="text-gray-600">
                  User Type: <span className="font-medium">{userType}</span>
                </p>
                {companyName && (
                  <p className="text-gray-600">
                    Company: <span className="font-medium">{companyName}</span>
                  </p>
                )}
                {vinNumber && (
                  <p className="text-gray-600">
                    VIN: <span className="font-medium">{vinNumber}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Courier Details */}
          {courierId && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4">Courier Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">
                    {courierId?.name?.firstName} {courierId?.name?.lastName}
                  </p>
                  <p className="text-gray-600">{courierId?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    Phone:{" "}
                    <span className="font-medium">
                      {courierId?.phoneNumber}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Product Popup */}
      {
        popupOpen && selectedItem && (
          <ProductPopup
            getJobDetails={() => toast.success("Product updated (dummy mode)")}
            jobId={jobId}
            item={selectedItem}
            itemIndex={itemIndex}
            addressType={addressType}
            pickupContact={pickupContact}
            deliveryContact={deliveryContact}
            onClose={() => setPopupOpen(false)}
            onSave={(updatedItem) => {
              if (isAddingNewItem) {
                handleAddItem(updatedItem);
              } else {
                handleEditItem(updatedItem);
              }
              setPopupOpen(false);
              setIsAddingNewItem(false);
            }}
          />
        )
      }
      {/* //Edit address popup */}
      {
        openAddressPopup && (
          <AddressPopup
            jobId={jobId}
            getJobDetails={() => toast.success("Address updated (dummy mode)")}
            fromAddress={fromAddress}
            toAddress={toAddress}
            addressType={addressType}
            pickupContact={pickupContact}
            deliveryContact={deliveryContact}
            onClose={() => setOpenAddressPopup(false)}
            onSave={(newFrom, newTo) => {
              handleUpdate({
                pickupAddress: newFrom || fromAddress,
                deliveryAddress: newTo || toAddress
              });
              setOpenAddressPopup(false);
            }}
          />
        )
      }
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete this record? This process cannot be
              undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(itemIndex)}
              className="btn btn-danger w-24"
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      {
        pickupTypePopup && (
          <PickupTypeSelector
            getJobDetails={() => { }}
            pickupType={pickupType}
            itemSource={jobDetails?.itemSource || ""}
            onClose={() => setPickUpTypePopup(false)}
            jobId={jobId}
            onSave={(newType) => handleUpdate({ transportationType: { ...transportationType, name: newType } })}
          />
        )
      }
      {
        timeSlotPopup && (
          <TimeSlotEditModal
            open={setTimeSlotPopup}
            getJobDetails={() => toast.success("Time slot updated (dummy mode)")}
            timeSlot={timeSlot}
            type={timeSlotType}
            onClose={() => setTimeSlotPopup(false)}
            jobId={jobId}
            onSave={(newTimeSlot) => {
              if (timeSlotType === "pickup") {
                handleUpdate({ pickupDateInfo: { ...pickupDateInfo, timeSlot: newTimeSlot } });
              } else {
                handleUpdate({ deliveryDateInfo: { ...deliveryDateInfo, timeSlot: newTimeSlot } });
              }
              setTimeSlotPopup(false);
            }}
          />
        )
      }
      <FloorSelectPopup
        open={floorSelectPopup}
        onClose={() => setFloorStepPopup(false)}
        initialValue={extraServices}
        getJobDetails={() => toast.success("Floor details updated (dummy mode)")}
        jobId={jobId}
        onSave={(newFloorDetails) => {
          handleUpdate({
            extraService: {
              ...extraService,
              floor: { ...extraService.floor, ...newFloorDetails }
            }
          });
          setFloorStepPopup(false);
        }}
      />
      {/* {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-2xl w-full">
            <AddProductAdmin
              close={() => setIsOpen(false)}
              jobId={jobId}
              getJobDetails={() => { }} // Refetch is handled by RTK Query tags
              onSave={(newItem) => handleUpdate({ items: [...items, newItem] })} // Assuming AddProductAdmin passes back the new item
            />
          </div>
        </div>
      )} */}
      <ExtraServiceModal
        isOpen={extraServiceModalOpen}
        onClose={() => setExtraServiceModalOpen(false)}
        getJobDetails={() => toast.success("Extra service updated (dummy mode)")}
        jobId={jobId}
        index={extraServiceIndex}
        initialValues={extraServiceInitialValues}
        onSave={(newServiceData) => {
          // newServiceData structure: { type: "service" | "floor", data: { options, price? } }
          const updatedExtraService = { ...extraService };

          if (newServiceData.type === "service") {
            updatedExtraService.service = { ...updatedExtraService.service, ...newServiceData.data };
          } else if (newServiceData.type === "floor") {
            updatedExtraService.floor = { ...updatedExtraService.floor, ...newServiceData.data };
          }

          handleUpdate({
            extraService: updatedExtraService
          });
          setExtraServiceModalOpen(false);
        }}
      />
    </div >
  );
};

export default JobDetails;



