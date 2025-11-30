import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { GET_USER_DETAILS } from "../../constants";
import { useNavigate, useParams } from "react-router-dom";

const UserDetails = () => {
  const { fetchData } = useFetch();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const userId = useParams().id;

  // Dummy user details data
  const dummyUserDetails = {
    user: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      role: "Business",
      status: "Active",
      verified: true,
    },
    totalJobs: 5,
    jobs: [
      {
        _id: "691a98e2b25049c0d97ab3cb",
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
      {
        _id: "4",
        fromAddress: { address: "Maastricht Square, Netherlands" },
        toAddress: { address: "Tilburg Center, Netherlands" },
        createdAt: "2024-10-15T09:45:00Z",
      },
      {
        _id: "5",
        fromAddress: { address: "Leiden University, Netherlands" },
        toAddress: { address: "Haarlem Center, Netherlands" },
        createdAt: "2024-10-20T11:30:00Z",
      },
    ],
  };

  // Commented out API call - using dummy data
  // const getUserDetails = async () => {
  //   try {
  //     const response = await fetchData(`${GET_USER_DETAILS}/${userId}`);
  //     setUserDetails(response.data);
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  useEffect(() => {
    // getUserDetails();
    setUserDetails(dummyUserDetails);
  }, [userId]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Name:</p>
            <p>
              {userDetails?.user?.firstName} {userDetails?.user?.lastName}
            </p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{userDetails?.user?.email}</p>
          </div>
          <div>
            <p className="font-medium">User Type:</p>
            <p>{userDetails?.user?.role}</p>
          </div>
          <div>
            <p className="font-medium">Status:</p>
            <p
              className={
                userDetails?.user?.status === "Active" ? "text-green-600" : "text-red-600"
              }
            >
              {userDetails?.user?.status}
            </p>
          </div>
          <div>
            <p className="font-medium">Email Verified:</p>
            <p className={userDetails?.user?.verified ? "text-green-600" : "text-red-600"}>
              {userDetails?.user?.verified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </div>
      </div>

      {/* Jobs Stats */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-2">Jobs Statistics</h3>
        <p className="text-lg font-bold">
          Total Jobs Posted: {userDetails?.totalJobs}
        </p>
      </div>

      {/* Jobs List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Jobs List</h3>
        {userDetails?.jobs.length > 0 ? (
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
              {userDetails?.jobs?.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{job?.fromAddress?.address}</td>
                  <td className="p-3 border">{job?.toAddress?.address}</td>
                  <td className="p-3 border">
                    {new Date(job?.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="p-3 border font-semibold text-purple-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/job-details/${job?._id}`)}
                  >
                    View Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No jobs posted by this user.</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
