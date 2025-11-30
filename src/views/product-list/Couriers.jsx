import {
  Lucide,
  Modal,
  ModalBody,
} from "@/base-components";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import { useGetAllCouriersQuery, useDeleteCourierMutation } from "../../redux/features/couriers/couriersApi";

function Couriers() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let status = queryParams.get("status");

  // Build query parameters for API
  const apiQueryParams = {
    page: currentPage,
    limit: itemsPerPage,
    ...(searchQuery && { search: searchQuery }),
    ...(status && { status: status === "active" ? "active" : "blocked" }),
  };

  // Fetch couriers from API using RTK Query with pagination
  const { data: couriersResponse, isLoading, error } = useGetAllCouriersQuery(apiQueryParams);
  const [deleteCourier, { isLoading: isDeleting }] = useDeleteCourierMutation();
  const couriersData = couriersResponse?.data || [];
  const paginationMeta = couriersResponse?.meta || { totalPage: 1, total: 0 };

  // Enforce client-side limit in case API returns more items than requested
  // This handles the case where the API returns 11 items for a limit of 10
  const currentItems = couriersData.slice(0, itemsPerPage);

  const totalPages = paginationMeta.totalPage;
  const totalItems = paginationMeta.total || 0;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, status]);

  const handleDelete = async (id) => {
    try {
      await deleteCourier(id).unwrap();
      toast.success("Courier deleted successfully");
      setDeleteConfirmationModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const PricingReport = [
    {
      icon: "BarChart",
      iconColor: "text-primary",
      value: totalItems,
      label: "Total Couriers",
    },
    {
      icon: "close",
      iconColor: "text-red-500",
      value: couriersData?.filter(u => u.isBlocked)?.length || 0,
      label: "Blocked Couriers",
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

  const handleOpenChangePasswordModal = (user) => {
    setSelectedUser(user);
    setShowChangePasswordModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 mt-2">
          <div className="grid grid-cols-12 gap-6 mt-0">
            {PricingReport.map((item, index) => (
              <div
                key={index}
                className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
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
            <p className="text-xl font-bold uppercase">Manage Couriers</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search couriers"
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Link to={"/add-couriers"}>
                <button className="btn btn-primary shadow-md mr-2">
                  Add Couriers
                </button>
              </Link>
            </div>
          </div>
        </div>

        {couriersData?.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto">
            <table className="table table-report -mt-2">
              <thead className="bg-purple-200">
                <tr>
                  <th className="text-left whitespace-nowrap">Name</th>
                  <th className="text-left whitespace-nowrap">Email</th>
                  <th className="text-left whitespace-nowrap">Phone Number</th>
                  <th className="text-left whitespace-nowrap">Company Name</th>
                  <th className="text-left whitespace-nowrap">Created Date</th>
                  <th className="text-left whitespace-nowrap">Approval Status</th>
                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((user, index) => (
                  <tr key={index} className="intro-x">
                    <td className="text-left whitespace-nowrap">
                      {user.name?.firstName} {user.name?.lastName}
                    </td>
                    <td className="text-left whitespace-nowrap">{user.email}</td>
                    <td className="text-left whitespace-nowrap">{user.phone}</td>

                    <td
                      className={"text-left text-[12px] font-semibold  text-green-500"}
                    >
                      {user.companyName || "N/A"}
                    </td>

                    <td className="text-left">
                      {user.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        }).format(new Date(user.createdAt))
                        : "-"}
                    </td>
                    <td
                      className={`text-left ${user.status === 'active' ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {user.profileVerified || "N/A"}
                    </td>
                    <td className="w-64">
                      <div className="flex justify-center items-center gap-2">
                        <div
                          onClick={() => navigate(`/courier-detail/${user._id}`)}
                          className="flex items-center cursor-pointer"
                        >
                          <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                        </div>
                        <div
                          onClick={() => navigate("/add-couriers", { state: { data: user } })}
                          className="flex items-center cursor-pointer"
                        >
                          <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                        </div>
                        <div
                          onClick={() => handleOpenChangePasswordModal(user)}
                          className="flex items-center text-blue-500 cursor-pointer"
                          title="Change Password"
                        >
                          <Lucide icon="Key" className="w-4 h-4 mr-1" />
                        </div>
                        <div
                          onClick={() => {
                            setDeleteConfirmationModal(true);
                            setSelectedUser(user);
                            setId(user._id);
                          }}
                          className="flex items-center text-red-500 cursor-pointer"
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {couriersData?.length > 0 && (
              <div className="flex justify-between items-center mt-4 px-4">
                <div className="text-sm text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${currentPage === 1
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
                      className={`px-3 py-1 rounded ${currentPage === index + 1
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
                    className={`px-3 py-1 rounded ${currentPage === totalPages
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
      {showChangePasswordModal && selectedUser && (
        <ChangePasswordModal
          user={selectedUser}
          onClose={() => setShowChangePasswordModal(false)}
          userType="courier"
        />
      )}
    </>
  );
}

export default Couriers;