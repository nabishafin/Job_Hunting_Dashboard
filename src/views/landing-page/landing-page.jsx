import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { LANDING_PAGE, UPLOAD_IMAGE } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import httpRequest from "../../axios";
import { LoadingIcon } from "../../base-components";

const LandingPageCategory = () => {
  const [forms, setForms] = useState([
    { categoryName: "", text: "", image: null },
  ]);
   const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();
  const { submitData } = useCreateOrEdit();

  const getLandingPageData = async () => {
    try {
      setForms(
        [
          {
            categoryName: "Category 1",
            text: "Text 1",
            image: "https://via.placeholder.com/150",
          },
        ]
      );
    } catch (error) {
      console.log(error);
    }finally{
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getLandingPageData();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedForms = [...forms];
    updatedForms[index][name] = value;
    setForms(updatedForms);
  };

  const handleImageChange = async (e, index) => {
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

          const updatedForms = [...forms];
          updatedForms[index].image = imageUrl;
          setForms(updatedForms);
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

  const handleAddForm = () => {
    setForms([...forms, { categoryName: "", text: "", image: null }]);
  };

  const handleRemoveForm = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this entry?"
    );
    if (confirmDelete) {
      const updatedForms = forms.filter((_, i) => i !== index);
      setForms(updatedForms);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      if (!form.categoryName) {
        toast.error(`Category Name is missing in Form ${i + 1}`);
        return;
      }
      if (!form.text) {
        toast.error(`Text is missing in Form ${i + 1}`);
        return;
      }
      if (!form.image) {
        toast.error(`Image is missing in Form ${i + 1}`);
        return;
      }
    }

    try {
      const response = await submitData(
        `${LANDING_PAGE}/category`,
        { category: forms },
        "POST"
      );
      toast.success(response?.data?.message || "Form submitted successfully");
    } catch (error) {
      console.log(error);
    }finally{
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
    <div className="p-4 rounded-lg overflow-hidden">
      {forms.map((form, formIndex) => (
        <div
          key={formIndex}
          className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6 mb-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Manage Category, Text, and Image
            </h3>
            {forms?.length > 1 && (
              <X
                onClick={() => handleRemoveForm(formIndex)}
                color="red"
                cursor="pointer"
                className="cursor-pointer"
              />
            )}
          </div>

          <div className="form-group mt-4">
            <p>Category Name</p>
            <input
              type="text"
              name="categoryName"
              value={form.categoryName}
              placeholder="Enter category name"
              onChange={(e) => handleChange(e, formIndex)}
              className="p-2 mt-1 border rounded-md w-full"
            />
          </div>

          <div className="form-group mt-4">
            <p>Text</p>
            <textarea
              name="text"
              value={form.text}
              placeholder="Enter text"
              onChange={(e) => handleChange(e, formIndex)}
              className="p-2 mt-1 border rounded-md w-full"
            />
          </div>

          <div className="form-group mt-4">
            <p>Image</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, formIndex)}
              className="p-2 mt-1 border rounded-md w-full"
            />
            {form.image && (
              <div className="mt-4">
                <p>Image Preview:</p>
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 w-48 h-48 object-cover border rounded-md"
                />
              </div>
            )}
            {formIndex === forms.length - 1 && (
              <button
                type="button"
                className="btn btn-outline text-black p-2 rounded-md mt-4"
                onClick={handleAddForm}
              >
                Add Another
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="text-right mt-4">
        <button
          type="button"
          className="btn btn-primary text-white p-2 rounded-md"
          onClick={handleSubmit}
          disabled={loading}
        >
          {
            loading ? (
            <LoadingIcon
              icon="tail-spin"
              color="white"
              // className="w-4 h-2 ml-2"
            />
          ) : 
            "Save"

        }
        </button>
      </div>
    </div>
  );
};

export default LandingPageCategory;
