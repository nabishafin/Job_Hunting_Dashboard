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
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";

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

function Couriers() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
  const [searchQuery, setSearchQuery] = useState("");
  const [couriersData, setCouriersData] = useState([]);
  const [filteredCouriers, setFilteredCouriers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Dummy couriers data (20 couriers)
  const dummyCouriers = [
    { _id: "1", firstName: "Alex", lastName: "Johnson", email: "alex.j@courier.com", phoneNumber: "+31 6 11111111", companyName: "Fast Delivery Co", createdAt: "2024-01-15T10:00:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "2", firstName: "Maria", lastName: "Garcia", email: "maria.g@courier.com", phoneNumber: "+31 6 22222222", companyName: "Express Transport", createdAt: "2024-02-20T11:30:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "3", firstName: "Tom", lastName: "Wilson", email: "tom.w@courier.com", phoneNumber: "+31 6 33333333", companyName: "Quick Movers", createdAt: "2024-03-10T09:15:00Z", status: 0, approvalStatus: "Pending" },
    { _id: "4", firstName: "Sophie", lastName: "Brown", email: "sophie.b@courier.com", phoneNumber: "+31 6 44444444", companyName: "Swift Logistics", createdAt: "2024-04-05T14:45:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "5", firstName: "Lucas", lastName: "Martinez", email: "lucas.m@courier.com", phoneNumber: "+31 6 55555555", companyName: "Pro Couriers", createdAt: "2024-05-12T08:20:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "6", firstName: "Emma", lastName: "Davis", email: "emma.d@courier.com", phoneNumber: "+31 6 66666666", companyName: "City Express", createdAt: "2024-06-08T16:00:00Z", status: 0, approvalStatus: "Blocked" },
    { _id: "7", firstName: "Oliver", lastName: "Anderson", email: "oliver.a@courier.com", phoneNumber: "+31 6 77777777", companyName: "Metro Delivery", createdAt: "2024-07-14T10:30:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "8", firstName: "Isabella", lastName: "Thomas", email: "isabella.t@courier.com", phoneNumber: "+31 6 88888888", companyName: "Urban Movers", createdAt: "2024-08-22T13:15:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "9", firstName: "James", lastName: "Taylor", email: "james.t@courier.com", phoneNumber: "+31 6 99999999", companyName: "Rapid Transport", createdAt: "2024-09-05T11:45:00Z", status: 0, approvalStatus: "Pending" },
    { _id: "10", firstName: "Mia", lastName: "White", email: "mia.w@courier.com", phoneNumber: "+31 6 10101010", companyName: "Elite Couriers", createdAt: "2024-10-11T15:20:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "11", firstName: "Noah", lastName: "Harris", email: "noah.h@courier.com", phoneNumber: "+31 6 11223344", companyName: "Prime Delivery", createdAt: "2024-01-25T09:00:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "12", firstName: "Ava", lastName: "Clark", email: "ava.c@courier.com", phoneNumber: "+31 6 22334455", companyName: "Top Speed Logistics", createdAt: "2024-02-18T12:30:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "13", firstName: "Liam", lastName: "Lewis", email: "liam.l@courier.com", phoneNumber: "+31 6 33445566", companyName: "Flash Movers", createdAt: "2024-03-30T14:00:00Z", status: 0, approvalStatus: "Blocked" },
    { _id: "14", firstName: "Charlotte", lastName: "Walker", email: "charlotte.w@courier.com", phoneNumber: "+31 6 44556677", companyName: "Speedy Transport", createdAt: "2024-04-12T10:15:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "15", firstName: "Ethan", lastName: "Hall", email: "ethan.h@courier.com", phoneNumber: "+31 6 55667788", companyName: "Ace Delivery", createdAt: "2024-05-20T16:45:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "16", firstName: "Amelia", lastName: "Young", email: "amelia.y@courier.com", phoneNumber: "+31 6 66778899", companyName: "Jet Couriers", createdAt: "2024-06-15T08:30:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "17", firstName: "Mason", lastName: "King", email: "mason.k@courier.com", phoneNumber: "+31 6 77889900", companyName: "Turbo Logistics", createdAt: "2024-07-28T13:00:00Z", status: 0, approvalStatus: "Pending" },
    { _id: "18", firstName: "Harper", lastName: "Wright", email: "harper.w@courier.com", phoneNumber: "+31 6 88990011", companyName: "Velocity Movers", createdAt: "2024-08-10T11:20:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "19", firstName: "Logan", lastName: "Lopez", email: "logan.l@courier.com", phoneNumber: "+31 6 99001122", companyName: "Lightning Delivery", createdAt: "2024-09-22T15:50:00Z", status: 1, approvalStatus: "Approved" },
    { _id: "20", firstName: "Ella", lastName: "Hill", email: "ella.h@courier.com", phoneNumber: "+31 6 10203040", companyName: "Rocket Transport", createdAt: "2024-10-05T09:40:00Z", status: 1, approvalStatus: "Approved" },
  ];

  const dummyCourierStats = {
    totalUsers: 20,
    blocked: 3,
  };

  useEffect(() => {
    // Apply search filter to dummy data
    let couriers = [...dummyCouriers];

    if (searchQuery) {
      couriers = couriers.filter(courier => 
        courier.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courier.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCouriers(couriers);
    setCouriersData({ couriersStat: dummyCourierStats, couriers });
    setCurrentPage(1);
  }, [searchQuery]);

  // Initialize on mount
  useEffect(() => {
    setFilteredCouriers(dummyCouriers);
    setCouriersData({ couriersStat: dummyCourierStats, couriers: dummyCouriers });
  }, []);

  const handleStatusChange = (userId, currentStatus, name) => {
    console.log("Status change (dummy):", { userId, currentStatus, name });
    toast.success("Status updated (dummy mode)");
  };

  const handleDelete = (id) => {
    const updatedCouriers = filteredCouriers.filter(courier => courier._id !== id);
    setFilteredCouriers(updatedCouriers);
    setCouriersData({ ...couriersData, couriers: updatedCouriers });
    toast.success("Courier deleted successfully (dummy mode)");
    setDeleteConfirmationModal(false);
  };

 

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCouriers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCouriers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const PricingReport = [
    {
      icon: "BarChart",
      iconColor: "text-primary",
      value: couriersData?.couriersStat?.totalUsers || 0,
      label: "Total Couriers",
    },
    {
      icon: "close",
      iconColor: "text-red-500",
      value: couriersData?.couriersStat?.blocked || 0,
      label: "Blocked Couriers",
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
              {/* <button
                className="btn btn-primary shadow-md mr-2"
                onClick={handleReportDownload}
              >
                Download Users Report
              </button> */}
              <Link to={"/add-couriers"}>
                <button className="btn btn-primary shadow-md mr-2">
                  Add Couriers
                </button>
              </Link>
            </div>
          </div>
        </div>

        { filteredCouriers?.length > 0 ? (
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
                {user.firstName} {user.lastName}
              </td>
              <td className="text-left whitespace-nowrap">{user.email}</td>
              <td className="text-left whitespace-nowrap">{user.phoneNumber}</td>

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
                className={`text-left ${
                  user.status === 1 ? "text-green-500" : "text-red-500"
                }`}
              >
                {user.approvalStatus}
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
      {filteredCouriers?.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-slate-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCouriers.length)} of {filteredCouriers.length} entries
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