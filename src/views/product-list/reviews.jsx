import { Lucide, Modal, ModalBody } from "@/base-components";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import useDelete from "../../hooks/useDelete";
import { LoadingIcon } from "@/base-components";

function Reviews() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const { submitData } = useCreateOrEdit();

  // Dummy reviews data (15 reviews)
  const dummyReviews = [
    { _id: "1", user: { firstName: "John", lastName: "Doe" }, courier: { firstName: "Alex", lastName: "Johnson" }, job: { jobNumber: "JOB-001" }, professionalism: 5, communication: 5, friendliness: 5, comment: "Excellent service! Very professional and friendly.", isActive: true },
    { _id: "2", user: { firstName: "Jane", lastName: "Smith" }, courier: { firstName: "Maria", lastName: "Garcia" }, job: { jobNumber: "JOB-002" }, professionalism: 4, communication: 5, friendliness: 4, comment: "Great communication throughout the delivery.", isActive: true },
    { _id: "3", user: { firstName: "Mike", lastName: "Johnson" }, courier: { firstName: "Tom", lastName: "Wilson" }, job: { jobNumber: "JOB-003" }, professionalism: 3, communication: 3, friendliness: 4, comment: "Good service but could be faster.", isActive: false },
    { _id: "4", user: { firstName: "Sarah", lastName: "Williams" }, courier: { firstName: "Sophie", lastName: "Brown" }, job: { jobNumber: "JOB-004" }, professionalism: 5, communication: 5, friendliness: 5, comment: "Outstanding! Highly recommend.", isActive: true },
    { _id: "5", user: { firstName: "David", lastName: "Brown" }, courier: { firstName: "Lucas", lastName: "Martinez" }, job: { jobNumber: "JOB-005" }, professionalism: 4, communication: 4, friendliness: 5, comment: "Very friendly and helpful courier.", isActive: true },
    { _id: "6", user: { firstName: "Emily", lastName: "Davis" }, courier: { firstName: "Emma", lastName: "Davis" }, job: { jobNumber: "JOB-006" }, professionalism: 2, communication: 2, friendliness: 3, comment: "Not satisfied with the service.", isActive: false },
    { _id: "7", user: { firstName: "Oliver", lastName: "Anderson" }, courier: { firstName: "Oliver", lastName: "Anderson" }, job: { jobNumber: "JOB-007" }, professionalism: 5, communication: 4, friendliness: 5, comment: "Professional and on time.", isActive: true },
    { _id: "8", user: { firstName: "Isabella", lastName: "Thomas" }, courier: { firstName: "Isabella", lastName: "Thomas" }, job: { jobNumber: "JOB-008" }, professionalism: 4, communication: 5, friendliness: 4, comment: "Good experience overall.", isActive: true },
    { _id: "9", user: { firstName: "James", lastName: "Taylor" }, courier: { firstName: "James", lastName: "Taylor" }, job: { jobNumber: "JOB-009" }, professionalism: 5, communication: 5, friendliness: 5, comment: "Perfect delivery service!", isActive: true },
    { _id: "10", user: { firstName: "Mia", lastName: "White" }, courier: { firstName: "Mia", lastName: "White" }, job: { jobNumber: "JOB-010" }, professionalism: 3, communication: 4, friendliness: 4, comment: "Decent service, nothing special.", isActive: true },
    { _id: "11", user: { firstName: "Noah", lastName: "Harris" }, courier: { firstName: "Noah", lastName: "Harris" }, job: { jobNumber: "JOB-011" }, professionalism: 5, communication: 5, friendliness: 5, comment: "Exceptional service and care.", isActive: true },
    { _id: "12", user: { firstName: "Ava", lastName: "Clark" }, courier: { firstName: "Ava", lastName: "Clark" }, job: { jobNumber: "JOB-012" }, professionalism: 4, communication: 4, friendliness: 5, comment: "Very polite and efficient.", isActive: true },
    { _id: "13", user: { firstName: "Liam", lastName: "Lewis" }, courier: { firstName: "Liam", lastName: "Lewis" }, job: { jobNumber: "JOB-013" }, professionalism: 2, communication: 3, friendliness: 2, comment: "Poor communication during delivery.", isActive: false },
    { _id: "14", user: { firstName: "Charlotte", lastName: "Walker" }, courier: { firstName: "Charlotte", lastName: "Walker" }, job: { jobNumber: "JOB-014" }, professionalism: 5, communication: 5, friendliness: 5, comment: "Amazing! Will use again.", isActive: true },
    { _id: "15", user: { firstName: "Ethan", lastName: "Hall" }, courier: { firstName: "Ethan", lastName: "Hall" }, job: { jobNumber: "JOB-015" }, professionalism: 4, communication: 4, friendliness: 4, comment: "Reliable and professional service.", isActive: true },
  ];

  const toggleStatus = (reviewId, status) => {
    const updatedReviews = reviews.map(review => 
      review._id === reviewId ? { ...review, isActive: !status } : review
    );
    setReviews(updatedReviews);
    toast.success("Status updated successfully (dummy mode)");
  };

  const handleDelete = () => {
    const updatedReviews = reviews.filter(review => review._id !== selectedReviewId);
    setReviews(updatedReviews);
    toast.success("Review deleted successfully (dummy mode)");
    setDeleteModal(false);
  };

  useEffect(() => {
    setReviews(dummyReviews);
  }, [searchQuery]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon icon="tail-spin" className="w-24 h-24" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <h2 className="text-xl font-bold">Manage Reviews ({reviews.length})</h2>
        {/* <input
          type="text"
          className="border px-4 py-2 rounded-md"
          placeholder="Search..."
          onChange={(e) => setSearchQuery(e.target.value)}
        /> */}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="table table-auto w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Courier</th>
              <th className="text-left p-3">Job #</th>
              <th className="text-left p-3">Ratings</th>
              <th className="text-left p-3">Comment</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((review) => (
              <tr key={review._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {review.user?.firstName} {review.user?.lastName}
                </td>
                <td className="p-3">
                  {review.courier?.firstName} {review.courier?.lastName}
                </td>
                <td className="p-3">{review.job?.jobNumber}</td>
                <td className="p-3">
                  {["professionalism", "communication", "friendliness"].map(
                    (field) => (
                      <div key={field}>
                        <span className="capitalize">{field}:</span>{" "}
                        {review[field]}/5
                      </div>
                    )
                  )}
                </td>
                <td className="p-3">{review.comment || "-"}</td>
                <td className="p-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={review?.isActive}
                      onChange={() =>
                        toggleStatus(review._id, review?.isActive)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                  </label>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setDeleteModal(true);
                        setSelectedReviewId(review._id);
                      }}
                      className="text-red-500"
                    >
                      <Lucide icon="Trash2" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {reviews.length > 0 && (
          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-slate-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, reviews.length)} of {reviews.length} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal show={deleteModal} onHidden={() => setDeleteModal(false)}>
        <ModalBody className="text-center">
          <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto" />
          <h2 className="text-xl font-semibold mt-4">Confirm Deletion</h2>
          <p className="text-slate-500 mt-2 mb-4">
            Are you sure you want to delete this review?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Reviews;