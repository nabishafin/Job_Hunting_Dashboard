import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import httpRequest from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LoadingIcon } from "../../base-components";
import { selectAccessToken } from "../../stores/userSlice";
import {
  GET_EMAIL_TEMPLATES,
  GET_SMS_TEMPLATES,
  UPDATE_EMAIL_TEMPLATES,
} from "../../constants";

const NotificationItem = ({
  _id,
  expanded,
  handleChange,
  onClose,
  onSave,
  loading,
  sms,
  smsFrench,
  hours,
  isActive,
  name,
}) => {
  const [title, setTitle] = useState(sms);
  const [titleFrench, setTitleFrench] = useState(smsFrench);
  const [numberOfHours, setNumberOfHours] = useState(hours);
  const [status, setStatus] = useState(isActive);
  const [sendOption, setSendOption] = useState("text");
  // const [description, setDescription] = useState(body);
  // const [frenchDescription, setFrenchDescription] = useState(frenchBody);

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"], // Add a button to clear formatting
    ],
  };

  const handleCancel = () => {
    setTitle(sms);
    setTitleFrench(smsFrench);
    setNumberOfHours(hours);
    setStatus(isActive);
    onClose();
  };

  const handleSave = () => {
    onSave(_id, title, titleFrench, numberOfHours, status);
    // onClose();
  };

  return (
    <>
      <div
        className={`mb-2 border border-gray-300 bg-white rounded-xl p-4 ${
          expanded ? "shadow-lg" : ""
        }`}
      >
        <div
          onClick={handleChange}
          className="flex justify-between items-center cursor-pointer"
        >
          <span className="text-base font-normal">
            {name === "account_creation"
              ? "Account Creation"
              : name === "welcome_email"
              ? "Welcome Email"
              : name === "successful_referral_email"
              ? "Successful Referral Email"
              : name === "cancel_subscription"
              ? "Cancel Subscription"
              : name === "newsletter_subscribers"
              ? "Newsletter Subscribers"
              : name === "referral_reminder"
              ? "Referral Reminder"
              : name === "referral_reminder_2"
              ? "Referral Reminder 2"
              : name === "payment_method_missing"
              ? "Payment Method Missing"
              : name === "payment_method_missing_2"
              ? "Payment Method Missing 2"
              : name === "payment_method_missing_3"
              ? "Payment Method Missing 3"
              : name === "payment_method_expired"
              ? "Payment Method Expired"
              : name === "grocery_list"
              ? "Grocery List"
              : name}
          </span>
          <button className="focus:outline-none">
            {expanded ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path d="M5 10l5-5 5 5H5z" /> {/* Arrow Down */}
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
              >
                <path d="M5 10l5 5 5-5H5z" /> {/* Arrow Up */}
              </svg>
            )}
          </button>
        </div>

        {expanded && (
          <>
            <div className="pt-4">
              <div className="flex justify-between items-center">
                {name === "payment_method_missing" ||
                name === "payment_method_missing_2" ||
                name === "payment_method_missing_3" ||
                name === "payment_method_expired" ? (
                  <div className="w-1/2 mb-4">
                    <label className="block text-sm">Trigger in (hours)</label>
                    <input
                      placeholder="Enter number of hours"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      type="number"
                      value={numberOfHours}
                      onChange={(e) => setNumberOfHours(e.target.value)}
                    />
                  </div>
                ) : (
                  ""
                )}
                <div className="w-full justify-end flex items-center">
                  <div className="form-check form-switch">
                    <input
                      id="product-status-active"
                      className="form-check-input"
                      type="checkbox"
                      checked={status}
                      onChange={(e) => setStatus(!status)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="product-status-active"
                    >
                      {status ? "Active" : "Inactive"}
                    </label>
                  </div>
                </div>
              </div>

              {/* <div className="pt-2">
                <label className="block text-sm">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Title"
                />
              </div> */}

              <div>
                {name === "grocery_list" && (
                  <div className="py-2 flex items-center gap-5">
                    <div>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="sendOption"
                          value="text"
                          checked={sendOption === "text"}
                          onChange={(e) => setSendOption(e.target.value)}
                        />{" "}
                        Send as text
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="sendOption"
                          value="image"
                          checked={sendOption === "image"}
                          onChange={(e) => setSendOption(e.target.value)}
                        />{" "}
                        Send as Image
                      </label>
                    </div>
                  </div>
                )}

                {sendOption === "text" && (
                  <textarea
                    rows={5}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Description"
                  />
                )}
              </div>
            </div>
            <div>
              {sendOption === "text" && (
                <>
                  <div className="py-2">
                    <p className="text-xl font-semibold mt-2">French</p>
                  </div>
                  <div>
                    <textarea
                      rows={5}
                      value={titleFrench}
                      onChange={(e) => setTitleFrench(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      placeholder="Description"
                    />
                  </div>
                </>
              )}

              <div className="pt-8 flex justify-end space-x-4">
                <button
                  className="px-4 py-2 font-normal text-sm border rounded-md"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 font-normal text-sm btn btn-primary text-white rounded-md"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingIcon
                      icon="tail-spin"
                      color="white"
                      className="w-8 h-6 ml-2"
                    />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

NotificationItem.propTypes = {
  _id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const SMSTemplates = () => {
  const [expanded, setExpanded] = useState(null);
  const [emailTemplates, setEmailTemplates] = useState([]);
  const accessToken = useSelector(selectAccessToken);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedVariable, setSelectedVariable] = useState("");
  const [smsVariables, setSmsVariables] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    console.log(selectedValue);
    setSelectedVariable(selectedValue);

    // Copy to clipboard
    navigator.clipboard
      .writeText(selectedValue)
      .then(() => {
        toast.success(`${selectedValue} copied `);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  const handleChange = (index) => () => {
    setExpanded(expanded === index ? null : index);
  };

  const handleClose = () => {
    setExpanded(null);
  };

  const handleSave = async (_id, sms, smsFrench, hours, isActive) => {
    setLoading(true);
    try {
      const response = await httpRequest.put(
        `${GET_SMS_TEMPLATES}/${_id}`,
        {
          sms,
          smsFrench,
          hours,
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        toast.success(
          response?.data?.message || "Template updated successfully"
        );
        fetchEmailTemplates();
      }
    } catch (error) {
      console.error("Error updating template", error);
      setLoading(false);
      if (error?.response?.status === 401) {
        toast.error(
          error?.response?.data?.error ||
            "Session expired. Login again to continue"
        );
        dispatch(clearUser());
        navigate("/login");
      }
    }
  };

  const fetchEmailTemplates = async () => {
    try {
      setEmailTemplates([
        {
          _id: 1,
          name: "account_creation",
          sms: "Your account has been created.",
          smsFrench: "Votre compte a été créé.",
          hours: 0,
          isActive: true,
        },
        {
          _id: 2,
          name: "welcome_email",
          sms: "Welcome to our service.",
          smsFrench: "Bienvenue à notre service.",
          hours: 0,
          isActive: true,
        },
      ]);
      setSmsVariables(["[name]", "[email]"]);
    } catch (error) {
      console.error("Error fetching email templates", error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailTemplates();
  }, [accessToken]);

  if (pageLoading) {
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
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">SMS Template List</h1>
        <div className="mb-4">
          <h5 className="text-xl font-semibold">SMS Variables List</h5>
          <select
            className="w-52 mt-5 border border-gray-300 rounded p-2"
            value={selectedVariable}
            onChange={handleSelectChange}
          >
            {smsVariables?.map((emailVariable, index) => (
              <option key={index} value={`[${emailVariable}]`}>
                {`[${emailVariable}]`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {emailTemplates?.map((notification, index) => (
        <NotificationItem
          key={index}
          _id={notification._id}
          expanded={expanded === index}
          handleChange={handleChange(index)}
          onClose={handleClose}
          onSave={handleSave}
          loading={loading}
          sms={notification.sms}
          smsFrench={notification.smsFrench}
          hours={notification.hours}
          isActive={notification.isActive}
          name={notification.name}
        />
      ))}
    </div>
  );
};

export default SMSTemplates;
