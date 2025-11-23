import { Lucide } from "@/base-components";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import toast from "react-hot-toast";
import { UPDATE_PASSWORD } from "../../constants";
import httpRequest from "../../axios";
import useUnauthenticate from "../../hooks/handle-unauthenticated";


function Main() {
  const handleUnAuthenticate = useUnauthenticate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const accessToken = useSelector(selectAccessToken);
  const user = useSelector((state) => state.user);

  console.log(accessToken, user, "ABC")

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async() => {
    if(!password.oldPassword || !password.newPassword || !password.confirmPassword){
      toast.error("All fields are required");
      return
    }
    if( password.newPassword !== password.confirmPassword){
      toast.error("Passwords do not match");
      return
    }
    try {
      const response = await httpRequest.post(UPDATE_PASSWORD, password, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        toast.success("Password changed successfully");
        setPassword({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.log(error);

      if (error?.response?.status === 401) {
        useUnauthenticate();
      }
  };
}

  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Change password</h2>
      </div>
      <div className="">
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="intro-y box lg:mt-5">
            <div className="p-5">
              {/* Old Password */}
              <div className="relative">
                <label htmlFor="change-password-form-1" className="form-label">
                  Old password
                </label>
                <input
                  id="change-password-form-1"
                  type={showOldPassword ? "text" : "password"}
                  className="form-control pr-10"
                  placeholder="Old password"
                  name="oldPassword"
                  value={password.oldPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute top-11 right-3 flex items-center"
                >
                  <Lucide icon={showOldPassword ? "EyeOff" : "Eye"} className="w-5 h-5" />
                </button>
              </div>

              {/* New Password */}
              <div className="relative mt-3">
                <label htmlFor="change-password-form-2" className="form-label">
                  New password
                </label>
                <input
                  id="change-password-form-2"
                  type={showNewPassword ? "text" : "password"}
                  className="form-control pr-10"
                  placeholder="New password"
                  name="newPassword"
                  value={password.newPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-11 right-3 flex items-center"
                >
                  <Lucide icon={showNewPassword ? "EyeOff" : "Eye"} className="w-5 h-5" />
                </button>
              </div>

              {/* Confirm New Password */}
              <div className="relative mt-3">
                <label htmlFor="change-password-form-3" className="form-label">
                  Confirm new password
                </label>
                <input
                  id="change-password-form-3"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control pr-10"
                  placeholder="Confirm new password"
                  name="confirmPassword"
                  value={password.confirmPassword}
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-11 right-3 flex items-center"
                >
                  <Lucide icon={showConfirmPassword ? "EyeOff" : "Eye"} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" className="custom_black_button mt-4" onClick={handleChangePassword}>
              Change password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
