import { Modal, ModalBody } from "@/base-components";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GET_USERS, SEND_SMS } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { LoadingIcon } from "../../base-components";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import { calculateAge } from "../../utils/helper";

let VARIABLES = [
  '[firstName]', '[lastName]', '[username]'
]
function ManagePromotion() {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
    const [selectedVariable, setSelectedVariable] = useState("");


  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user)
        ? prev.filter((u) => u?._id !== user._id)
        : [...prev, user]
    );
  };

  console.log(usersData, 'user');
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(
        usersData?.map((user) => user?.phoneNumber ? user : null)
      );
    } else {
      setSelectedUsers([]);
    }
  };
 
  const getUsers = async (fieldName = "", type = "") => {
    try {
      const response = await submitData(
        GET_USERS,
        { searchQuery, fieldName, type },
        "POST"
      );
      setPageLoading(false);
      setUsersData(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, [searchQuery]);

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

  console.log("selectedUsers", selectedUsers);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    setSelectedVariable(selectedValue);

    // Copy to clipboard
    navigator.clipboard
      .writeText(selectedValue)
      .then(() => {
        toast.success(`${selectedValue} copied `);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const handleSendMessages = async () => {
    setLoading(true);
    try {
      const response = await httpRequest.post(
        SEND_SMS,
        { to: selectedUsers, message },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success("Message sent successfully");
        setOpenModal(false);
        setSelectedUsers([]);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Manage promotion through SMS</p>
          </div>
          
          <div className="flex gap-4">
          <div className="mb-4">
          <select
            className="w-52 border border-gray-300 rounded p-2"
            value={selectedVariable}
            onChange={handleSelectChange}
          >
            {VARIABLES?.map((emailVariable, index) => (
              <option key={index} value={`${emailVariable}`}>
                {`${emailVariable}`}
              </option>
            ))}
          </select>
        </div>
            <div>
              <input
                type="text"
                placeholder="Search users"
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
           
            <div>
              <button
                onClick={() => {
                  setOpenModal(true);
                  // setId(user._id);
                }}
                disabled={selectedUsers?.length === 0}
                className="btn btn-primary shadow-md mr-2"
              >
                Send SMS
              </button>
            </div>
          </div>
        </div>

        {usersData.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={handleSelectAll}
                        checked={
                          selectedUsers.length === usersData.length &&
                          usersData.length > 0
                        }
                      />
                      Username
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getUsers("username", "asc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M0.450271 6H8.5505C8.63251 5.99977 8.7129 5.97963 8.78301 5.94174C8.85312 5.90386 8.91031 5.84967 8.9484 5.78499C8.9865 5.72032 9.00406 5.64763 8.99921 5.57473C8.99436 5.50183 8.96727 5.43149 8.92086 5.37128L4.87075 0.161989C4.70289 -0.0539963 4.29878 -0.0539963 4.13048 0.161989L0.0803605 5.37128C0.0334803 5.43136 0.00598872 5.50174 0.000872541 5.57476C-0.00424364 5.64778 0.0132113 5.72065 0.0513409 5.78546C0.0894705 5.85027 0.146816 5.90453 0.217148 5.94235C0.28748 5.98018 0.368108 6.00011 0.450271 6Z"
                            fill="black"
                          />
                        </svg>
                        {/* Downward arrow */}
                        <svg
                          onClick={() => getUsers("username", "desc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M8.54973 6.58119e-07L0.449499 -5.00259e-08C0.367488 0.000228884 0.2871 0.0203701 0.216988 0.0582551C0.146876 0.0961401 0.089695 0.150334 0.0515997 0.215004C0.0135043 0.279675 -0.00406265 0.352372 0.000789873 0.425272C0.0056424 0.498171 0.0327303 0.568511 0.0791383 0.628721L4.12925 5.83801C4.29711 6.054 4.70122 6.054 4.86952 5.83801L8.91964 0.628722C8.96652 0.568637 8.99401 0.498262 8.99913 0.425241C9.00424 0.35222 8.98679 0.279348 8.94866 0.21454C8.91053 0.149733 8.85318 0.0954694 8.78285 0.0576459C8.71252 0.0198224 8.63189 -0.000114574 8.54973 6.58119e-07Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Name
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getUsers("firstName", "asc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M0.450271 6H8.5505C8.63251 5.99977 8.7129 5.97963 8.78301 5.94174C8.85312 5.90386 8.91031 5.84967 8.9484 5.78499C8.9865 5.72032 9.00406 5.64763 8.99921 5.57473C8.99436 5.50183 8.96727 5.43149 8.92086 5.37128L4.87075 0.161989C4.70289 -0.0539963 4.29878 -0.0539963 4.13048 0.161989L0.0803605 5.37128C0.0334803 5.43136 0.00598872 5.50174 0.000872541 5.57476C-0.00424364 5.64778 0.0132113 5.72065 0.0513409 5.78546C0.0894705 5.85027 0.146816 5.90453 0.217148 5.94235C0.28748 5.98018 0.368108 6.00011 0.450271 6Z"
                            fill="black"
                          />
                        </svg>
                        {/* Downward arrow */}
                        <svg
                          onClick={() => getUsers("firstName", "desc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M8.54973 6.58119e-07L0.449499 -5.00259e-08C0.367488 0.000228884 0.2871 0.0203701 0.216988 0.0582551C0.146876 0.0961401 0.089695 0.150334 0.0515997 0.215004C0.0135043 0.279675 -0.00406265 0.352372 0.000789873 0.425272C0.0056424 0.498171 0.0327303 0.568511 0.0791383 0.628721L4.12925 5.83801C4.29711 6.054 4.70122 6.054 4.86952 5.83801L8.91964 0.628722C8.96652 0.568637 8.99401 0.498262 8.99913 0.425241C9.00424 0.35222 8.98679 0.279348 8.94866 0.21454C8.91053 0.149733 8.85318 0.0954694 8.78285 0.0576459C8.71252 0.0198224 8.63189 -0.000114574 8.54973 6.58119e-07Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    </div>
                  </th>

                  {/* <th className="text-center whitespace-nowrap">Last Name</th> */}
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Email
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getUsers("email", "asc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M0.450271 6H8.5505C8.63251 5.99977 8.7129 5.97963 8.78301 5.94174C8.85312 5.90386 8.91031 5.84967 8.9484 5.78499C8.9865 5.72032 9.00406 5.64763 8.99921 5.57473C8.99436 5.50183 8.96727 5.43149 8.92086 5.37128L4.87075 0.161989C4.70289 -0.0539963 4.29878 -0.0539963 4.13048 0.161989L0.0803605 5.37128C0.0334803 5.43136 0.00598872 5.50174 0.000872541 5.57476C-0.00424364 5.64778 0.0132113 5.72065 0.0513409 5.78546C0.0894705 5.85027 0.146816 5.90453 0.217148 5.94235C0.28748 5.98018 0.368108 6.00011 0.450271 6Z"
                            fill="black"
                          />
                        </svg>
                        {/* Downward arrow */}
                        <svg
                          onClick={() => getUsers("email", "desc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M8.54973 6.58119e-07L0.449499 -5.00259e-08C0.367488 0.000228884 0.2871 0.0203701 0.216988 0.0582551C0.146876 0.0961401 0.089695 0.150334 0.0515997 0.215004C0.0135043 0.279675 -0.00406265 0.352372 0.000789873 0.425272C0.0056424 0.498171 0.0327303 0.568511 0.0791383 0.628721L4.12925 5.83801C4.29711 6.054 4.70122 6.054 4.86952 5.83801L8.91964 0.628722C8.96652 0.568637 8.99401 0.498262 8.99913 0.425241C9.00424 0.35222 8.98679 0.279348 8.94866 0.21454C8.91053 0.149733 8.85318 0.0954694 8.78285 0.0576459C8.71252 0.0198224 8.63189 -0.000114574 8.54973 6.58119e-07Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Phone Number
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getUsers("phoneNumber", "asc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M0.450271 6H8.5505C8.63251 5.99977 8.7129 5.97963 8.78301 5.94174C8.85312 5.90386 8.91031 5.84967 8.9484 5.78499C8.9865 5.72032 9.00406 5.64763 8.99921 5.57473C8.99436 5.50183 8.96727 5.43149 8.92086 5.37128L4.87075 0.161989C4.70289 -0.0539963 4.29878 -0.0539963 4.13048 0.161989L0.0803605 5.37128C0.0334803 5.43136 0.00598872 5.50174 0.000872541 5.57476C-0.00424364 5.64778 0.0132113 5.72065 0.0513409 5.78546C0.0894705 5.85027 0.146816 5.90453 0.217148 5.94235C0.28748 5.98018 0.368108 6.00011 0.450271 6Z"
                            fill="black"
                          />
                        </svg>
                        {/* Downward arrow */}
                        <svg
                          onClick={() => getUsers("phoneNumber", "desc")}
                          xmlns="http://www.w3.org/2000/svg"
                          width="8"
                          height="5"
                          viewBox="0 0 9 6"
                          fill="none"
                        >
                          <path
                            d="M8.54973 6.58119e-07L0.449499 -5.00259e-08C0.367488 0.000228884 0.2871 0.0203701 0.216988 0.0582551C0.146876 0.0961401 0.089695 0.150334 0.0515997 0.215004C0.0135043 0.279675 -0.00406265 0.352372 0.000789873 0.425272C0.0056424 0.498171 0.0327303 0.568511 0.0791383 0.628721L4.12925 5.83801C4.29711 6.054 4.70122 6.054 4.86952 5.83801L8.91964 0.628722C8.96652 0.568637 8.99401 0.498262 8.99913 0.425241C9.00424 0.35222 8.98679 0.279348 8.94866 0.21454C8.91053 0.149733 8.85318 0.0954694 8.78285 0.0576459C8.71252 0.0198224 8.63189 -0.000114574 8.54973 6.58119e-07Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">City</th>
                  <th className="text-center whitespace-nowrap">Country</th>
                  <th className="text-center whitespace-nowrap">Gender</th>
                  <th className="text-center whitespace-nowrap">Age</th>
                  <th className="text-center whitespace-nowrap">Language</th>
                  <th className="text-center whitespace-nowrap">
                    Referral bank balance
                  </th>
                  <th className="text-center whitespace-nowrap">
                    How did you hear about us{" "}
                  </th>
                  <th className="text-center whitespace-nowrap">
                    What are you looking for
                  </th>
                  <th className="text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.map((user, index) => (
                  <tr key={index} className="intro-x">
                    <td className="whitespace-nowrap flex items-center gap-3">
                      <div>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          onChange={() =>
                            handleCheckboxChange(user)
                          }
                          checked={selectedUsers.some((selectedUser) => selectedUser?._id === user._id)}
                          disabled={!user?.phoneNumber }
                        />
                      </div>
                      {user.username || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {user.firstName + " " + user.lastName || "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{
                        whiteSpace: "nowrap",
                        textDecoration: "underline",
                      }}
                    >
                      {user.email || "-"}
                    </td>

                    <td className="text-center">{user.phoneNumber || "-"}</td>
                    <td className="text-center">{user.city || "-"}</td>
                    <td className="text-center">{user.country || "-"}</td>
                    <td className="text-center">{user.gender || "-"}</td>
                    {/* <td className="text-center">{user.phoneNumber}</td> */}
                    <td className="text-center">
                      {calculateAge(user?.dateOfBirth) || "-"}
                    </td>

                    <td className="text-center">{user.preferredLanguage || "-"}</td>
                    <td className="text-center">{user.referralBank || "0"}</td>
                    <td className="text-center">{user.referralPlatform || "-"}</td>
                    <td className="text-center">{user.lookingFor || "-"}</td>
                    <td className="text-center">{user.status || "-"}</td>
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
        show={openModal}
        onHidden={() => {
          setOpenModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <div>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendMessages}
              className="btn btn-primary shadow-md w-24"
              disabled={message.length === 0 || loading}
            >
              {loading ? (
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  className="w-8 h-6 ml-2"
                />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default ManagePromotion;
