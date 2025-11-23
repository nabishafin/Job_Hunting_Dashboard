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

function Blogs() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [blogs, setBlogs] = useState([
    {
      _id: "1",
      title: "Getting Started with React Hooks",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 9, 1)
    },
    {
      _id: "2",
      title: "Understanding JavaScript Closures",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 9, 3)
    },
    {
      _id: "3",
      title: "CSS Grid vs Flexbox: A Complete Guide",
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=100&h=100&fit=crop",
      status: 0,
      createdAt: new Date(2025, 9, 5)
    },
    {
      _id: "4",
      title: "Node.js Best Practices for 2025",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 9, 7)
    },
    {
      _id: "5",
      title: "Building RESTful APIs with Express",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 8, 28)
    },
    {
      _id: "6",
      title: "MongoDB Schema Design Patterns",
      image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=100&h=100&fit=crop",
      status: 0,
      createdAt: new Date(2025, 8, 25)
    },
    {
      _id: "7",
      title: "TypeScript for Beginners",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 8, 20)
    },
    {
      _id: "8",
      title: "React Performance Optimization Tips",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 8, 15)
    },
    {
      _id: "9",
      title: "Docker Containers Explained",
      image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=100&h=100&fit=crop",
      status: 0,
      createdAt: new Date(2025, 8, 10)
    },
    {
      _id: "10",
      title: "GraphQL vs REST: Which to Choose?",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 8, 5)
    },
    {
      _id: "11",
      title: "Mastering Git and GitHub",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 7, 30)
    },
    {
      _id: "12",
      title: "Web Security Best Practices",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 7, 25)
    },
    {
      _id: "13",
      title: "Introduction to Microservices Architecture",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop",
      status: 0,
      createdAt: new Date(2025, 7, 20)
    },
    {
      _id: "14",
      title: "Testing React Applications with Jest",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 7, 15)
    },
    {
      _id: "15",
      title: "AWS Cloud Services Overview",
      image: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=100&h=100&fit=crop",
      status: 1,
      createdAt: new Date(2025, 7, 10)
    }
  ]);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastBlog = currentPage * itemsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate stats
  const totalItems = blogs.length;
  const activeItems = blogs.filter(blog => blog.status === 1).length;
  const inactiveItems = blogs.filter(blog => blog.status === 0).length;

  const usersData = {
    blogs: currentBlogs,
    itemsStat: {
      totalItems,
      activeItems,
      inactiveItems
    }
  };

  const handleDelete = (id) => {
    // Dummy implementation - remove blog from list
    setBlogs(prev => prev.filter(blog => blog._id !== id));
    toast.success("Blog information deleted successfully");
    setDeleteConfirmationModal(false);
    setId(null);
  };

  const PricingReport = [
    {
      icon: "Trello",
      iconColor: "text-primary",
      value: usersData?.itemsStat?.totalItems,
      label: "Total Blogs",
    },
    {
      icon: "Trello",
      iconColor: "text-green-500",
      value: usersData?.itemsStat?.activeItems,
      label: "Active Blog",
    },
    {
      icon: "Trello",
      iconColor: "text-orange-500",
      value: usersData?.itemsStat?.inactiveItems,
      label: "Inactive Blog",
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
            <p className="text-xl font-bold uppercase">Manage Blogs</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search Blogs..."
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Link to={"/add-blog"}>
                <button className="btn btn-primary shadow-md mr-2">
                  Add Blog
                </button>
              </Link>
            </div>
          </div>
        </div>

        {usersData?.blogs?.length > 0 ? (
          <>
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead className="bg-purple-200">
                <tr>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      Image
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      Title
                    </div>
                  </th>
                 
                  <th className="text-start whitespace-nowrap">Created date</th>
                  <th className="text-start whitespace-nowrap">Status</th>

                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.blogs?.map((user, index) => (
                  <tr key={index} className="intro-x">
                    <td className="text-left" style={{ whiteSpace: "nowrap" }}>
                      <img src={user?.image} className="h-10 w-10 rounded-full" />
                    </td>
                    <td
                      className="text-left"
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.title}
                    </td>

                    
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
                            navigate("/add-blog", { state: { data: user } })
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

export default Blogs;