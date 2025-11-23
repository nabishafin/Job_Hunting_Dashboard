import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { SUCCESS_REFERRAL_BANNER, UPLOAD_IMAGE } from "../../constants";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import httpRequest from "../../axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";

const SuccessBanner = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [heading, setHeading] = useState("");
  const [days, setDays] = useState("");
  const [footer, setFooter] = useState("");
  const [tagLine, setTagLine] = useState("");
  const { submitData } = useCreateOrEdit();

  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();

  const getBannerData = async () => {
    try {
      setFooter("Footer text"),
        setHeading("Heading text"),
        setTagLine("Tagline text");
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getBannerData();
  }, []);

  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setDays(value);
    }
  };

  const referralModal = async () => {
    setLoading(true);
    try {
      const data = {
        tagLine,
        heading,
        footer,
      };
      console.log(data);
      const response = await submitData(SUCCESS_REFERRAL_BANNER, data, "POST");
      toast.success(
        response?.data?.message || "Success banner updated successfully"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="pt-10">
      <div className=" flex justify-between">
        <div>
          <p className="text-xl font-bold pb-6">Success Referral Banner</p>
        </div>
        <div className="mb-4">
          <h5 className="text-xl font-semibold">SMS Variables List</h5>
          {/* <select
            className="w-52 mt-5 border border-gray-300 rounded p-2"
            value={selectedVariable}
            onChange={handleSelectChange}
          >
            {emailVariables?.map((emailVariable, index) => (
              <option key={index} value={`[${emailVariable}]`}>
                {`[${emailVariable}]`}
              </option>
            ))}
          </select> */}
        </div>
      </div>
      <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
        <div className="mb-4">
          <label
            htmlFor="heading"
            className="block text-sm font-medium text-gray-700"
          >
            Heading
          </label>
          <input
            type="text"
            id="heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            placeholder="Enter heading"
            className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm "
          />
        </div>

        {/* Days Input */}
        <div className="mb-4">
          <label
            htmlFor="days"
            className="block text-sm font-medium text-gray-700"
          >
            Tag Line
          </label>
          <textarea
            type="text"
            id="tagLine"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            placeholder="Enter tag line"
            className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Tag Line Input */}
        <div className="mb-4">
          <label
            htmlFor="tagLine"
            className="block text-sm font-medium text-gray-700"
          >
            Footer
          </label>
          <input
            type="text"
            id="tagLine"
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            placeholder="Enter tag line"
            className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="flex justify-end mt">
          <button
            className="btn btn-primary shadow-md px-4 py-2"
            onClick={referralModal}
            disabled={loading}
          >
            {loading ? (
              <LoadingIcon
                icon="tail-spin"
                color="white"
                // className="w-4 h-2 ml-2"
              />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessBanner;
