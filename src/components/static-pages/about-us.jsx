import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Lucide } from "../../base-components";
import httpRequest from "../../axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { ABOUT_US } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";

const AboutUs = () => {
  const [content, setContent] = useState(""); // State for ReactQuill
  const [loading, setLoading] = useState(false); 
  const [pageLoading, setPageLoading] = useState(true); 
  const accessToken = useSelector(selectAccessToken);
  const handleUnAuthenticate = useUnauthenticate();

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

  
  const getAboutUs = async () => {
    try {
      const response = await httpRequest.get(ABOUT_US, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setContent(response.data.content);
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
    }finally{
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getAboutUs();
  }, []);


  const saveAboutUs = async () => {
    try {
      setLoading(true);
      const response = await httpRequest.post(
        ABOUT_US,
        { content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("About Us saved successfully");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
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
    <div className="container mx-auto p-4">
      <div className="pb-6">
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => window.history.back()}
          aria-label="Go Back"
        >
          <Lucide icon="ArrowLeft" />
          Back
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-6">About us</h1>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        style={{ height: "400px", marginBottom: "1rem" }}
      />

      <div className="pt-10 flex justify-end">
        <button className="btn btn-primary" 
        onClick={saveAboutUs}
        > {
            loading ? (
            <LoadingIcon
              icon="tail-spin"
              color="white"
              // className="w-4 h-2 ml-2"
            />
          ) : 
            "Save"

        }</button>
      </div>
    </div>
  );
};

export default AboutUs;
