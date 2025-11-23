import React, { useEffect, useState } from "react";
import {
  Lucide,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  ModalBody,
} from "@/base-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DOWNLOAD_INGREDIENTS_REPORT, GET_GROCERY_INGREDIENTS, GROCERY_INGREDIENTS } from "../../constants";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import httpRequest from "../../axios";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { get } from "lodash";
import { X } from "lucide-react";
import { use } from "react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import { formatFraction } from "../../utils/helper";

const Ingredients = () => {
  const [ingredientsData, setIngredientsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTabData, setActiveTabData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [ingredientData, setIngredientData] = useState({
    name: "",
    specificity1: "",
    specificity2: "",
    specificity3: "",
    quantity: "",
    measurement: "",
    calories: "",
    proteins: "",
    fats: "",
    carbs: "",
    sugar: "",
    sodium: "",
  });
  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();
  const location = useLocation();
  const navigate = useNavigate();
  const {submitData} = useCreateOrEdit();

  const [activeTab, setActiveTab] = useState(location.state?.activetab || 0);

  console.log("active tab index", activeTab);

  const getIngredients = async () => {
    try {
      const response = await submitData(
        GET_GROCERY_INGREDIENTS,
        { searchQuery },
        "POST"
      );
      setLoading(false);
      setIngredientsData(response.data.results);
    } catch (error) {
      console.error(error);

      if (error?.response?.status === 401) {
        unauthenticate();
      }
    }
  };

  console.log(activeTabData);

  const [errors, setErrors] = useState({});

  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          errorMessage = "Ingredient name is required.";
        }
        break;
      case "quantity":
        if (!value.trim()) {
          errorMessage = "Quantity is required.";
        }
        break;
      case "measurement":
        if (!value.trim()) {
          errorMessage = "Measurement is required.";
        }
        break;
      case "calories":
        if (!value || isNaN(value) || Number(value) < 0) {
          errorMessage =
            "Calories is required and must be a non-negative number.";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Set the updated ingredient data
    setIngredientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the specific field
    const error = validateField(name, value);

    // Update the errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  useEffect(() => {
    getIngredients();
  }, [searchQuery]);

  useEffect(() => {
    if (ingredientsData.length > 0) {
      // setActiveTab(activeTab);
      setActiveTabData(ingredientsData[activeTab]);
    }
  }, [ingredientsData]);

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);

  console.log(selectedIngredientId);

  const handleIngredientDelete = async (id) => {
    try {
      const response = await httpRequest.delete(
        `${GROCERY_INGREDIENTS}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        getIngredients();
        setActiveTab(0);
      }
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong');
    }
    setDeleteConfirmationModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }} // Adjust the size as needed
        />
      </div>
    );
  }

  const handleSingleDelete = async (index) => {
    console.log(index);
    let newIngredients = ingredientsData.filter(
      (ing, i) => ing._id === activeTabData._id
    );
    newIngredients[0].ingredients?.splice(index, 1);
    console.log(newIngredients[0]);
    const payload = {
      name: newIngredients[0].name,
      ingredients: newIngredients[0].ingredients,
    };
    const url = `${GROCERY_INGREDIENTS}/${newIngredients[0]._id}`;

    const method = httpRequest.put;

    try {
      const response = await method(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Ingredient deleted successfully");
        setRowIndex(null);
        setDeleteConfirmationModal(false);
        getIngredients();
      } else {
        toast.error("Only super Admins can login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data.message || "An unknown error occurred."
      );
      console.error("Submit failed:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    console.log(id, rowIndex);

    if (id) {
      handleIngredientDelete(id);
    } else {
      handleSingleDelete(rowIndex);
    }
  };

  const handleAddIngredient = async () => {
    if (showForm) {
      const validationErrors = {};

      Object.keys(ingredientData).forEach((field) => {
        const error = validateField(field, ingredientData[field]);
        if (error) {
          validationErrors[field] = error;
        }
      });

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setErrors({});
      console.log(ingredientData);
      setActiveTabData({
        ...activeTabData,
        ingredients: [...activeTabData.ingredients, ingredientData],
      });
      const { _id, ...activeTabDataWithoutId } = activeTabData || {};

      console.log("activetabdata", activeTabData);

      const formData = {
        ...activeTabDataWithoutId,
        ingredients: [
          ...(activeTabDataWithoutId.ingredients || []),
          ingredientData,
        ],
      };
      console.log("formData", formData);
      try {
        const response = await httpRequest.put(
          `${GROCERY_INGREDIENTS}/${_id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("Ingredient added successfully");
          resetFormData();
          getIngredients();
          // setActiveTab(activeTab)
        }
      } catch (error) {
        toast.error(error.response.data.message);
        if (error?.response?.status === 401) {
          unauthenticate();
        }
      }
      setShowForm(false);
      return;
    } else {
      setShowForm(true);
    }
  };

  const resetFormData = () => {
    setIngredientData({
      name: "",
      specificity1: "",
      specificity2: "",
      specificity3: "",
      quantity: "",
      measurement: "",
      calories: "",
      proteins: "",
      fats: "",
      carbs: "",
      sugar: "",
      sodium: "",
    });
  };

  const handleAddCategory = () => {
    navigate("/add-ingredients", { state: { disableIngredientForm: true } });
  };

  const handleDownload = async () => {
    try {
      const response = await httpRequest.get(DOWNLOAD_INGREDIENTS_REPORT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'blob', 
      }); 
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }); 
      if (blob.size === 0) {
        throw new Error('The downloaded file is empty.'); 
      }
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "Ingredients_Report.xlsx"; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report.");
      if (error?.response?.status === 401) {
        handleUnAuthorize()
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-lg font-medium">Manage Grocery Ingredients</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search ingredients"
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => {setSearchQuery(e.target.value); setActiveTab(0)}}
              />
            </div>
            <div>
              <div>
                <button
                  className="btn btn-primary shadow-md mr-2"
                  onClick={handleAddCategory}
                >
                  Add category
                </button>
                <button
                  className="btn btn-primary shadow-md mr-2"
                  onClick={handleDownload}
                >
                  Download Ingredient Report
                </button>
              </div>
                
            </div>
          </div>
        </div>
      </div>
      {ingredientsData.length > 0 ? (
        <>
          <TabGroup className="col-span-12 lg:col-span-4 mt-4">
            <div className="intro-y pr-1">
              <div className="box p-2 flex items-center">
                <TabList className="nav-pills overflow-x-auto whitespace-nowrap scrollbar-hidden ">
                  {ingredientsData.map((tab, index) => (
                    <button
                      onClick={() => {
                        setActiveTab(index);
                        setActiveTabData(tab);
                      }}
                    >
                      <Tab
                        key={index}
                        className={`w-full py-2 ${
                          activeTab === index ? "active" : ""
                        }`}
                        tag="button"
                        onClick={() => setActiveTab(index)}
                      >
                        {tab.name}
                      </Tab>
                    </button>
                  ))}
                </TabList>
                <div className="flex justify-center items-center">
                  <div
                    onClick={() =>
                      navigate("/add-ingredients", {
                        state: {
                          data: activeTabData,
                          activeTabIndex: activeTab,
                        },
                      })
                    }
                    className="flex items-center mr-3 cursor-pointer"
                  >
                    <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                  </div>
                  <button
                    className="flex items-center text-danger"
                    onClick={() => {
                      setDeleteConfirmationModal(true);
                      setSelectedIngredientId(activeTabData._id);
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                  </button>
                </div>
              </div>
            </div>

            {activeTabData && (
              <div className="mt-5">
                {/* {ingredientsData.map((tab, index) => ( */}
                <TabPanel>
                  <div className="box p-5 rounded-md">
                    <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                      <div className="flex items-center justify-between w-full">
                        <div className="font-medium text-base truncate">
                          Ingredients
                        </div>
                        {/* <div className="flex justify-center items-center">
                          <div
                            onClick={() =>
                              navigate("/add-ingredients", {
                                state: { data: activeTabData },
                              })
                            }
                            className="flex items-center mr-3 cursor-pointer"
                          >
                            <Lucide
                              icon="CheckSquare"
                              className="w-4 h-4 mr-1"
                            />
                          </div>
                          <button
                            className="flex items-center text-danger"
                            onClick={() => {
                              setDeleteConfirmationModal(true);
                              setSelectedIngredientId(activeTabData._id);
                            }}
                          >
                            <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                          </button>
                        </div> */}
                      </div>
                    </div>

                    <div className="overflow-auto -mt-3">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap !py-5">Name</th>
                            <th className="whitespace-nowrap text-center">
                              Specificity 1
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Specificity 2
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Specificity 3
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Quantity
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Measurements
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Grocery list visiual
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Calories
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Protein
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Carbs
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Fat
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Sugar
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Sodium
                            </th>
                            <th className="whitespace-nowrap text-center">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeTabData?.ingredients?.map((ingredient, i) => (
                            <tr key={i}>
                              <td>{ingredient.name || "Unnamed Ingredient"}</td>
                              <td className="text-center">
                                {ingredient.specificity1 || "-"}
                              </td>

                              <td className="text-center">
                                {ingredient.specificity2 || "-"}
                              </td>
                              <td className="text-center">
                                {ingredient.specificity3 || "-"}
                              </td>
                              <td className="text-center">
                                {formatFraction(ingredient?.quantity) || "-"}
                              </td>
                              <td className="text-center">
                                {ingredient.measurement || "-"}
                              </td>
                              <td className="text-center whitespace-nowrap">
                                {[
                                  ingredient.name,
                                  ingredient.specificity1,
                                  ingredient.specificity2,
                                  ingredient.specificity3,
                                  formatFraction(ingredient?.quantity)  +
                                    " " +
                                    ingredient.measurement,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}{" "}
                                {/* Available fields ko comma-separated string mein convert karega */}
                              </td>

                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {ingredient?.calories
                                  ? `${ingredient.calories} cal`
                                  : "-"}
                              </td>
                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {ingredient?.proteins
                                  ? `${ingredient.proteins} g`
                                  : "-"}
                              </td>

                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {ingredient?.carbs
                                  ? `${ingredient.carbs} g`
                                  : "-"}
                              </td>

                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {ingredient?.fats
                                  ? `${ingredient.fats} g`
                                  : "-"}
                              </td>
                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {ingredient?.sugar
                                  ? `${ingredient.sugar} g`
                                  : "-"}
                              </td>
                              <td
                                className="text-center"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {ingredient?.sodium
                                  ? `${ingredient.sodium} mg`
                                  : "-"}
                              </td>
                              <td className="text-center">
                                <div className="flex justify-center items-center">
                                  <div
                                    onClick={() =>
                                      navigate("/add-ingredients", {
                                        state: {
                                          data: activeTabData,
                                          index: i,
                                          activeTabIndex: activeTab,
                                        },
                                      })
                                    }
                                    className="flex items-center mr-3 cursor-pointer"
                                  >
                                    <Lucide
                                      icon="Edit"
                                      className="w-4 h-4 mr-1"
                                    />
                                  </div>
                                  {/* {activeTabData?.ingredients?.length > 1 && ( */}
                                  <button
                                    className="flex items-center text-danger"
                                    onClick={() => {
                                      setDeleteConfirmationModal(true);
                                      setRowIndex(i);
                                    }}
                                  >
                                    <Lucide
                                      icon="Trash2"
                                      className="w-4 h-4 mr-1"
                                    />
                                  </button>
                                  {/* )} */}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabPanel>
                {/* ))} */}
              </div>
            )}
          </TabGroup>

          {showForm && (
            <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6 mt-4">
              <div
                className="flex justify-end"
                onClick={() => {
                  setShowForm(false);
                  resetFormData();
                }}
              >
                <X color="red" cursor="pointer" />
              </div>

              <div className="flex flex-wrap">
                <div className="flex-1 pr-2 pb-2">
                  <p>Ingredient name</p>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ingredient Name"
                    className={`w-full p-2 border rounded-md mt-2 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    value={ingredientData.name}
                    onChange={handleChange}
                  />
                  {errors?.name && (
                    <p className="text-red-500 text-sm">{errors?.name}</p>
                  )}
                </div>
                <div className="flex-1 pl-2">
                  <p>Specificity 1</p>
                  <input
                    type="text"
                    placeholder="Specificity 1"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.specificity1}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        specificity1: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex-1 pr-2">
                  <p>Specificity 2</p>
                  <input
                    type="text"
                    placeholder="Specificity 2"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.specificity2}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        specificity2: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-1 pl-2 pb-2">
                  <p>Specificity 3</p>
                  <input
                    type="text"
                    placeholder="Specificity 3"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.specificity3}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        specificity3: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="flex-1 pr-2">
                  <p>Quantity</p>
                  <input
                    type="text"
                    placeholder="Quantity"
                    name="quantity"
                    className={`w-full p-2 border rounded-md mt-2 ${
                      errors.quantity ? "border-red-500" : "border-gray-300"
                    }`}
                    value={ingredientData.quantity}
                    onChange={handleChange}
                  />
                  {errors?.quantity && (
                    <p className="text-red-500 text-sm">{errors?.quantity}</p>
                  )}
                </div>
                <div className="flex-1 pl-2">
                  <p>Measurement</p>
                  <input
                    type="text"
                    name="measurement"
                    placeholder="Measurement (e.g., kg, pieces)"
                    className={`w-full p-2 border rounded-md mt-2 ${
                      errors.measurement ? "border-red-500" : "border-gray-300"
                    }`}
                    value={ingredientData.measurement}
                    onChange={handleChange}
                  />
                  {errors?.measurement && (
                    <p className="text-red-500 text-sm">
                      {errors?.measurement}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap pt-2">
                <div className="flex-1 pr-2">
                  <p>Calories</p>
                  <input
                    type="number"
                    placeholder="Calories"
                    name="calories"
                    className={`w-full p-2 border rounded-md mt-2 ${
                      errors.calories ? "border-red-500" : "border-gray-300"
                    }`}
                    value={ingredientData.calories}
                    onChange={handleChange}
                  />
                  {errors?.calories && (
                    <p className="text-red-500 text-sm">{errors?.calories}</p>
                  )}
                </div>
                <div className="flex-1 pl-2">
                  <p>Protein</p>
                  <input
                    type="number"
                    placeholder="Protein"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.proteins}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        proteins: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap pt-2">
                <div className="flex-1 pr-2">
                  <p>Carbs</p>
                  <input
                    type="number"
                    placeholder="Carbs"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.carbs}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        carbs: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-1 pl-2">
                  <p>Fat</p>
                  <input
                    type="number"
                    placeholder="Fat"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.fats}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        fats: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-wrap pt-2">
                <div className="flex-1 pr-2">
                  <p>Sugar</p>
                  <input
                    type="number"
                    placeholder="Sugar"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.sugar}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        sugar: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex-1 pl-2">
                  <p>Sodium</p>
                  <input
                    type="number"
                    placeholder="Sodium"
                    className="w-full p-2 border rounded-md mt-2"
                    value={ingredientData.sodium}
                    onChange={(e) =>
                      setIngredientData({
                        ...ingredientData,
                        sodium: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <button
            className="mt-4 btn btn-primary shadow-md mr-2"
            onClick={handleAddIngredient}
          >
            {showForm ? "Submit" : "Add Ingredient"}
          </button>
        </>
      ) : (
        <div className="intro-y col-span-12 flex justify-center items-center">
          No data found.
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => setDeleteConfirmationModal(false)}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete this record? This process cannot be
              undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => setDeleteConfirmationModal(false)}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedIngredientId)}
              className="btn btn-danger w-24"
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Ingredients;
