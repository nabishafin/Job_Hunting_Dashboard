import React from "react";
import { useLocation } from "react-router-dom";

const UserDetail = () => {
  const location = useLocation();
  const user = location.state?.data;
  console.log("user", user);

  return (
    <div className="p-5">
      <button className="btn btn-primary" onClick={() => window.history.go(-1)}>
        Back
      </button>
      <div className="text-center pt-2 pb-5">
        <h1 className="text-xl font-semibold">User details</h1>
      </div>
      {/* Parent Grid to Hold Two Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Details Section */}
        <div className="box p-5 rounded-md">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <h1 className="py-2 truncate">Username</h1>
              <h1 className="py-2 truncate">Name</h1>
              <h1 className="py-2 truncate">Date of birth</h1>
              <h1 className="py-2 truncate">Email</h1>
              <h1 className="py-2 truncate">Phone number</h1>
              <h1 className="py-2 truncate">Address</h1>
              <h1 className="py-2 truncate">Gender</h1>
              <h1 className="py-2 truncate">Country</h1>
              <h1 className="py-2 truncate">City</h1>
            </div>
            <div>
              <h1 className="py-2 truncate">{user.username || "-"}</h1>
              <h1 className="py-2 truncate">
                {user?.firstName + " " + user?.lastName || "-"}
              </h1>
              <h1 className="py-2 truncate">{user.dateOfBirth || "-"}</h1>
              <h1 className="py-2 truncate">{user.email || "-"}</h1>
              <h1 className="py-2 truncate">{user.phoneNumber || "-"}</h1>
              <h1 className="py-2 truncate">{user.address || "-"}</h1>
              <h1 className="py-2 truncate">{user.gender || "-"}</h1>
              <h1 className="py-2 truncate">{user.country || "-"}</h1>
              <h1 className="py-2 truncate">{user.city || "-"}</h1>
            </div>
          </div>
        </div>
        <div className="box p-5 rounded-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h1 className="py-2 truncate">Language</h1>
              <h1 className="py-2 truncate">Total money spent</h1>
              <h1 className="py-2 truncate">How did you hear about us?</h1>
              <h1 className="py-2 truncate">What are you looking for?</h1>
              <h1 className="py-2 truncate">Discount Code (if any)</h1>
              <h1 className="py-2 truncate">Subscription date</h1>
              <h1 className="py-2 truncate">Cancellation date </h1>
              <h1 className="py-2 truncate">Is added by admin or not?</h1>
            </div>
            <div>
              <h1 className="py-2 truncate">{user.preferredLanguage || "-"}</h1>
              <h1 className="py-2 truncate">{user.moneySpent || "-"}</h1>
              <h1 className="py-2 truncate">{user.referralPlatform || "-"}</h1>
              <h1 className="py-2 truncate">{user.lookingFor || "-"}</h1>
              <h1 className="py-2 truncate">{user.usedCoupon || "-"}</h1>
              <h1 className="py-2 truncate">{user.subscriptionDate || "-"}</h1>
              <h1 className="py-2 truncate">{user.subscriptionDate || "-"}</h1>
              <h1 className="py-2 truncate">{user.subscriptionDate || "-"}</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6">
        <div className="box p-5 rounded-md">
          <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
            <div className="font-medium text-base truncate">
              Referred person details
            </div>
          </div>
          <div className="flex justify-between">
            <h1 className="truncate">Username</h1>
            <h1 className="truncate">Email</h1>
            <h1 className="truncate">Phone number</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;

{
  /* <div className="box p-5 rounded-md">
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Username</h1>
              <h1>{user?.username || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Name</h1>
              <h1>{user?.firstName + " " + user?.lastName || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Date of Birth</h1>
              <h1>{user?.dateOfBirth || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Email</h1>
              <h1>{user?.email || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Phone Number</h1>
              <h1>{user?.phoneNumber || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Address</h1>
              <h1>{user?.address || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Gender</h1>
              <h1>{user?.gender || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Country</h1>
              <h1>{user?.country || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">City</h1>
              <h1>{user?.city || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Referral Bank Balance</h1>
              <h1>{user?.referralBank || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Total Money Earned</h1>
              <h1>{user?.earnings || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Currency</h1>
              <h1>{user?.preferredCurrency || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">How did you hear about us?</h1>
              <h1>{user?.referralPlatform || "-"}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">What are you looking for?</h1>
              <h1>{user?.lookingFor || "-"}</h1>
            </div>
          </div> */
}
