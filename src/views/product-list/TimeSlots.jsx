import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Lucide, LoadingIcon, Modal, ModalBody } from "@/base-components";
import { TIME_SLOTS } from "../../constants";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { useGetAllTimeslotsQuery, useDeleteTimeslotMutation } from "../../redux/features/timeslot/timeslotApi";

function TimeSlots() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: slotsData, isLoading, isError, error } = useGetAllTimeslotsQuery({
    page,
    limit,
  });
  const [deleteTimeslot, { isLoading: isDeleting }] = useDeleteTimeslotMutation();

  const [deleteId, setDeleteId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();

  const slots = slotsData?.data || [];
  const meta = slotsData?.meta || {};
  const totalPage = meta.totalPage || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (isError && error) {
      toast.error("Failed to fetch time slots");
      if (error?.status === 401) {
        unauthenticate();
      }
    }
  }, [isError, error]);

  const handleDelete = async (id) => {
    try {
      await deleteTimeslot(id).unwrap();
      toast.success("Time slot deleted successfully");
      setDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete time slot");
    }
  };

  if (isLoading) {
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
                  <td className="text-left">{(page - 1) * limit + index + 1}</td>
                  <td className="text-left">{slot.startTime} - {slot.endTime}</td>
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

      {/* Pagination Controls */}
      {slots?.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-slate-500">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, meta.total || 0)} of{" "}
            {meta.total || 0} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${page === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
                }`}
            >
              Previous
            </button>
            {[...Array(totalPage)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded ${page === index + 1
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPage}
              className={`px-3 py-1 rounded ${page === totalPage
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
                }`}
            >
              Next
            </button>
          </div>
        </div>
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
