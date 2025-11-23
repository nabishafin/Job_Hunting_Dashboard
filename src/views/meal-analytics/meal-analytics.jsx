import { Modal, ModalBody } from "@/base-components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { GET_RECIPES, ADD_LIKE_DOWNLOAD, GET_MEAL_PLANS } from "../../constants";
import httpRequest from "../../axios";
import toast from "react-hot-toast";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import { LoadingIcon } from "../../base-components";
import { useNavigate } from "react-router-dom";

function MealAnalytics() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("calanderVersionStats");
  const [recipes, setRecipes] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { submitData } = useCreateOrEdit();
  const navigate = useNavigate();
  const getRecipes = async () => {
    try {
      const response = await submitData(
        GET_MEAL_PLANS,
        { searchQuery,  },
        "POST"
      );
      setLoading(false);
      setRecipes(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

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

  console.log(selectedVariable)

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
            <p className="text-lg font-medium">Meal Analytics</p>
          </div>
          <div>
            <select
              className="w-52 border border-gray-300 rounded p-2 "
              value={selectedVariable}
              onChange={(e) => setSelectedVariable(e.target.value)}
            >
              <option value="detailedVersionStats">Detailed version</option>
              <option value="calanderVersionStats">Calendar version</option>
            </select>
          </div>
        </div>

        {recipes.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto">
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Name</th>
                  <th className="text-center whitespace-nowrap">Number of prints</th>
                  <th className="text-center whitespace-nowrap">
                    Number of Download
                  </th>
                  <th className="text-center whitespace-nowrap">
                    Send to email
                  </th>
                  <th className="text-center whitespace-nowrap">
                    Send to phone
                  </th>
                  {/* <th className="text-center whitespace-nowrap">Number of print</th> */}
                  {/* {selectedVariable === "numberOfDownloads" ? (
                    <th className="text-center whitespace-nowrap">Downloads</th>
                  ) : (
                    <th className="text-center whitespace-nowrap">Likes</th>
                  )} */}
                  {/* <th className="text-center whitespace-nowrap">Downloads</th>
                  <th className="text-center whitespace-nowrap">Likes</th> */}
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe, index) => (
                  <tr key={index} className="intro-x">
                    <td className="">{recipe.title}</td>

                    <td className="text-center">{recipe[selectedVariable]?.numberOfPrints}</td>
                    <td className="text-center">
                      {recipe[selectedVariable]?.numberOfDownloads || "0"}
                    </td>
                    <td className="text-center">{recipe[selectedVariable]?.numberOfSentToEmail }</td>
                    <td className="text-center">{recipe[selectedVariable]?.numberOfSentToPhone }</td>
                    {/* <td className="text-center">{recipe.numberOfPrint || "0"}</td> */}
                    {/* {selectedVariable === "numberOfDownloads" ? (
                      <td className="text-center">
                        {recipe.numberOfDownloads}
                      </td>
                    ) : (
                      <td className="text-center">{recipe.numberOfLikes}</td>
                    )} */}
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

export default MealAnalytics;
