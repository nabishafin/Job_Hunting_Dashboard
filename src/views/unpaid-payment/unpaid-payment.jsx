import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  DOWNLOAD_PAYMENT_EXPIRED_REPORT,
  DOWNLOAD_PAYMENT_MISSING_REPORT,
  EXPORT_NEWSLETTER_MEMBERS,
  EXPORT_NEWSLETTER_NON_MEMBERS,
  GET_NEWSLETTER_MEMBERS,
  GET_UNPAID_USERS,
} from "../../constants";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { calculateAge } from "../../utils/helper";

function UnPaidManagement() {
  const [loading, setLoading] = useState(true);
  const [unPaidPayment, setUnPaidPayment] = useState([]);
  //   const [subscribers, setSubscribers] = useState([]);
  const [filter, setFilter] = useState("All");
  const handleUnAuthorize = useUnauthenticate();

  const accessToken = useSelector(selectAccessToken);

  const getUnPaidPaymentManagement = async () => {
    try {
      setLoading(false);
      setUnPaidPayment([
        {
          username: "testuser",
          firstName: "Test",
          lastName: "User",
          email: "test@user.com",
          phoneNumber: "1234567890",
          city: "Test City",
          country: "Test Country",
          dateOfBirth: "1990-01-01",
          gender: "Male",
          isPaymentAdded: false,
          isPaymentActive: false,
          preferredLanguage: "English",
          referralPlatform: "Google",
          lookingFor: "Friendship",
          createdAt: "2023-01-01",
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUnPaidPaymentManagement();
  }, [filter]);

  if (loading) {
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

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setFilter(selectedValue);
  };

  const handleMembersPaymentMissingDownload = async () => {
    try {
      const response = await httpRequest.get(DOWNLOAD_PAYMENT_MISSING_REPORT, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      if (response.status !== 200) {
        throw new Error("Failed to download members list.");
      }

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (blob.size === 0) {
        toast.error("No members found to export.");
        return;
      }

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Users_Payment_Missing_Report.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Members list downloaded successfully!");
    } catch (error) {
      console.error("Error downloading members list:", error);
      if (error?.response?.status === 404) {
        toast.error("No members found to export.");
        return;
      }
      toast.error("There was an error downloading the file. Please try again.");
    }
  };

  const handleMembersPaymentExpiredDownload = async () => {
    try {
      const response = await httpRequest.get(DOWNLOAD_PAYMENT_EXPIRED_REPORT, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      if (blob.size === 0) {
        toast.error("No non-members found to export.");
        return;
      }

      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Users_Payment_Expired_Report.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Non-members list downloaded successfully!");
    } catch (error) {
      console.error("Error downloading non-members list:", error);
      if (error?.response?.status === 404) {
        toast.error("No non-members found to export.");
        return;
      }
      toast.error("There was an error downloading the file. Please try again.");
    }
  };

  return (
    <>
      {/* <h2 className="intro-y text-lg font-medium mt-10">Clubs List</h2> */}
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Unpaid Payment Management</p>
          </div>

          <div>
            {/* <select
              className="w-52 mt-5 border border-gray-300 rounded p-2 mr-2"
              // value={selectedVariable}
              onChange={handleSelectChange}
            >
              <option value="All">All</option>
              <option value="members">Members</option>
              <option value="nonmembers">Non Members</option>
            </select> */}
            <button
              className="btn btn-primary shadow-md mr-2"
              onClick={handleMembersPaymentMissingDownload}
            >
              Download payment is missing report
            </button>
            <button
              className="btn btn-primary shadow-md mr-2"
              onClick={handleMembersPaymentExpiredDownload}
            >
              Download payment is expired report
            </button>
          </div>
        </div>

        {/* BEGIN: Data List */}
        {unPaidPayment.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto ">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Username</th>
                  <th className=" text-center whitespace-nowrap">Full name</th>
                  <th className=" text-center whitespace-nowrap">Email</th>
                  <th className=" text-center whitespace-nowrap">Phone</th>
                  <th className=" text-center whitespace-nowrap">City</th>
                  <th className=" text-center whitespace-nowrap">Country</th>
                  <th className=" text-center whitespace-nowrap">Age</th>
                  <th className=" text-center whitespace-nowrap">Gender</th>
                  <th className=" text-center whitespace-nowrap">
                    Payment status
                  </th>
                  <th className=" text-center whitespace-nowrap">Language</th>
                  <th className=" text-center whitespace-nowrap">
                    How did you hear about us 
                  </th>
                  <th className=" text-center whitespace-nowrap">
                    What are you looking for
                  </th>
                  <th className=" text-center whitespace-nowrap">
                    Creation date
                  </th>
                </tr>
              </thead>
              <tbody>
                {unPaidPayment?.map((unPaidPayments, index) => (
                  <tr key={index} className="intro-x">
                    <td>
                      <div className="font-medium whitespace-nowrap">
                        {unPaidPayments?.username || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.firstName +
                          " " +
                          unPaidPayments?.lastName || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.email || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.phoneNumber || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.city || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.country || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {calculateAge(unPaidPayments?.dateOfBirth) || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.gender || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {!unPaidPayments?.isPaymentAdded
                          ? "Payment is missing"
                          : !unPaidPayments?.isPaymentActive
                          ? "Payment expired"
                          : "-"}{" "}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.preferredLanguage || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.referralPlatform || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {unPaidPayments?.lookingFor || "-"}
                      </div>
                    </td>
                   
                    <td>
                      <div className="text-center  whitespace-nowrap">
                        {new Date(unPaidPayments?.createdAt).toDateString() ||
                          "-"}
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
    </>
  );
}

export default UnPaidManagement;
