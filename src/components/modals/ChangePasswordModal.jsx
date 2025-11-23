import React, { useState } from "react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import { CHANGE_USER_PASSWORD } from "../../constants";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ user, onClose , userType }) => {
  const [password, setPassword] = useState("");
    const { submitData } = useCreateOrEdit();
  

  const handlePasswordChange = async() => {
    // TODO: Replace this with your actual update password API call
    console.log("Changing password for:", user.email, "to:", password);
    try{
        const response = await submitData(`${CHANGE_USER_PASSWORD}/${user?._id}`,{password,userType},'POST')
        toast.success("Password changed successfully");


    }catch(error){
        console.error("Error changing password:", error);
        toast.error(error?.response?.data?.message || "Failed to change password");

    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[350px]">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <p className="text-sm text-gray-600 mb-2">User: {user.email}</p>
        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
