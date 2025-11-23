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
import { GET_PRICING_PLANS, PRICING_PLANS } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { LoadingIcon } from "../../base-components";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import useDelete from "../../hooks/useDelete";

function Plans() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pricingplan, setpricingplan] = useState([]);
  const navigate = useNavigate();
  const { submitData } = useCreateOrEdit();
  const { deleteData } = useDelete();

  const getpricingplan = async (fieldName = "", type = "") => {
    try {
      const response = await submitData(
        GET_PRICING_PLANS,
        {
          searchQuery: "",
          type,
          fieldName,
        },
        "POST"
      );
      setLoading(false);

      console.log(response.data);
      setpricingplan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getpricingplan();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`${PRICING_PLANS}/${id}`);
      toast.success(response?.data?.message || "Plan deleted successfully");
      setDeleteConfirmationModal(false);
      getpricingplan();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
      {/* <h2 className="intro-y text-lg font-medium mt-10">Clubs List</h2> */}
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <h1 className="text-lg font-medium">Manage plans</h1>
          </div>
          <div>
            <Link to={"/add-plans"}>
              <button className="btn btn-primary shadow-md mr-2">
                Add plan
              </button>
            </Link>
          </div>
        </div>

        {/* BEGIN: Data List */}
        {pricingplan.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      Plan name
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getpricingplan("name", "asc")}
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
                          onClick={() => getpricingplan("name", "desc")}
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
                  <th className=" text-center whitespace-nowrap">
                    Description
                  </th>
                  <th className=" text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      CAD Pricing
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getpricingplan("cadPrice", "asc")}
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
                          onClick={() => getpricingplan("cadPrice", "desc")}
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
                  <th className=" text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      USD Pricing
                      <div className="flex flex-col items-center gap-[2px] cursor-pointer">
                        {/* Upward arrow */}
                        <svg
                          onClick={() => getpricingplan("usdPrice", "asc")}
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
                          onClick={() => getpricingplan("usdPrice", "desc")}
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
                  <th className=" text-center whitespace-nowrap">Length</th>
                  <th className=" text-center whitespace-nowrap">Status</th>

                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {pricingplan?.map((plan, index) => (
                  <tr key={index} className="intro-x">
                    <td className="w-40">
                      <div className="flex">
                        <div className="font-medium whitespace-nowrap">
                          {plan.name}
                        </div>
                      </div>
                    </td>
                    <td
                      className="text-center"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {plan?.descriptions
                        ?.map(
                          (description, index) => `${index + 1}. ${description}`
                        )
                        .join("\n")}
                    </td>
                    <td className="text-center">
                      {plan.cadPrice ? `$${plan.cadPrice.toFixed(2)}` : "-"}
                    </td>
                    <td className="text-center">
                      {plan.usdPrice ? `$${plan.usdPrice.toFixed(2)}` : "-"}
                    </td>
                    <td className="text-center">
                      {plan.length ? ` ${plan.length} Days ` : "-"}
                    </td>
                    <td className="text-center">
                      <span
                        style={{
                          color: plan?.status
                            ? "green"
                            : plan?.status === false
                            ? "red"
                            : "black",
                        }}
                      >
                        {plan?.status
                          ? "Active"
                          : plan?.status === false
                          ? "Inactive"
                          : "-"}
                      </span>
                    </td>

                    <td className=" w-56">
                      <div className="flex justify-center items-center ">
                        <div
                          onClick={() =>
                            navigate("/add-plans", { state: { data: plan } })
                          }
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                          {/* Edit */}
                        </div>
                        <a
                          className="flex items-center text-danger"
                          href="#"
                          onClick={() => {
                            setDeleteConfirmationModal(true);
                            setId(plan._id);
                          }}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                          {/* Delete */}
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
        {/* END: Data List */}
      </div>

      {/* BEGIN: Delete Confirmation Modal */}
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
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Plans;
