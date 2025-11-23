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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { TEMPLATES } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { LoadingIcon } from "../../base-components";
import { ChevronDown, ChevronUp } from "lucide-react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import useDelete from "../../hooks/useDelete";
import { calculateAge } from "../../utils/helper";

function Templates() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteAll, setDeleteAll] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const handleUnAuthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const getTemplates = async (fieldName = "", type = "") => {
    try {
      setLoading(false);
      setUsersData({
        templates: [
          {
            _id: "1",
            template_id: "T1",
            template: "Template 1",
            narrative_text: "Narrative text 1",
            theme_category: "Category 1",
            enneagram_match: "Match 1",
            auto_assignment_priority: "High",
            createdAt: "2023-01-01",
            status: "Active",
          },
          {
            _id: "2",
            template_id: "T2",
            template: "Template 2",
            narrative_text: "Narrative text 2",
            theme_category: "Category 2",
            enneagram_match: "Match 2",
            auto_assignment_priority: "Low",
            createdAt: "2023-02-01",
            status: "Inactive",
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTemplates();
  }, [searchQuery]);

  const handleDelete = async (id) => {
    if (deleteAll) {
      handleDeleteAll();
      return;
    }
    try {
      const response = await deleteData(`${TEMPLATES}/${id}`);
      toast.success("Artist deleted successfully");
      setDeleteConfirmationModal(false);
      setDeleteAll(null);
      getTemplates();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await deleteData(`${TEMPLATES}/all`);
      toast.success("Artists deleted successfully");
      setDeleteConfirmationModal(false);
      setDeleteAll(null);
      getTemplates();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const uploadArtists = async (file) => {
    if (!file) {
      toast.error("Please select a .csv file to upload.");
      return;
    }

    //   const validMimeType = "text/csv";
    //   if (file.type !== validMimeType) {
    //     toast.error("Invalid file type. Please upload a .csv file.");
    //     return;
    //   }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      setIsLoading(true);

      const response = await httpRequest.post(`${TEMPLATES}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message || "Artists uploaded successfully."
        );
        getTemplates();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(
          error.response?.data?.message ||
            "File processing failed. Please check the file format and try again."
        );
      } else if (error.response?.status === 401) {
        handleUnAuthenticate();
      } else {
        toast.error(
          error.response?.data?.message || "An unknown error occurred."
        );
      }
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  const handleFileSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      uploadArtists(selectedFile);
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

  const PricingReport = [
    {
      icon: "BarChart",
      iconColor: "text-primary",
      value: usersData?.stats?.totalArtists || 0,
      label: "Total Artists",
    },
    {
      icon: "CreditCard",
      iconColor: "text-pending",
      value: usersData?.stats?.activeArtists || 0,
      label: "Active Artists",
    },
    {
      icon: "Anchor",
      iconColor: "text-warning",
      value: usersData?.stats?.inactiveArtists || 0,
      label: "Inactive Artists",
    },
    {
      icon: "Star",
      iconColor: "text-warning",
      value: usersData?.stats?.totalReviews || 0,
      label: "Total Reviews Received",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* <div className="col-span-12 mt-2">
            <div className="grid grid-cols-12 gap-6 mt-0">
                {PricingReport.map((item, index) => (
                  <div
                    key={index}
                    className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
                  >
                    <div className="report-box zoom-in">
                      <div className="box p-5">
                      
                        <div className="text-3xl font-medium leading-8 mt-6">
                          {item.value}
                        </div>
                        <div className="text-base text-slate-500 mt-1">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          </div>
   */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Manage Templates</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search Templates"
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelection}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className={`btn btn-primary ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload Templates (CSV)"}
              </button>
              <Link to={"/add-templates"}>
                <button className="btn btn-primary shadow-md ml-2">
                  Add New Template
                </button>
              </Link>

              <button
                onClick={() => {
                  setDeleteAll(true);
                  setDeleteConfirmationModal(true);
                }}
                className={`btn btn-danger ml-2 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isLoading || usersData?.artists?.length === 0}
              >
                {isLoading ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        </div>

        {usersData?.templates?.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Template Id
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getTemplates("template_id", "asc")}
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
                          onClick={() => getTemplates("template_id", "desc")}
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
                      Template
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getTemplates("template", "asc")}
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
                          onClick={() => getTemplates("template", "desc")}
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
                      Narrative Text
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getTemplates("narrative_text", "asc")}
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
                          onClick={() => getTemplates("narrative_text", "desc")}
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
                  {/* <th className="text-center whitespace-nowrap">Address</th> */}

                  <th className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      Theme Category
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getTemplates("theme_category", "asc")}
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
                          onClick={() => getTemplates("theme_category", "desc")}
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
                      Enneagram Match
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getTemplates("enneagram_match", "asc")}
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
                          onClick={() =>
                            getTemplates("enneagram_match", "desc")
                          }
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
                      Auto Assignment Priority
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() =>
                            getTemplates("auto_asignment_priority", "asc")
                          }
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
                          onClick={() =>
                            getTemplates("auto_asignment_priority", "desc")
                          }
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
                    Created date
                  </th>
                  {/* <th className="text-center whitespace-nowrap">Total Reviews</th> */}
                  <th className="text-center whitespace-nowrap">Status</th>

                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.templates?.map((user, index) => (
                  <tr key={index} className="intro-x">
                    <td
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {user.template_id}
                    </td>
                    <td
                      className="text-center"
                      style={{
                        whiteSpace: "nowrap",
                        //   textDecoration: "underline",
                      }}
                    >
                      {user.template.length > 50
                        ? `${user.template.slice(0, 50)}...`
                        : user.template || "-"}
                    </td>

                    <td className="text-center">
                    {user.narrative_text.length > 50
                        ? `${user.narrative_text.slice(0, 50)}...`
                        : user.narrative_text || "-"}
                    </td>
                    {/* <td className="text-center">{user.address}</td> */}

                    <td
                      className="text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                      // title={user?.description}
                    >
                      {user?.theme_category || "-"}
                    </td>

                    <td
                      className="text-center"
                      style={{
                        whiteSpace: "nowrap",
                        //   textDecoration: "underline",
                      }}
                    >
                      {user.enneagram_match}
                    </td>

                    <td
                      className="text-center"
                      style={{
                        whiteSpace: "nowrap",
                        //   textDecoration: "underline",
                      }}
                    >
                      {user.auto_assignment_priority || "-"}
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

                    <td className="text-center whitespace-nowrap">
                      <div className="w-full xl:mt-0 flex-1">{user.status}</div>
                    </td>

                    <td className="w-56">
                      <div className="flex justify-center items-center">
                        {/* <div
                            onClick={() => navigate(`/artist-detail/${user?._id}`)}
                            className="flex items-center mr-3 cursor-pointer"
                          >
                            <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                          </div> */}
                        <div
                          onClick={() =>
                            navigate("/add-templates", {
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
                setId(null);
                setDeleteAll(null);
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

export default Templates;
