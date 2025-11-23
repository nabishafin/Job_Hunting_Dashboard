import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingIcon } from "../../base-components";

const TopItems = () => {
  const navigate = useNavigate();
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAnalyticsData = async () => {
    try {
      setUserSubscriptions([
        {
          username: "testuser",
          totalActiveMonths: 10,
        },
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnalyticsData();
  }, []);

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

 

  return (
    <div>
      <div className="intro-y h-100vh mt-8">
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

   {
    userSubscriptions.length > 0 ? (<div className=" mt-5">
      <div className="box p-5 rounded-md">
        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
          <div className="font-medium text-base truncate">Top 50 Items</div>
        </div>
        <div className="intro-y col-span-12 overflow-auto">
          <table className="table table-report -mt-2">
            <thead>
              <tr>
                <th className="whitespace-nowrap">Username</th>
                <th className="text-center whitespace-nowrap">Item Name</th>
              </tr>
            </thead>
            <tbody>
              {userSubscriptions?.map((subscription, index) => (
                <tr key={index} className="intro-y">
                  <td className=" whitespace-nowrap">
                    {subscription.username}
                  </td>
                  <td className="text-center whitespace-nowrap">
                    {subscription.totalActiveMonths}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>) : <p className="text-center">No data found</p>
   }
      
    </div>
  );
};

export default TopItems;
