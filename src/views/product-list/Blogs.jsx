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
import { LoadingIcon } from "../../base-components";
import { useGetAllBlogsQuery, useDeleteBlogMutation } from "../../redux/features/blog/blogApi";

function Blogs() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch blogs from API
  const { data: blogsResponse, isLoading, error } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
  const blogs = blogsResponse?.data || [];

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully");
      setDeleteConfirmationModal(false);
      setId(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete blog");
    }
  };

  const PricingReport = [
    {
      icon: "Trello",
      iconColor: "text-primary",
      value: usersData?.itemsStat?.totalItems || 0,
      label: "Total Blogs",
    },
    {
      icon: "Trello",
      iconColor: "text-green-500",
      value: usersData?.itemsStat?.activeItems || 0,
      label: "Active Blog",
    },
    {
      icon: "Trello",
      iconColor: "text-orange-500",
      value: usersData?.itemsStat?.inactiveItems || 0,
      label: "Inactive Blog",
    },
  ];

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

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error loading blogs: {error?.data?.message || "Something went wrong"}</div>
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
                        <img src={user?.img} className="h-10 w-10 rounded-full" alt={user?.title} />
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
                            weekday: "short",
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          }).format(new Date(user.createdAt))
                          : "-"}
                      </td>

                      <td className="text-left whitespace-nowrap">
                        <div
                          className={`w-full xl:mt-0 flex-1  ${user?.status === "active" ? "text-green-500" : "text-red-500"
                            }`}
                        >
                          {user?.status === "active" ? "Active" : "InActive"}
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
                            className="flex items-center text-danger cursor-pointer"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
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
                    className={`px-3 py-1 rounded border ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
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
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Blogs;