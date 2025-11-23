import { Modal, ModalBody } from "@/base-components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { GET_RECIPES, ADD_LIKE_DOWNLOAD } from "../../constants";
import httpRequest from "../../axios";
import toast from "react-hot-toast";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import { LoadingIcon } from "../../base-components";
import { useNavigate } from "react-router-dom";

function RecipeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("numberOfLikes");
  const [recipes, setRecipes] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { submitData } = useCreateOrEdit();
  const navigate = useNavigate();
  const getRecipes = async () => {
    try {
      const response = await submitData(GET_RECIPES, { searchQuery , fieldName: selectedVariable , type:'desc' }, "POST");
      setLoading(false);
      setRecipes(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, [searchQuery , selectedVariable]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          style={{ width: "100px", height: "100px" }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y flex flex-col sm:flex-row items-center ">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center justify-between">
          <div>
            <p className="text-lg font-medium">Recipe Analytics</p>
          </div>
          <div>
            <select
              className="w-52 border border-gray-300 rounded p-2 "
              value={selectedVariable}
                onChange={(e) => setSelectedVariable(e.target.value)}
            >
              <option value="numberOfDownloads">Top 50 downloads</option>
              <option value="numberOfLikes">Top 50 likes</option>
            </select>
          </div>
        </div>

        {recipes.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Image</th>
                  <th className="text-center whitespace-nowrap">Name</th>
                  {
                    selectedVariable === 'numberOfDownloads' ? <th className="text-center whitespace-nowrap">Downloads</th> : <th className="text-center whitespace-nowrap">Likes</th>
                  }
                  {/* <th className="text-center whitespace-nowrap">Downloads</th>
                  <th className="text-center whitespace-nowrap">Likes</th> */}
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe, index) => (
                  <tr key={index} className="intro-x">
                    <td className="w-40">
                      <div
                        className="w-10 h-10 image-fit zoom-in cursor-pointer"
                        onClick={() => handleImageClick(recipe.image)}
                      >
                        <img
                          alt="Recipe"
                          className="rounded-full object-contain"
                          src={recipe.image}
                        />
                      </div>
                    </td>
                    <td className="text-center">{recipe.name}</td>
                    {
                      selectedVariable === 'numberOfDownloads' ? <td className="text-center">{recipe.numberOfDownloads}</td> : <td className="text-center">{recipe.numberOfLikes}</td>
                    }
                    {/* <td className="text-center">{recipe.numberOfDownloads}</td>
                    <td className="text-center">{recipe.numberOfLikes}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="intro-y col-span-12 flex justify-center items-center">
            No data found.
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Modal show={imageModal} onHidden={() => setImageModal(false)}>
        <ModalBody className="flex justify-center items-center">
          <img
            src={selectedImage}
            alt="Selected Recipe"
            className="max-w-full max-h-screen object-contain"
          />
        </ModalBody>
      </Modal>
    </>
  );
}

export default RecipeAnalytics;
