import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingIcon } from "../../base-components";

const UserAnalytics = () => {
    const navigate = useNavigate();
    const [userSubscriptions, setUserSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

 const getAnalyticsData = async () => {
    try {
      setUserSubscriptions([
        {
          username: "John Doe",
          totalActiveMonths: 12,
        },
        {
          username: "Jane Doe",
          totalActiveMonths: 6,
        },
      ]);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      return null;
    }finally{
      setLoading(false);
    }
  }

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
        <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <button
          className="btn btn-primary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <h2 className="text-lg font-medium mr-auto mt-5">
        User Analytics
        </h2>
      <div className="intro-y grid grid-cols-11 gap-5 mt-5">
        <div className="col-span-12 lg:col-span-4 2xl:col-span-4">
          <div className="box p-5 rounded-md">
          <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">User subscriptions</div>
            </div>
            <div className="intro-y col-span-12 overflow-auto">
              <table className="table table-report -mt-2">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap">Username</th>
                    <th className="text-center whitespace-nowrap">No. of months</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    userSubscriptions?.map((subscription, index) => (
                      <tr key={index} className="intro-y">
                        <td className=" whitespace-nowrap">{subscription.username}</td>
                        <td className="text-center whitespace-nowrap">{subscription.totalActiveMonths}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 2xl:col-span-7">
          <div className="box p-5 rounded-md">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">Total referral count</div>
            </div>
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Username</th>
                  <th className="text-center whitespace-nowrap">number of people</th>
                  <th className="text-center whitespace-nowrap">Total days</th>
                  <th className="text-center whitespace-nowrap">Referral count</th>
                </tr>
              </thead>
              <tbody>
                {
                  userSubscriptions?.map((subscription, index) => (
                    <tr key={index} className="intro-y">
                      <td className=" whitespace-nowrap">{subscription.username}</td>
                      <td className="text-center whitespace-nowrap">{subscription.totalActiveMonths || 0}</td>
                      <td className="text-center whitespace-nowrap">{subscription.totalActiveMonths || 0}</td>
                      <td className="text-center whitespace-nowrap">{subscription.totalActiveMonths || 0}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;
