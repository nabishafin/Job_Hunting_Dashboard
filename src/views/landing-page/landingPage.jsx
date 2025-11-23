import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LANDING_PAGE, UPLOAD_IMAGE } from "../../constants";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import httpRequest from "../../axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";

const LandingPage = () => {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [content, setContent] = useState("");
  const { submitData } = useCreateOrEdit();

  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();

  const getLandingPageData = async () => {
    try {
        setImage("https://via.placeholder.com/150");
        setHeading("Heading");
        setSubHeading("Sub Heading");
        setContent("Content");
    } catch (error) {
      console.log(error);
    }finally{
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getLandingPageData();
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

  const setLandingPage = async () => {
    setLoading(true);
    try {
      const data = {
        bannerImage: image,
        heading,
        subHeading,
        bannerText: content,
      };
      console.log(data);
      const response = await submitData(LANDING_PAGE, data, "POST");
      toast.success(response?.data?.message || "Landing page updated successfully");
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  console.log(image, heading, subHeading, content);

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
      <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
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

        {/* sub heading */}
        <div className="mb-4">
          <label
            htmlFor="subHeading"
            className="block text-sm font-medium text-gray-700"
          >
            Sub heading
          </label>
          <input
            type="text"
            id="subHeading"
            value={subHeading}
            onChange={(e) => setSubHeading(e.target.value)}
            placeholder="Enter tag line"
            className="mt-2 block w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Banner Image  */}
        <div className="mb-4">
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Banner image
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

        {/* ReactQuill Editor */}
        <div className="mb-14">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Text on banner
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
            onClick={setLandingPage}
            disabled={loading}
          >
            {
            loading ? (
            <LoadingIcon
              icon="tail-spin"
              color="white"
            />
          ) : 
            "Save"

        }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
