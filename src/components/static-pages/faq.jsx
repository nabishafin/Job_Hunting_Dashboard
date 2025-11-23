import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Lucide } from "../../base-components";
import httpRequest from "../../axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { FAQS } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";

const FAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      _id: "1",
      question: "How do I track my package?",
      answer: "<p>You can track your package in real-time using our mobile app or website. Simply enter your tracking number in the tracking section, and you'll see the current location and estimated delivery time of your package.</p>"
    },
    {
      _id: "2",
      question: "What are your delivery hours?",
      answer: "<p>We operate 7 days a week from 8:00 AM to 8:00 PM. Same-day delivery is available for orders placed before 2:00 PM in most areas.</p>"
    },
    {
      _id: "3",
      question: "How much does delivery cost?",
      answer: "<p>Delivery costs vary based on distance, package size, and delivery speed. Standard delivery starts at $5, while express delivery starts at $10. You can get an exact quote in our app before confirming your order.</p>"
    },
    {
      _id: "4",
      question: "What if my package is damaged?",
      answer: "<p>We take great care in handling all packages. If your package arrives damaged, please contact our customer support immediately with photos of the damage. We offer insurance coverage and will process a claim within 24-48 hours.</p>"
    },
    {
      _id: "5",
      question: "Can I schedule a pickup?",
      answer: "<p>Yes! You can schedule a pickup through our app or website. Choose your preferred date and time, and one of our couriers will arrive at your location to collect the package.</p>"
    },
    {
      _id: "6",
      question: "What items cannot be delivered?",
      answer: "<p>We cannot deliver hazardous materials, illegal substances, perishable food items without proper packaging, live animals, or items exceeding 50kg in weight. Please check our prohibited items list for complete details.</p>"
    },
    {
      _id: "7",
      question: "How do I become a courier?",
      answer: "<p>To become a courier, you need to be at least 18 years old, have a valid driver's license, and own a reliable vehicle. Apply through our website's 'Become a Courier' section, and our team will contact you within 2-3 business days.</p>"
    },
    {
      _id: "8",
      question: "What payment methods do you accept?",
      answer: "<p>We accept all major credit cards, debit cards, PayPal, and cash on delivery. You can also use our in-app wallet for faster checkout.</p>"
    }
  ]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const accessToken = useSelector(selectAccessToken);
  const handleUnAuthenticate = useUnauthenticate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Comment out API calls for dummy data
  // const getFaqs = async () => {
  //   try {
  //     const response = await httpRequest.get(FAQS, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       setFaqs(response.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     if (error?.response?.status === 401) {
  //       handleUnAuthenticate();
  //     }
  //   } finally {
  //     setPageLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getFaqs();
  // }, []);

  // Function to add or edit FAQ (Dummy implementation)
  const handleAddOrEditFaq = async () => {
    const faqData = { question, answer };
    if (faqData.question === "") {
      toast.error("Question is required");
      return;
    }
    if (faqData.answer === "") {
      toast.error("Answer is required");
      return;
    }

    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editIndex !== null) {
      // Edit FAQ
      const updatedFaqs = [...faqs];
      updatedFaqs[editIndex] = { ...updatedFaqs[editIndex], question, answer };
      setFaqs(updatedFaqs);
      toast.success("FAQ updated successfully");
      setEditIndex(null);
    } else {
      // Add new FAQ
      const newFaq = {
        _id: Date.now().toString(),
        question,
        answer
      };
      setFaqs([...faqs, newFaq]);
      toast.success("FAQ added successfully");
    }
    
    setQuestion("");
    setAnswer("");
    setShowForm(false);
    setEditIndex(null);
    setLoading(false);
  };

  // Function to handle editing FAQ
  const handleEditFaq = (index) => {
    setEditIndex(index);
    setQuestion(faqs[index].question);
    setAnswer(faqs[index].answer);
  };

  // Function to delete FAQ (Dummy implementation)
  const handleDeleteFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
    toast.success("FAQ deleted successfully");
    setShowForm(false);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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

  if (pageLoading) {
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
          onClick={() => setShowForm(true)}
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
                disabled={loading}
              >
                {loading ? (
                  <LoadingIcon icon="tail-spin" color="white" />
                ) : (
                  "Submit"
                )}
              </button>
          </div>
        </div>
      )}

      {faqs.length === 0 && (
        <div className="text-center text-red-400 w-full text-[12px] uppercase bg-white rounded-full p-3">
          No Record found
        </div>
      )}
      {faqs.map((faq, index) => (
        <div key={index} className="mb-4 rounded-full">
          <div
            className="text-black p-4 flex justify-between items-center rounded-t-lg cursor-pointer"
            style={{ backgroundColor: "#fff" }}
            onClick={() => toggleAccordion(index)}
          >
            <span>
              {index + 1}. {faq.question}
            </span>
            <div className="flex gap-10">
              <button
                className="text-sm text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  const confirmDelete = window.confirm(
                    "Are you sure you want to delete this FAQ?"
                  );
                  if (confirmDelete) {
                    handleDeleteFaq(index);
                  }
                }}
              >
                Delete
              </button>
              <button
                className="text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowForm(true);
                  handleEditFaq(index);
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
    </div>
  );
};

export default FAQ;
