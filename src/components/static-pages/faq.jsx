import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Lucide, LoadingIcon, Modal, ModalBody } from "../../base-components";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import toast from "react-hot-toast";
import {
  useGetAllFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "../../redux/features/faq/faqApi";

const FAQ = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editIndex, setEditIndex] = useState(null); // Stores the ID of the FAQ being edited
  const [activeIndex, setActiveIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: faqsData, isLoading } = useGetAllFaqsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();

  const handleAddOrEditFaq = async () => {
    if (!question) {
      toast.error("Question is required");
      return;
    }
    if (!answer) {
      toast.error("Answer is required");
      return;
    }

    const payload = { question, answer };

    try {
      if (editIndex !== null) {
        // Edit FAQ
        await updateFaq({ id: editIndex, ...payload }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        // Add new FAQ
        await addFaq(payload).unwrap();
        toast.success("FAQ added successfully");
      }

      // Reset form
      setQuestion("");
      setAnswer("");
      setShowForm(false);
      setEditIndex(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleEditFaq = (faq) => {
    setEditIndex(faq._id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFaq(deleteId).unwrap();
      toast.success("FAQ deleted successfully");
      setDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to delete FAQ");
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="pb-6 flex justify-between items-center">
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => window.history.back(-1)}
          aria-label="Go Back"
        >
          <Lucide icon="ArrowLeft" />
          Back
        </button>
        <button
          className="custom_black_button uppercase"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
            setQuestion("");
            setAnswer("");
          }}
        >
          Add New faq
        </button>
      </div>

      <h1 className="text-xl font-semibold mb-6 uppercase">
        Frequently Asked Questions
      </h1>

      {showForm && (
        <div className="border rounded-lg p-4 mb-6 bg-white">
          <input
            type="text"
            className="w-full border p-4 rounded-md mb-4"
            placeholder="Add your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={answer}
            onChange={setAnswer}
            modules={modules}
            style={{ height: "150px", marginBottom: "1rem" }}
          />
          <div className="flex justify-between items-center mt-14 w-full">
            {editIndex !== null && (
              <button
                className="text-red-500"
                onClick={() => {
                  setEditIndex(null);
                  setQuestion("");
                  setAnswer("");
                  setShowForm(false);
                }}
              >
                Cancel Edit
              </button>
            )}
            {editIndex === null && (
              <button
                className="px-4 py-2 border rounded-full"
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                  setEditIndex(null);
                  setShowForm(false);
                }}
              >
                Clear
              </button>
            )}
            <button
              className="custom_black_button"
              onClick={handleAddOrEditFaq}
              disabled={isAdding || isUpdating}
            >
              {isAdding || isUpdating ? (
                <LoadingIcon icon="tail-spin" color="white" className="w-6 h-6" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      )}

      {faqsData?.data?.length === 0 ? (
        <div className="text-center text-red-400 w-full text-[12px] uppercase bg-white rounded-full p-3">
          No Record found
        </div>
      ) : (
        <>
          {faqsData?.data?.map((faq, index) => (
            <div key={faq._id} className="mb-4 rounded-full">
              <div
                className="text-black p-4 flex justify-between items-center rounded-t-lg cursor-pointer"
                style={{ backgroundColor: "#fff" }}
                onClick={() => toggleAccordion(index)}
              >
                <span>
                  {index + 1 + (currentPage - 1) * itemsPerPage}. {faq.question}
                </span>
                <div className="flex gap-10">
                  <button
                    className="text-sm text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(faq._id);
                      setDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFaq(faq);
                    }}
                  >
                    Edit
                  </button>
                  <Lucide
                    icon={activeIndex === index ? "ChevronUp" : "ChevronDown"}
                  />
                </div>
              </div>
              {activeIndex === index && (
                <div className=" p-4 bg-gray-50">
                  <div
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {faqsData?.meta?.totalPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: faqsData.meta.totalPage }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === faqsData.meta.totalPage}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModal} onHidden={() => setDeleteModal(false)}>
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete this FAQ? This action cannot be undone.
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
              onClick={confirmDelete}
              className="btn btn-danger w-24"
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default FAQ;
