import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useFetch from "../../hooks/useFetch";
import { REFFERAL_BANNER, UPLOAD_IMAGE } from "../../constants";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import httpRequest from "../../axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";

const ReferralBanner = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [heading, setHeading] = useState("");
  const [days, setDays] = useState("");
  const [frequency, setFrequency] = useState("");
  const [showTo, setShowTo] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [content, setContent] = useState(""); // Added content state for ReactQuill
  const { fetchData } = useFetch();
  const { submitData } = useCreateOrEdit();

  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();

  const getBannerData = async () => {
    try {
      const response = await fetchData(REFFERAL_BANNER);
      setImage(response.data[0].image);
      setHeading(response.data[0].heading);
      setDays(response.data[0].days);
      setTagLine(response.data[0].tagLine);
      setContent(response.data[0].description);
      setShowTo(response.data[0].showTo);
      setFrequency(response.data[0].frequency);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getBannerData();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (
      file &&
      ["image/png", "image/svg+xml", "image/jpeg"].includes(file.type)
    ) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await httpRequest.post(UPLOAD_IMAGE, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200 || response.status === 201) {
          const imageUrl = response.data.fileUrl;
          setImage(imageUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
        if (error?.response?.status === 401) unauthenticate();
      }
    } else {
      toast.error("Only PNG, SVG, and JPG images are allowed.");
    }
  };

  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setDays(value);
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const referralModal = async () => {
    setLoading(true);
    try {
      const data = {
        image,
        heading,
        days,
        tagLine,
        description: content,
        showTo,
        frequency,
      };
      console.log(data);
      const response = await submitData(REFFERAL_BANNER, data, "POST");
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(image, heading, days, tagLine, content, frequency, showTo);

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
      <div className="pb-6">
        <p className="text-2xl font-bold">Referral Banner</p>
      </div>
      <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
        {/* Image Upload */}
        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm "
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-4 w-32 h-32 object-cover rounded-md"
            />
          )}
        </div>

        {/* Heading Input */}
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
            Days
          </label>
          <input
            type="number"
            id="days"
            value={days}
            onChange={handleDaysChange}
            min="1"
            placeholder="Enter number of days"
            className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm "
          />
        </div>

        {/* Tag Line Input */}
        <div className="mb-4">
          <label
            htmlFor="tagLine"
            className="block text-sm font-medium text-gray-700"
          >
            Tag Line
          </label>
          <input
            type="text"
            id="tagLine"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            placeholder="Enter tag line"
            className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Adjusted Fields */}
        <div className="mb-4">
          {/* <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700"
            >
              Show To
            </label>
            <select
              id="showTo"
              onChange={(e) => setShowTo(e.target.value)}
              className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
              value={showTo}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div> */}

          {/* Input Field */}
          <div>
            <label
              htmlFor="tagLine"
              className="block text-sm font-medium text-gray-700"
            >
              Frequency
            </label>
            <input
              type="number"
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Enter frequency"
              className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* ReactQuill Editor */}
        <div className="mb-14">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Content
          </label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: "150px" }}
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

export default ReferralBanner;
