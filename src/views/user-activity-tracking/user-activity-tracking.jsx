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

function UserActivityTracking() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();

  const getUsers = async (fieldName = "", type = "") => {
    try {
      setLoading(false);
      setUsersData([
        {
          _id: "1",
          username: "user1",
          email: "user1@example.com",
          createdAts: "2023-01-01",
          recipeDownloads: 10,
          mealPlanCreation: 5,
        },
        {
          _id: "2",
          username: "user2",
          email: "user2@example.com",
          createdAts: "2023-02-01",
          recipeDownloads: 15,
          mealPlanCreation: 8,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [searchQuery]);

  const handleStatusChange = async (userId, currentStatus, name) => {
    let url;
    let payload;
    console.log("called", name);

    if (name === "banned") {
      url = `${SET_BANNED_STATUS}/${userId}`;
      payload = { banned: !currentStatus };
    }
    if (name === "hasFreeAccess") {
      url = `${SET_FREE_ACCESS}/${userId}`;
      payload = { hasFreeAccess: !currentStatus };
    }

    try {
      const response = await httpRequest.put(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        getUsers();

        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`${DELETE_USERS}/${id}`);
      toast.success("User deleted successfully");
      setDeleteConfirmationModal(false);
      getUsers();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleReportDownload = async () => {
    try {
      const response = await httpRequest.get(DOWNLOAD_USERS_REPORT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (blob.size === 0) {
        throw new Error("The downloaded file is empty.");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = "Users_Detailed_Report.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Error during file download:", error);
      toast.error("Something went wrong during the report download");
    }
  };

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
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Manage users</p>
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
            {/* <div>
                <button
                  className="btn btn-primary shadow-md mr-2"
                  onClick={handleReportDownload}
                >
                  Download Users Report
                </button>
                <Link to={"/add-users"}>
                  <button className="btn btn-primary shadow-md mr-2">
                    Add User
                  </button>
                </Link>
              </div> */}
          </div>
        </div>

        {usersData.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Username</th>

                  {/* <th className="text-center whitespace-nowrap">Last Name</th> */}
                  <th className="text-center whitespace-nowrap">Email</th>
                  <th className="text-center whitespace-nowrap">
                    Last login date
                  </th>
                  {/* <th className="text-center whitespace-nowrap">Address</th> */}
                  <th className="text-center whitespace-nowrap">
                    Recipe downloads
                  </th>
                  <th className="text-center whitespace-nowrap">
                    Meal plan creations
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user, index) => (
                  <tr key={index} className="intro-x">
                    {/* <td className="whitespace-nowrap">
                        {user.username || "-"}
                      </td> */}
                    <td className="" style={{ whiteSpace: "nowrap" }}>
                      {user.username || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{
                        whiteSpace: "nowrap",
                        textDecoration: "underline",
                      }}
                    >
                      {user.email}
                    </td>

                    <td className="text-center whitespace-nowrap">
                      {user.createdAts
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "short", // Thu
                            month: "short", // Dec
                            day: "2-digit", // 19
                            year: "numeric", // 2024
                          }).format(new Date(user.createdAts))
                        : "-"}
                    </td>
                    {/* <td className="text-center">{user.address}</td> */}
                    <td className="text-center whitespace-nowrap">
                      {user.recipeDownloads || "0"}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {user.mealPlanCreation || "0"}
                    </td>
                    {/* <td className="text-center">{user.referralBank} days</td>
                    <td className="text-center">{user.earnings} $</td>
                    <td className="text-center">
                      {user.preferredCurrency || "-"}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      {user.createdAt
                        ? new Intl.DateTimeFormat("en-US", {
                            weekday: "short", // Thu
                            month: "short", // Dec
                            day: "2-digit", // 19
                            year: "numeric", // 2024
                          }).format(new Date(user.createdAt))
                        : "-"}
                    </td>

                    <td className="text-center">
                      <div className="w-full mt-3 xl:mt-0 flex-1">
                        {user?.isProfileActive == 1 ? (
                          <p className="text-success">Active</p>
                        ) : (
                          <p className="text-danger">Inactive</p>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="w-full mt-3 xl:mt-0 flex-1">
                        <div className="form-check form-switch">
                          <input
                            id="product-status-active"
                            className="form-check-input"
                            type="checkbox"
                            onChange={() =>
                              handleStatusChange(
                                user?._id,
                                user?.hasFreeAccess,
                                "hasFreeAccess"
                              )
                            }
                            checked={user?.hasFreeAccess ? true : false}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="product-status-active"
                          ></label>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="w-full mt-3 xl:mt-0 flex-1">
                        <div className="form-check form-switch">
                          <input
                            id="product-status-active"
                            className="form-check-input"
                            type="checkbox"
                            onChange={() =>
                              handleStatusChange(
                                user?._id,
                                user?.banned,
                                "banned"
                              )
                            }
                            checked={user?.banned == 1 ? true : false}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="product-status-active"
                          ></label>
                        </div>
                      </div>
                    </td>
                    <td className="w-56">
                      <div className="flex justify-center items-center">
                        <div
                          onClick={() =>
                            navigate("/user-detail", { state: { data: user } })
                          }
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                        </div>
                        <div
                          onClick={() =>
                            navigate("/add-users", { state: { data: user } })
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
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  );
}

export default UserActivityTracking;
