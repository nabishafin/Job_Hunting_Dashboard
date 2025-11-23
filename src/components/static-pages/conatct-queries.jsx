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
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CONTACT_QUERIES } from "../../constants";

import httpRequest from "../../axios";
import { LoadingIcon } from "../../base-components";
import useFetch from "../../hooks/useFetch";
import useDelete from "../../hooks/useDelete";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
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

function ContactQueries() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [id, setId] = useState(null);
  const [email, setEmail] = useState(null);
  const [content, setContent] = useState(""); // Added content state for ReactQuill
  const [title, setTitle] = useState(""); // Added content state for ReactQuill
  const [data, setData] = useState([]);
  const { error, fetchData } = useFetch();
  const { deleteData } = useDelete();
  const accessToken = useSelector(selectAccessToken);

  const getContactQueries = async () => {
    try {
      const response = await fetchData(CONTACT_QUERIES);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContactQueries();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`${CONTACT_QUERIES}/${id}`);
      getContactQueries();
      toast.success(response.data?.message || "Query deleted successfully");
      setDeleteConfirmationModal(false);
    } catch (error) {
      console.log(error);
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

  const handleReply = async () => {
    setLoading2(true);
    try {
      const response = await httpRequest.post(
        `${CONTACT_QUERIES}/reply`,
        {
          email,
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data?.message || "Query replied successfully");
        setOpenModal(false);
        setEmail("");
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        // toast.error();
      }
    } finally {
      setLoading2(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Contact Queries</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by username"
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Username
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("username", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("username", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Full name
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("firstName", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("firstName", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>

                  {/* <th className="text-center whitespace-nowrap">Last Name</th> */}
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Email
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("email", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("email", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Phone number
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("phoneNumber", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("phoneNumber", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      City
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("phoneNumber", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("phoneNumber", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  {/* <th className="text-center whitespace-nowrap">Address</th> */}
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Country
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Gender
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Age
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Language
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("country", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Subject
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("referralBank", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("referralBank", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Message
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("referralBank", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("referralBank", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Creation date
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("referralBank", "asc")}
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
                        </svg> */}
                        {/* Downward arrow */}
                        {/* <svg
                          // onClick={() => getUsers("referralBank", "desc")}
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
                        </svg> */}
                      </div>
                    </div>
                  </th>

                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((user, index) => (
                    <tr key={index} className="intro-x">
                      <td className="whitespace-nowrap">
                        {user.userName || "-"}
                      </td>
                      <td
                        className="text-center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {user.fullName || "-"}
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
                      <td
                        className="text-center"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {user.phoneNumber || "-"}
                      </td>

                      <td className="text-center">{user.city || "-"}</td>
                      {/* <td className="text-center">{user.address}</td> */}
                      <td className="text-center">{user.country || "-"}</td>
                      <td className="text-center">{user.gender || "-"}</td>
                      {/* <td className="text-center">{user.age || "-"}</td> */}
                      <td className="text-center">
                        {calculateAge(user?.dateOfBirth) || "-"}
                      </td>
                      <td className="text-center">
                        {user.preferredLanguage || "-"}
                      </td>

                      <td
                        className="text-center"
                        style={{
                          whiteSpace: "nowrap",
                          // textDecoration: "underline",
                        }}
                      >
                        {user.subject || "-"}
                      </td>
                      {/* <td className="text-center">{user.subject || "-"}</td> */}
                      <td
                        className="text-center"
                        style={{
                          whiteSpace: "nowrap",
                          // textDecoration: "underline",
                        }}
                      >
                        {user.message || "-"}
                      </td>
                      <td className="text-center whitespace-nowrap">
                        {new Date(user.createdAt).toDateString()}
                      </td>

                      <td className="w-56">
                        <div className="flex justify-center items-center gap-4">
                          {/* <div
                            onClick={() =>
                              navigate("/user-detail", { state: { data: user } })
                            }
                            className="flex items-center mr-3 cursor-pointer"
                          >
                            <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                          </div> */}
                          {/* <div
                          onClick={() =>
                            navigate("/add-users", { state: { data: user } })
                          }
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                        </div> */}
                          <a
                            className="flex items-center text-danger"
                            href="#"
                            onClick={() => {
                              setDeleteConfirmationModal(true);
                              setId(user._id);
                            }}
                          >
                            <Lucide icon="Trash2" className="w-4 h-4 " />
                          </a>
                          <button
                            className="flex items-center text-danger"
                            href="#"
                            onClick={() => {
                              setOpenModal(true);
                              setEmail(user.email);
                            }}
                            disabled={!user?.email || user?.email === ""}
                          >
                            <Lucide
                              icon="Send"
                              className="w-4 h-4 "
                              disabled={!user?.email || user?.email === ""}
                            />
                          </button>
                        </div>
                      </td>
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
      <Modal size="lg" show={openModal} onHidden={() => setOpenModal(false)}>
        <ModalBody className="px-8">
          {/* Rich Text Editor */}
          <div>
            <div className="text-lg font-medium truncate text-center pb-4">
              Reply Queries
            </div>
            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                value={title}
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              style={{ height: "250px" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="px-5 pt-24  text-center">
            <button
              type="button"
              onClick={() => {
                setOpenModal(false);
                setContent("");
                setEmail("");
                setTitle("");
              }}
              className="btn btn-outline-secondary w-24 mr-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReply}
              className="btn btn-primary w-24"
              disabled={!title || !content || loading2}
            >
              {loading2 ? (
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

export default ContactQueries;
