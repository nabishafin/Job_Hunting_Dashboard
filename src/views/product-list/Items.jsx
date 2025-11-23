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

function Items() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();

  // Dummy items data (25 items)
  const dummyItems = [
    { _id: "1", name: "Sofa", length: 200, width: 90, height: 80, price: 150, status: 1, createdAt: "2024-01-15T10:00:00Z" },
    { _id: "2", name: "Dining Table", length: 180, width: 90, height: 75, price: 120, status: 1, createdAt: "2024-02-20T11:30:00Z" },
    { _id: "3", name: "Bookshelf", length: 80, width: 30, height: 200, price: 80, status: 1, createdAt: "2024-03-10T09:15:00Z" },
    { _id: "4", name: "Wardrobe", length: 150, width: 60, height: 220, price: 200, status: 1, createdAt: "2024-04-05T14:45:00Z" },
    { _id: "5", name: "Coffee Table", length: 120, width: 60, height: 45, price: 60, status: 0, createdAt: "2024-05-12T08:20:00Z" },
    { _id: "6", name: "Bed Frame", length: 210, width: 160, height: 100, price: 250, status: 1, createdAt: "2024-06-08T16:00:00Z" },
    { _id: "7", name: "Desk", length: 140, width: 70, height: 75, price: 90, status: 1, createdAt: "2024-07-14T10:30:00Z" },
    { _id: "8", name: "TV Stand", length: 160, width: 45, height: 50, price: 70, status: 1, createdAt: "2024-08-22T13:15:00Z" },
    { _id: "9", name: "Dresser", length: 120, width: 50, height: 90, price: 110, status: 0, createdAt: "2024-09-05T11:45:00Z" },
    { _id: "10", name: "Nightstand", length: 50, width: 40, height: 60, price: 40, status: 1, createdAt: "2024-10-11T15:20:00Z" },
    { _id: "11", name: "Armchair", length: 90, width: 85, height: 95, price: 130, status: 1, createdAt: "2024-01-25T09:00:00Z" },
    { _id: "12", name: "Ottoman", length: 60, width: 60, height: 45, price: 50, status: 1, createdAt: "2024-02-18T12:30:00Z" },
    { _id: "13", name: "Sideboard", length: 180, width: 45, height: 85, price: 140, status: 0, createdAt: "2024-03-30T14:00:00Z" },
    { _id: "14", name: "Console Table", length: 100, width: 35, height: 80, price: 75, status: 1, createdAt: "2024-04-12T10:15:00Z" },
    { _id: "15", name: "Bar Stool", length: 40, width: 40, height: 75, price: 45, status: 1, createdAt: "2024-05-20T16:45:00Z" },
    { _id: "16", name: "Recliner", length: 100, width: 90, height: 105, price: 180, status: 1, createdAt: "2024-06-15T08:30:00Z" },
    { _id: "17", name: "Bench", length: 120, width: 40, height: 45, price: 55, status: 1, createdAt: "2024-07-28T13:00:00Z" },
    { _id: "18", name: "Cabinet", length: 90, width: 40, height: 120, price: 95, status: 1, createdAt: "2024-08-10T11:20:00Z" },
    { _id: "19", name: "Chest of Drawers", length: 100, width: 45, height: 110, price: 115, status: 0, createdAt: "2024-09-22T15:50:00Z" },
    { _id: "20", name: "Mirror", length: 80, width: 5, height: 120, price: 65, status: 1, createdAt: "2024-10-05T09:40:00Z" },
    { _id: "21", name: "Shoe Rack", length: 80, width: 30, height: 90, price: 35, status: 1, createdAt: "2024-01-08T11:50:00Z" },
    { _id: "22", name: "Coat Rack", length: 50, width: 50, height: 180, price: 30, status: 1, createdAt: "2024-02-14T16:30:00Z" },
    { _id: "23", name: "Storage Box", length: 60, width: 40, height: 40, price: 25, status: 1, createdAt: "2024-03-19T08:45:00Z" },
    { _id: "24", name: "Mattress", length: 200, width: 160, height: 25, price: 220, status: 1, createdAt: "2024-04-26T13:55:00Z" },
    { _id: "25", name: "Office Chair", length: 60, width: 60, height: 120, price: 85, status: 1, createdAt: "2024-05-30T10:20:00Z" },
  ];

  const dummyItemStats = {
    totalItems: 25,
    activeItems: 21,
    inactiveItems: 4,
  };

  useEffect(() => {
    // Apply search filter to dummy data
    let items = [...dummyItems];

    if (searchQuery) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(items);
    setUsersData({ itemsStat: dummyItemStats, users: items });
    setCurrentPage(1);
  }, [searchQuery]);

  // Initialize on mount
  useEffect(() => {
    setFilteredItems(dummyItems);
    setUsersData({ itemsStat: dummyItemStats, users: dummyItems });
  }, []);

  const handleStatusChange = (userId, currentStatus, name) => {
    console.log("Status change (dummy):", { userId, currentStatus, name });
    toast.success("Status updated (dummy mode)");
  };

  const handleDelete = (id) => {
    const updatedItems = filteredItems.filter(item => item._id !== id);
    setFilteredItems(updatedItems);
    setUsersData({ ...usersData, users: updatedItems });
    toast.success("Item deleted successfully (dummy mode)");
    setDeleteConfirmationModal(false);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const PricingReport = [
    {
      icon: "Trello",
      iconColor: "text-primary",
      value: usersData?.itemsStat?.totalItems || 0,
      label: "Total Items",
    },
    {
      icon: "Trello",
      iconColor: "text-green-500",
      value: usersData?.itemsStat?.activeItems || 0,
      label: "Active Items",
    },
    {
      icon: "Trello",
      iconColor: "text-orange-500",
      value: usersData?.itemsStat?.inactiveItems || 0,
      label: "Inactive Items",
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
            <p className="text-xl font-bold uppercase">Manage Items</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search Items..."
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Link to={"/add-items"}>
                <button className="btn btn-primary shadow-md mr-2">
                  Add Items
                </button>
              </Link>
            </div>
          </div>
        </div>

        {filteredItems?.length > 0 ? (
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
                      Length
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-start gap-2">
                      Width
                    </div>
                  </th>
                  <th className="text-start whitespace-nowrap">
                   Height
                  </th>
                  <th className="text-start whitespace-nowrap">Price</th>

                  <th className="text-start whitespace-nowrap">Created date</th>
                  <th className="text-start whitespace-nowrap">Status</th>

                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((user, index) => (
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
                      {user.length}
                    </td>

                    <td
                      className={`text-left`}
                    >
                      {user?.width}
                    </td>
                    {/* <td className="text-center">{user.address}</td> */}

                    <td className="text-left whitespace-nowrap">
                      <div
                      className={`text-left`}
                        // className={`w-full xl:mt-0 flex-1 font-bold ${
                        // //   user?.profileVerified
                        // //     ? "text-green-500"
                        // //     : "text-red-500"
                        // }`}
                      >
                        {user?.height}
                      </div>
                    </td>
                    <td className="text-left whitespace-nowrap">
                      <div className="w-full xl:mt-0 flex-1">${user?.price}</div>
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
                            navigate("/add-items", { state: { data: user } })
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

            {/* Pagination */}
            {filteredItems?.length > 0 && (
              <div className="flex justify-between items-center mt-4 px-4">
                <div className="text-sm text-slate-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length} entries
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
    </>
  );
}

export default Items;