import {
  Lucide,
  Tippy,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  Modal,
  ModalBody,
} from "@/base-components";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  GET_USERS,
  DELETE_USERS,
  SET_BANNED_STATUS,
  SET_FREE_ACCESS,
  DOWNLOAD_USERS_REPORT,
} from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { LoadingIcon } from "../../base-components";
import { ChevronDown, ChevronUp } from "lucide-react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import useDelete from "../../hooks/useDelete";
import { calculateAge } from "../../utils/helper";

// Toggle Switch Component
function ToggleSwitch({ isOn, handleToggle }) {
  return (
    <div onClick={handleToggle} className="toggle-switch">
      <input
        type="checkbox"
        checked={isOn}
        onChange={handleToggle}
        className="toggle-switch-checkbox"
      />
      <label className="toggle-switch-label">
        <span className="toggle-switch-inner" />
        <span className="toggle-switch-switch" />
      </label>
    </div>
  );
}

function Testimonials() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [testimonials, setTestimonials] = useState([
    {
      _id: "1",
      name: "Sarah Johnson",
      rating: 5,
      description: "Excellent service! The delivery was fast and the courier was very professional. Highly recommend!",
      status: 1,
      createdAt: new Date(2025, 9, 1)
    },
    {
      _id: "2",
      name: "Michael Chen",
      rating: 5,
      description: "Outstanding experience from start to finish. The tracking system is great and customer service is top-notch.",
      status: 1,
      createdAt: new Date(2025, 9, 3)
    },
    {
      _id: "3",
      name: "Emily Rodriguez",
      rating: 4,
      description: "Very good service overall. Package arrived on time and in perfect condition.",
      status: 1,
      createdAt: new Date(2025, 9, 5)
    },
    {
      _id: "4",
      name: "David Thompson",
      rating: 5,
      description: "Best courier service I've used! Fast, reliable, and affordable. Will definitely use again.",
      status: 0,
      createdAt: new Date(2025, 9, 7)
    },
    {
      _id: "5",
      name: "Jessica Martinez",
      rating: 4,
      description: "Great experience! The app is user-friendly and the delivery was prompt.",
      status: 1,
      createdAt: new Date(2025, 8, 28)
    },
    {
      _id: "6",
      name: "Robert Williams",
      rating: 5,
      description: "Fantastic service! The courier was friendly and handled my package with care.",
      status: 1,
      createdAt: new Date(2025, 8, 25)
    },
    {
      _id: "7",
      name: "Amanda Brown",
      rating: 3,
      description: "Good service but there's room for improvement in communication.",
      status: 0,
      createdAt: new Date(2025, 8, 20)
    },
    {
      _id: "8",
      name: "Christopher Lee",
      rating: 5,
      description: "Impressed with the speed and efficiency. Package arrived earlier than expected!",
      status: 1,
      createdAt: new Date(2025, 8, 15)
    },
    {
      _id: "9",
      name: "Jennifer Davis",
      rating: 4,
      description: "Reliable and professional service. Would recommend to friends and family.",
      status: 1,
      createdAt: new Date(2025, 8, 10)
    },
    {
      _id: "10",
      name: "Daniel Wilson",
      rating: 5,
      description: "Amazing service! The real-time tracking feature is incredibly useful.",
      status: 1,
      createdAt: new Date(2025, 8, 5)
    },
    {
      _id: "11",
      name: "Lisa Anderson",
      rating: 4,
      description: "Very satisfied with the service. Quick delivery and good customer support.",
      status: 1,
      createdAt: new Date(2025, 7, 30)
    },
    {
      _id: "12",
      name: "James Taylor",
      rating: 5,
      description: "Exceptional service! The courier was punctual and very courteous.",
      status: 0,
      createdAt: new Date(2025, 7, 25)
    }
  ]);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();

  // Filter testimonials based on search query
  const filteredTestimonials = testimonials.filter(testimonial => 
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastTestimonial = currentPage * itemsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - itemsPerPage;
  const currentTestimonials = filteredTestimonials.slice(indexOfFirstTestimonial, indexOfLastTestimonial);
  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate stats
  const total = testimonials.length;
  const active = testimonials.filter(t => t.status === 1).length;
  const inactive = testimonials.filter(t => t.status === 0).length;

  const usersData = {
    users: currentTestimonials,
    userStat: {
      total,
      active,
      inactive
    }
  };

  const handleStatusChange = (userId, currentStatus, name) => {
    // Dummy implementation - toggle status
    setTestimonials(prev => prev.map(testimonial => 
      testimonial._id === userId 
        ? { ...testimonial, status: testimonial.status === 1 ? 0 : 1 }
        : testimonial
    ));
    toast.success("Status updated successfully");
  };

  const handleDelete = (id) => {
    // Dummy implementation - remove testimonial from list
    setTestimonials(prev => prev.filter(testimonial => testimonial._id !== id));
    toast.success("Testimonial deleted successfully");
    setDeleteConfirmationModal(false);
    setId(null);
  };

  const PricingReport = [
    {
      icon: "Trello",
      iconColor: "text-primary",
      value: usersData?.userStat?.total,
      label: "Total Testimonials",
    },
    {
      icon: "Trello",
      iconColor: "text-green-500",
      value: usersData?.userStat?.active,
      label: "Active Testimonials",
    },
    {
      icon: "Trello",
      iconColor: "text-orange-500",
      value: usersData?.userStat?.inactive,
      label: "Inactive Testimonials",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }} // Adjust the size as needed
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 mt-2">
          <div className="grid grid-cols-12 gap-6 mt-0">
            {PricingReport.map((item, index) => (
              <div
                key={index}
                className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y"
              >
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div
                      className={`text-3xl font-medium leading-8 mt-6 ${item.iconColor}`}
                    >
                      {item.value}
                    </div>
                    <div className="text-[12px] font-semibold uppercase text-slate-500 mt-1">
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-xl font-bold uppercase">Manage Testimonials</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search Testimonials..."
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Link to={"/add-testimonial"}>
                <button className="btn btn-primary shadow-md mr-2">
                  Add Testimonial
                </button>
              </Link>
            </div>
          </div>
        </div>

        {usersData?.users?.length > 0 ? (
          <>
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead className="bg-purple-200">
                <tr>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      Name
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      Rating
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      Testimonial
                    </div>
                  </th>
                  <th className="text-start whitespace-nowrap">Created date</th>
                  <th className="text-start whitespace-nowrap">Status</th>

                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users?.map((user, index) => (
                  <tr key={index} className="intro-x">
                    <td className="text-left" style={{ whiteSpace: "nowrap" }}>
                      {user.name}
                    </td>
                    <td
                      className="text-left"
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          style={{
                            color: index < user.rating ? "#FFD700" : "#e5e7eb",
                            fontSize: "20px", // gold vs light gray
                          }}
                        >
                          {index < user.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </td>

                    <td className={`text-left`}>{user?.description}</td>

                    <td className="text-left whitespace-nowrap">
                      {user.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "short", // Thu
                            month: "short", // Dec
                            day: "2-digit", // 19
                            year: "numeric", // 2024
                          }).format(new Date(user.createdAt))
                        : "-"}
                    </td>

                    <td className="text-left whitespace-nowrap">
                      <div
                        className={`w-full xl:mt-0 flex-1  ${
                          user?.status == 1 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {user?.status == 1 ? "Active" : "InActive"}
                      </div>
                    </td>

                    <td className="w-56">
                      <div className="flex justify-center items-center">
                        <div
                          onClick={() =>
                            navigate("/add-testimonial", {
                              state: { data: user },
                            })
                          }
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                        </div>
                        <a
                          className="flex items-center text-danger"
                          href="#"
                          onClick={() => {
                            setDeleteConfirmationModal(true);
                            setId(user._id);
                          }}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="intro-y col-span-12 flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="intro-y col-span-12 flex justify-center items-center">
            No data found.
          </div>
        )}
      </div>

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
              onClick={() => handleDelete(id)}
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

export default Testimonials;