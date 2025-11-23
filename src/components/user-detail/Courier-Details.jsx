import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import toast from "react-hot-toast";

const CourierDetails = () => {
  const { fetchData } = useFetch();
  const {submitData} = useCreateOrEdit();
  const navigate = useNavigate();
  const [courierDetails, setCourierDetails] = useState(null);
  const courierId = useParams().id;

  // Dummy courier details data
  const dummyCourierDetails = {
    user: {
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.j@courier.com",
      phoneNumber: "+31 6 11111111",
      companyName: "Fast Delivery Co",
      companyLegalForm: "LLC",
      experienceWithCourier: "5 years",
      howYouKnow: "Online Search",
      communicationMode: "Email & Phone",
      companyLocation: { address: "Amsterdam, Netherlands" },
      approvalStatus: "approved",
      isVerified: true,
    },
    totalJobs: 8,
    jobs: [
      {
        _id: "1",
        fromAddress: { address: "Amsterdam Central, Netherlands" },
        toAddress: { address: "Rotterdam Port, Netherlands" },
        createdAt: "2024-10-01T08:30:00Z",
      },
      {
        _id: "2",
        fromAddress: { address: "Utrecht Station, Netherlands" },
        toAddress: { address: "Eindhoven Tech, Netherlands" },
        createdAt: "2024-10-05T10:15:00Z",
      },
      {
        _id: "3",
        fromAddress: { address: "The Hague Center, Netherlands" },
        toAddress: { address: "Groningen North, Netherlands" },
        createdAt: "2024-10-10T14:20:00Z",
      },
    ],
  };

  // Commented out API call - using dummy data
  // const getCourierDetails = async () => {
  //   try {
  //     const response = await fetchData(`/admin/courier-jobs/${courierId}`);
  //     setCourierDetails(response.data);
  //   } catch (error) {
  //     console.error("Error fetching courier details:", error);
  //   }
  // };

  useEffect(() => {
    // getCourierDetails();
    setCourierDetails(dummyCourierDetails);
  }, [courierId]);

  // Commented out API calls - dummy functionality
  // const handleApproval = async () => {
  //   try {
  //     await submitData(`/admin/approve-courier/${courierId}`,{},'PUT');
  //     toast.success("Courier approved and password sent via email.");
  //     getCourierDetails();
  //   } catch (err) {
  //     console.error("Error approving courier:", err);
  //     alert("Approval failed.");
  //   }
  // };

  const handleApproval = () => {
    setCourierDetails({
      ...courierDetails,
      user: { ...courierDetails.user, approvalStatus: "approved" }
    });
    toast.success("Courier approved and password sent via email (dummy mode).");
  };

  // const handleRejection = async () => {
  //   const reason = prompt("Enter rejection reason:");
  //   if (!reason) return;
  //   try {
  //     await submitData(`/admin/reject-courier/${courierId}`, { reason },'PUT');
  //     alert("Courier rejected.");
  //     getCourierDetails();
  //   } catch (err) {
  //     console.error("Error rejecting courier:", err);
  //     alert("Rejection failed.");
  //   }
  // };

  const handleRejection = () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    setCourierDetails({
      ...courierDetails,
      user: { ...courierDetails.user, approvalStatus: "rejected" }
    });
    toast.success(`Courier rejected (dummy mode). Reason: ${reason}`);
  };

  const courier = courierDetails?.user;

  if (!courier) return <p className="text-center py-10">Loading...</p>;

  const isPending = courier?.approvalStatus === "pending";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Courier Info */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">Courier Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Detail label="Name" value={`${courier.firstName} ${courier.lastName}`} />
          <Detail label="Email" value={courier.email} />
          <Detail label="Phone" value={courier.phoneNumber} />
          <Detail label="Company Name" value={courier.companyName} />
          <Detail label="Company Legal Form" value={courier.companyLegalForm} />
          <Detail label="Experience" value={courier.experienceWithCourier} />
          <Detail label="Referral Source" value={courier.howYouKnow} />
          <Detail label="Communication Mode" value={courier.communicationMode} />
          <Detail label="Location" value={courier.companyLocation?.address} />
          <Detail
            label="Approval Status"
            value={courier.approvalStatus}
            color={
              courier.approvalStatus === "approved"
                ? "text-green-600"
                : courier.approvalStatus === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }
          />
          <Detail
            label="Email Verified"
            value={courier.isVerified ? "Verified" : "Not Verified"}
            color={courier.isVerified ? "text-green-600" : "text-red-600"}
          />
        </div>

        {isPending && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleApproval}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={handleRejection}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Jobs Statistics */}
      {!isPending && (
        <>
          <div className="bg-white p-6 rounded-xl shadow mb-6">
            <h3 className="text-xl font-semibold mb-2">Jobs Statistics</h3>
            <p className="text-lg font-bold">
              Total Jobs: {courierDetails?.totalJobs || 0}
            </p>
          </div>

          {/* Jobs List */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Jobs List</h3>
            {courierDetails?.jobs?.length > 0 ? (
              <table className="w-full text-left border border-gray-200">
                <thead className="bg-purple-200">
                  <tr>
                    <th className="p-3 border">From Address</th>
                    <th className="p-3 border">To Address</th>
                    <th className="p-3 border">Posted Date</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courierDetails?.jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="p-3 border">{job.fromAddress?.address}</td>
                      <td className="p-3 border">{job.toAddress?.address}</td>
                      <td className="p-3 border">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td
                        className="p-3 border font-semibold text-purple-600 cursor-pointer hover:underline"
                        onClick={() => navigate(`/job-details/${job._id}`)}
                      >
                        View Details
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No jobs accepted by this courier.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const Detail = ({ label, value, color = "text-gray-800" }) => (
  <div>
    <p className="font-medium">{label}:</p>
    <p className={`${color}`}>{value || "N/A"}</p>
  </div>
);

export default CourierDetails;
