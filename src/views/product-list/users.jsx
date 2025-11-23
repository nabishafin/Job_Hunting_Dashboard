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
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import useFetch from "../../hooks/useFetch";
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

function Users() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();
  const { fetchData } = useFetch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let status = queryParams.get("status"); // e.g. 'active'

  // Dummy data for display purposes (30 users)
  const dummyUsers = [
    { _id: "1", firstName: "John", lastName: "Doe", email: "john.doe@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-01-15T10:30:00Z" },
    { _id: "2", firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-02-20T14:45:00Z" },
    { _id: "3", firstName: "Mike", lastName: "Johnson", email: "mike.j@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-03-10T09:15:00Z" },
    { _id: "4", firstName: "Sarah", lastName: "Williams", email: "sarah.w@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-04-05T16:20:00Z" },
    { _id: "5", firstName: "David", lastName: "Brown", email: "david.b@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-05-12T11:30:00Z" },
    { _id: "6", firstName: "Emily", lastName: "Davis", email: "emily.d@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-06-08T13:45:00Z" },
    { _id: "7", firstName: "Robert", lastName: "Miller", email: "robert.m@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-07-14T08:20:00Z" },
    { _id: "8", firstName: "Lisa", lastName: "Wilson", email: "lisa.w@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-08-22T15:10:00Z" },
    { _id: "9", firstName: "James", lastName: "Moore", email: "james.m@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-09-05T10:55:00Z" },
    { _id: "10", firstName: "Patricia", lastName: "Taylor", email: "patricia.t@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-10-11T12:30:00Z" },
    { _id: "11", firstName: "Michael", lastName: "Anderson", email: "michael.a@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-01-25T09:40:00Z" },
    { _id: "12", firstName: "Linda", lastName: "Thomas", email: "linda.t@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-02-18T14:25:00Z" },
    { _id: "13", firstName: "William", lastName: "Jackson", email: "william.j@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-03-30T11:15:00Z" },
    { _id: "14", firstName: "Barbara", lastName: "White", email: "barbara.w@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-04-12T16:50:00Z" },
    { _id: "15", firstName: "Richard", lastName: "Harris", email: "richard.h@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-05-20T08:35:00Z" },
    { _id: "16", firstName: "Susan", lastName: "Martin", email: "susan.m@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-06-15T13:20:00Z" },
    { _id: "17", firstName: "Joseph", lastName: "Thompson", email: "joseph.t@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-07-28T10:05:00Z" },
    { _id: "18", firstName: "Jessica", lastName: "Garcia", email: "jessica.g@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-08-10T15:40:00Z" },
    { _id: "19", firstName: "Thomas", lastName: "Martinez", email: "thomas.m@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-09-22T09:25:00Z" },
    { _id: "20", firstName: "Karen", lastName: "Robinson", email: "karen.r@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-10-05T14:15:00Z" },
    { _id: "21", firstName: "Charles", lastName: "Clark", email: "charles.c@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-01-08T11:50:00Z" },
    { _id: "22", firstName: "Nancy", lastName: "Rodriguez", email: "nancy.r@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-02-14T16:30:00Z" },
    { _id: "23", firstName: "Daniel", lastName: "Lewis", email: "daniel.l@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-03-19T08:45:00Z" },
    { _id: "24", firstName: "Betty", lastName: "Lee", email: "betty.l@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-04-26T13:55:00Z" },
    { _id: "25", firstName: "Matthew", lastName: "Walker", email: "matthew.w@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-05-30T10:20:00Z" },
    { _id: "26", firstName: "Dorothy", lastName: "Hall", email: "dorothy.h@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-06-18T15:35:00Z" },
    { _id: "27", firstName: "Anthony", lastName: "Allen", email: "anthony.a@example.com", userType: 1, profileVerified: false, status: "2", createdAt: "2024-07-22T09:10:00Z" },
    { _id: "28", firstName: "Sandra", lastName: "Young", email: "sandra.y@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-08-15T14:45:00Z" },
    { _id: "29", firstName: "Mark", lastName: "King", email: "mark.k@example.com", userType: 1, profileVerified: true, status: "1", createdAt: "2024-09-10T11:25:00Z" },
    { _id: "30", firstName: "Ashley", lastName: "Wright", email: "ashley.w@example.com", userType: 2, profileVerified: true, status: "1", createdAt: "2024-10-01T16:00:00Z" },
  ];

  const dummyUserStats = {
    totalUsers: 30,
    normalUsers: 18,
    businessUser: 12,
    blocked: 10,
  };

  // Commented out API call - using dummy data
  // const getUsers = async (fieldName = "", type = "") => {
  //   try {
  //     const response = await submitData(
  //       "/admin/get-users",
  //       { searchQuery, fieldName, type },
  //       "POST"
  //     );
  //     setLoading(false);

  //     let users = response?.data?.data?.users || [];
  //     let new_status = status === "active" ? "1" : "2";
  //     if (status) {
  //       users = users?.filter(user => user.status === new_status);
  //     }
  //     setFilterData(users);
  //     setUsersData(response?.data?.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    // getUsers();
    // Load dummy data
    let users = [...dummyUsers];
    let new_status = status === "active" ? "1" : "2";
    if (status) {
      users = users.filter(user => user.status === new_status);
    }
    
    // Filter by search query
    if (searchQuery) {
      users = users.filter(user => 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilterData(users);
    setUsersData({ userStat: dummyUserStats, users: dummyUsers });
    setCurrentPage(1); // Reset to first page on search/filter
  }, [searchQuery, status]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Commented out API call - dummy functionality
  // const handleStatusChange = async (userId, currentStatus, name) => {
  //   let url;
  //   let payload;
  //   console.log("called", name);

  //   if (name === "banned") {
  //     url = `${SET_BANNED_STATUS}/${userId}`;
  //     payload = { banned: !currentStatus };
  //   }
  //   if (name === "hasFreeAccess") {
  //     url = `${SET_FREE_ACCESS}/${userId}`;
  //     payload = { hasFreeAccess: !currentStatus };
  //   }

  //   try {
  //     const response = await httpRequest.put(url, payload, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       getUsers();
  //       toast.success(response.data.message);
  //     }
  //   } catch (error) {
  //     toast.error("Failed to update status");
  //   }
  // };

  const handleStatusChange = (userId, currentStatus, name) => {
    console.log("Status change (dummy):", { userId, currentStatus, name });
    toast.success("Status updated (dummy mode)");
  };

  // Commented out API call - dummy functionality
  // const handleDelete = async (id) => {
  //   try {
  //     const response = await submitData(
  //      `${DELETE_USERS}/${id}`,
  //       { },
  //       "POST"
  //     );
  //     if (response.status === 200) {
  //       toast.success("User deleted successfully");
  //       setDeleteConfirmationModal(false);
  //       getUsers();
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   }
  // };

  const handleDelete = (id) => {
    // Remove user from filterData (dummy deletion)
    const updatedUsers = filterData.filter(user => user._id !== id);
    setFilterData(updatedUsers);
    toast.success("User deleted successfully (dummy mode)");
    setDeleteConfirmationModal(false);
  };

  // const handleReportDownload = async () => {
  //   try {
  //     const response = await httpRequest.get(DOWNLOAD_USERS_REPORT, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       responseType: "blob",
  //     });

  //     const blob = new Blob([response.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     if (blob.size === 0) {
  //       throw new Error("The downloaded file is empty.");
  //     }

  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");

  //     link.href = downloadUrl;
  //     link.download = "Users_Detailed_Report.xlsx";

  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     window.URL.revokeObjectURL(downloadUrl);

  //     toast.success("Report downloaded successfully");
  //   } catch (error) {
  //     console.error("Error during file download:", error);
  //     toast.error("Something went wrong during the report download");
  //   }
  // };

  const PricingReport = [
    {
      icon: "BarChart",
      iconColor: "text-primary",
      value: usersData?.userStat?.totalUsers,
      label: "Total Users",
    },
    {
      icon: "CreditCard",
      iconColor: "text-green-500",
      value: usersData?.userStat?.normalUsers,
      label: "Normal Users",
    },
    {
      icon: "Anchor",
      iconColor: "text-orange-500",
      value: usersData?.userStat?.businessUser,
      label: "Business Users",
    },
    {
      icon: "close",
      iconColor: "text-red-500",
      value: usersData?.userStat?.blocked,
      label: "Blocked Users",
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
            <p className="text-xl font-bold uppercase">Manage Users</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search users"
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
              <Link to={"/add-users"}>
                <button className="btn btn-primary shadow-md mr-2">
                  Add User
                </button>
              </Link>
            </div>
          </div>
        </div>

        {filterData?.length > 0 ? (
    <div className="intro-y col-span-12 overflow-auto">
      <table className="table table-report -mt-2">
        <thead className="bg-purple-200">
          <tr>
            <th className="text-left whitespace-nowrap">Name</th>
            <th className="text-left whitespace-nowrap">Email</th>
            <th className="text-left whitespace-nowrap">User Type</th>
            <th className="text-left whitespace-nowrap">Email Verified</th>
            <th className="text-left whitespace-nowrap">Jobs Posted</th>
            <th className="text-left whitespace-nowrap">Created Date</th>
            <th className="text-left whitespace-nowrap">Status</th>
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
              <td
                className={`text-left text-[12px] font-semibold ${
                  user.userType === 1 ? "text-green-500" : "text-orange-500"
                }`}
              >
                {user.userType === 1 ? "Normal" : "Business"}
              </td>
              <td
                className={`text-left font-bold ${
                  user.profileVerified ? "text-green-500" : "text-red-500"
                }`}
              >
                {user.profileVerified ? "Verified" : "Not Verified"}
              </td>
              <td className="text-left">0</td>
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
                  user.status === '1' ? "text-green-500" : "text-red-500"
                }`}
              >
                {user.status === '1' ? "Active" : "Blocked"}
              </td>
              <td className="w-64">
                <div className="flex justify-center items-center gap-2">
                  <div
                    onClick={() => navigate(`/user-detail/${user._id}`)}
                    className="flex items-center cursor-pointer"
                  >
                    <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                  </div>
                  <div
                    onClick={() => navigate("/add-users", { state: { data: user } })}
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
      {filterData?.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-slate-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filterData.length)} of {filterData.length} entries
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
          userType="user"
        />
      )}
    </>
  );
}

export default Users;
