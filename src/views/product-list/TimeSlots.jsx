import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Lucide, LoadingIcon, Modal, ModalBody } from "@/base-components";
import { TIME_SLOTS } from "../../constants";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

function TimeSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();

  // Dummy time slots data
  const dummyTimeSlots = [
    { _id: "1", name: "08:00 AM - 10:00 AM", price: 25, type: "Morning" },
    { _id: "2", name: "10:00 AM - 12:00 PM", price: 20, type: "Morning" },
    { _id: "3", name: "12:00 PM - 02:00 PM", price: 30, type: "Afternoon" },
    { _id: "4", name: "02:00 PM - 04:00 PM", price: 25, type: "Afternoon" },
    { _id: "5", name: "04:00 PM - 06:00 PM", price: 35, type: "Evening" },
    { _id: "6", name: "06:00 PM - 08:00 PM", price: 40, type: "Evening" },
    { _id: "7", name: "08:00 PM - 10:00 PM", price: 45, type: "Night" },
    { _id: "8", name: "09:00 AM - 11:00 AM", price: 22, type: "Morning" },
    { _id: "9", name: "01:00 PM - 03:00 PM", price: 28, type: "Afternoon" },
    { _id: "10", name: "05:00 PM - 07:00 PM", price: 38, type: "Evening" },
  ];

  // Commented out API call - using dummy data
  // const fetchSlots = async () => {
  //   try {
  //     const response = await httpRequest.get(TIME_SLOTS, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     setSlots(response?.data || []);
  //   } catch (error) {
  //     if (error?.response?.status === 401) unauthenticate();
  //     toast.error("Failed to fetch time slots");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // fetchSlots();
    setSlots(dummyTimeSlots);
  }, []);

  // Commented out API call - dummy functionality
  // const handleDelete = async (id) => {
  //   try {
  //     const response = await httpRequest.delete(`${TIME_SLOTS}/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       toast.success("Time slot deleted successfully");
  //       fetchSlots();
  //     }
  //   } catch (error) {
  //     toast.error("Failed to delete time slot");
  //   } finally {
  //     setDeleteModal(false);
  //   }
  // };

  const handleDelete = (id) => {
    const updatedSlots = slots.filter(slot => slot._id !== id);
    setSlots(updatedSlots);
    toast.success("Time slot deleted successfully (dummy mode)");
    setDeleteModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon icon="tail-spin" className="w-16 h-16" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 mt-6">
        <h2 className="text-xl font-bold uppercase">Time Slots</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/add-timeslots")}
        >
          Add Time Slot
        </button>
      </div>

      {slots?.length > 0 ? (
        <div className="overflow-auto">
          <table className="table table-report">
            <thead className="bg-purple-200">
              <tr>
                <th className="text-left">#</th>
                <th className="text-left">Time Slot</th>
                <th className="text-left">Price</th>
                <th className="text-left">Type</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, index) => (
                <tr key={slot._id} className="intro-x">
                  <td className="text-left">{index + 1}</td>
                  <td className="text-left">{slot.name}</td>
                  <td className="text-left">€{slot.price || "-"}</td>
                  <td className="text-left">{slot.type || "-"}</td>
                  <td className="text-center">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() =>
                          navigate("/add-timeslots", { state: { data: slot } })
                        }
                        className="text-blue-600"
                      >
                        <Lucide icon="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(slot._id);
                          setDeleteModal(true);
                        }}
                        className="text-red-600"
                      >
                        <Lucide icon="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No time slots found.</div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModal} onHidden={() => setDeleteModal(false)}>
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete this time slot? This action cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => setDeleteModal(false)}
              className="btn btn-outline-secondary w-24 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(deleteId)}
              className="btn btn-danger w-24"
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default TimeSlots;
