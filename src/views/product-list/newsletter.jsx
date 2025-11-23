import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  EXPORT_NEWSLETTER_MEMBERS,
  EXPORT_NEWSLETTER_NON_MEMBERS,
  GET_NEWSLETTER_MEMBERS,
} from "../../constants";
import { LoadingIcon } from "../../base-components";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";

function Newsletter() {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState([]);
  const [filter, setFilter] = useState("All");
  const handleUnAuthorize = useUnauthenticate();

  const accessToken = useSelector(selectAccessToken);

  const getNewsLetterSubscribers = async () => {
    try {
      setLoading(false);
      setSubscribers([
        {
          email: "test1@test.com",
          subscribedAt: "2023-01-01",
          isMember: true,
        },
        {
          email: "test2@test.com",
          subscribedAt: "2023-01-01",
          isMember: false,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNewsLetterSubscribers();
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

  const handleMembersDownload = async () => {
    try {
      const response = await httpRequest.get(EXPORT_NEWSLETTER_MEMBERS, {
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
      link.download = "Members_Subscribers.xlsx"; 
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(downloadUrl);
  
      toast.success("Members list downloaded successfully!");
    } catch (error) {
      console.error("Error downloading members list:", error);
      if(error?.response?.status === 404){
        toast.error("No members found to export.");
        return
      }
      toast.error("There was an error downloading the file. Please try again.");
    }
  };
  

  const handleNonMembersDownload = async () => {
    try {
      const response = await httpRequest.get(EXPORT_NEWSLETTER_NON_MEMBERS, {
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
      link.download = "Non-Members_Subscribers.xlsx"; 
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(downloadUrl);
  
      toast.success("Non-members list downloaded successfully!");
    } catch (error) {
      console.error("Error downloading non-members list:", error);
      if(error?.response?.status === 404){
        toast.error("No non-members found to export.");
        return
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
            <p className="text-lg font-medium">Subscribers</p>
          </div>

          <div>
            <select
              className="w-52 mt-5 border border-gray-300 rounded p-2 mr-2"
              // value={selectedVariable}
              onChange={handleSelectChange}
            >
              <option value="All">All</option>
              <option value="members">Members</option>
              <option value="nonmembers">Non Members</option>
            </select>
            <button
              className="btn btn-primary shadow-md mr-2"
              onClick={handleMembersDownload}
            >
              Download Members Report
            </button>
            <button
              className="btn btn-primary shadow-md mr-2"
              onClick={handleNonMembersDownload}
            >
              Download Non Members Report
            </button>
          </div>
        </div>

        {/* BEGIN: Data List */}
        {subscribers.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Email</th>
                  <th className=" text-center whitespace-nowrap">
                    Subscription Date
                  </th>
                  <th className=" text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers?.map((subscriber, index) => (
                  <tr key={index} className="intro-x">
                    <td className="w-40">
                      <div className="flex">
                        <div className="font-medium whitespace-nowrap">
                          {subscriber?.email}
                        </div>
                      </div>
                    </td>
                    <td className="w-40">
                      <div className="flex">
                        <div className="font-medium whitespace-nowrap">
                          {
                            new Date(subscriber?.subscribedAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      {subscriber?.isMember ? "Member" : "Non Member"}
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

export default Newsletter;
