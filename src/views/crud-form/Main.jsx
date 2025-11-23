import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon, TomSelect } from "../../base-components";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectAccessToken } from "../../stores/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import httpRequest from "../../axios";
import {
  CATEGORY_DROPDOWN,
  DIETARY_RESTRICTION_DROPDOWN,
  GET_GROCERY_INGREDIENTS,
  MEAL_STYLE_DROPDOWN,
  PREPARATION_DROPDOWN,
  PROTEIN_STYLE_DROPDOWN,
  RECIPES,
  UPLOAD_IMAGE,
} from "../../constants";
import Select from "react-select";
import {
  complexities,
  mealStyles,
  categories,
  proteinTypes,
  dietaryRestrictions,
  preparationOptions,
} from "../../utils/static";
import { useFormik } from "formik";
import * as Yup from "yup";
import { set } from "lodash";
import { formatFraction } from "../../utils/helper";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Recipe name is required"),
  description: Yup.string().required("Recipe description is required"),
  optionalField: Yup.string().max(
    500,
    "Optional field must be 500 characters or less"
  ),
  numberOfCalories: Yup.number()
    .min(0, "Calories cannot be negative")
    .required("Number of calories is required"),
  servings: Yup.number()
    .min(1, "Servings must be at least 1")
    .required("Number of servings is required"),
  cookingTime: Yup.number()
    .min(1, "Cooking time must be at least 1 minute")
    .required("Cooking time is required"),
  complexity: Yup.array().min(1, "Please select at least one complexity level"),
  style: Yup.array().min(1, "Please select at least one meal style"),
  category: Yup.array().min(1, "Please select at least one category"),
  dietary: Yup.array().min(1, "Please select at least one dietary restriction"),
  proteins: Yup.array(),
  preparation: Yup.array().min(
    1,
    "Please select at least one preparation method"
  ),
  image: Yup.mixed().required("Image is required"),
});

const RecipeSettings = () => {
  const accessToken = useSelector(selectAccessToken);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoryDropdown, setCategoryDropdown] = useState([]);
  const [mealStyleDropdown, setMealStyleDropdown] = useState([]);
  const [proteinTypeDropdown, setProteinTypeDropdown] = useState([]);
  const [dietaryDropdown, setDietaryDropdown] = useState([]);
  const [preparationDropdown, setPreparationDropdown] = useState([]);
  const [imageName, setImageName] = useState("");
  const [ingredientsData, setIngredientsData] = useState([]);
  const [recipeForm, setRecipeForm] = useState({
    name: "",
    description: "",
    optionalField: "",
    ingredients: [],
    preparationSteps: [""],
    // numberOfCalories: "",
    servings: "",
    complexity: "",
    cookingTime: "",
    preparationTime: "",
    style: "",
    category: [""],
    preparation: [""],
    dietary: [""],
    proteins: [""],
    comment: "",
    image: null,
    publishDate: "",
    isPublished: false,
  });

  const formik = useFormik({
    initialValues: recipeForm,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: () => {},
  });

  const location = useLocation();
  const recipieData = location.state?.data;

  console.log("recipiesdata", recipieData);

  const getIngredients = async () => {
    try {
        setIngredientsData([
          {
            ingredients: [
              {
                _id: "1",
                name: "Ingredient 1",
                specificity1: "s1",
                specificity2: "s2",
                specificity3: "s3",
                quantity: 1,
                measurement: "kg",
                calories: 100,
              },
            ],
          },
        ]);
    } catch (error) {
      console.log(error);

      if (error?.response?.status === 401) {
        unauthenticate();
      }
    }
  };

  const getCategories = async() => {
    try{
      setCategoryDropdown([
        {
          category: "Category 1",
        },
      ]);

    }catch(error){
      console.log(error);

    }
  }

  const getMealStyle = async() => {
    try{
      setMealStyleDropdown([
        {
          mealStyle: "Meal Style 1",
        },
      ]);

    }catch(error){
      console.log(error);

    }
  }

  const getProteinType = async() => {
    try{
      setProteinTypeDropdown([
        {
          proteinStyle: "Protein Type 1",
        },
      ]);

    }catch(error){
      console.log(error);

    }
  }

  const getDietary = async() => {
    try{
      setDietaryDropdown([
        {
          dietaryRestriction: "Dietary Restriction 1",
        },
      ]);

    }catch(error){
      console.log(error);

    }
  }

  const getPreparation = async() => {
    try{
      setPreparationDropdown([
        {
          preparationType: "Preparation Type 1",
        },
      ]);

    }catch(error){
      console.log(error);

    }
  }

  useEffect(() => {
    getIngredients();

    if (recipieData) {
      setRecipeForm({
        name: recipieData.name || "",
        description: recipieData.description || "",
        optionalField: recipieData.optionalField || "",
        comment: recipieData.comment || "",
        ingredients: recipieData.ingredients || [],
        preparationSteps: recipieData.preparationSteps || [""],
        // numberOfCalories: recipieData.numberOfCalories || "",
        servings: recipieData.servings || "",
        complexity: recipieData.complexity || "",
        cookingTime: recipieData.cookingTime || "",
        preparationTime: recipieData.preparationTime || "",
        style: recipieData.style || "",
        category: recipieData.category || "",
        proteins: recipieData.proteins || "",
        dietary: recipieData.dietary || "",
        preparation: recipieData.preparation || "",
        image: recipieData.image || null,
        publishDate: recipieData?.publishDate
          ? new Date(recipieData.publishDate).toISOString().split("T")[0]
          : "",
        isPublished: recipieData.isPublished,
      });
    }

    getCategories();
    getMealStyle();
    getProteinType();
    getDietary();
    getPreparation();
  }, []);

  const allIngredients = ingredientsData
    .map((ingredient) => ingredient.ingredients)
    .flatMap((ing) => ing);

  console.log("al ingre", allIngredients);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    formik.setFieldValue(name, value);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (
      file &&
      ["image/png", "image/svg+xml", "image/jpeg"].includes(file.type)
    ) {
      const formData = new FormData();
      setImageName(file.name);
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
          setRecipeForm((prev) => ({
            ...prev,
            image: imageUrl,
          }));
          formik.setFieldValue("image", file);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image.");
      }
    } else {
      toast.error("Only PNG, SVG, and JPG images are allowed.");
    }
  };

  const handleAddStep = () => {
    setRecipeForm((prevForm) => ({
      ...prevForm,
      preparationSteps: [...prevForm.preparationSteps, ""],
    }));
  };

  const handleRemoveStep = (index) => {
    setRecipeForm((prevForm) => ({
      ...prevForm,
      preparationSteps: prevForm.preparationSteps.filter((_, i) => i !== index),
    }));
  };

  const handleStepChange = (value, index) => {
    setRecipeForm((prevForm) => {
      const updatedSteps = [...prevForm.preparationSteps];
      updatedSteps[index] = value;
      return { ...prevForm, preparationSteps: updatedSteps };
    });
  };

  const handleSubmit = async () => {
    if (!recipeForm.name) {
      toast.error("Recipe name is required.");
      return;
    }
    if (!recipeForm.description) {
      toast.error("Recipe description is required.");
      return;
    }
    // if (!recipeForm.comment) {
    //   toast.error("Comment is required.");
    //   return;
    // }
    if (!recipeForm.image) {
      toast.error("Image is required.");
      return;
    }
    if (!recipeForm.ingredients.length) {
      toast.error("At least one ingredient is required.");
      return;
    }
    if (
      recipeForm.preparationSteps.length === 0 ||
      recipeForm.preparationSteps[0] === ""
    ) {
      toast.error("At least one preparation step is required.");
      return;
    }

    // if (!recipeForm.numberOfCalories) {
    //   toast.error("Number of calories is required.");
    //   return;
    // }
    if (!recipeForm.servings) {
      toast.error("Number of servings is required.");
      return;
    }
    if (!recipeForm.cookingTime) {
      toast.error("Cooking time is required.");
      return;
    }
    if (!recipeForm.preparationTime) {
      toast.error("Preparation time is required.");
      return;
    }
    if (recipeForm.complexity === "") {
      toast.error("Complexity is required.");
      return;
    }
    if (recipeForm.style.length === "") {
      toast.error("Style is required.");
      return;
    }
    if (recipeForm.category.length === 0 || recipeForm.category[0] === "") {
      toast.error("Category is required.");
      return;
    }
    // if (recipeForm.proteins.length === 0 || recipeForm.proteins[0] === "") {
    //   toast.error("Proteins is required.");
    //   return;
    // }
    // if (recipeForm.dietary.length === 0 || recipeForm.dietary[0] === "") {
    //   toast.error("Dietary restriction is required.");
    //   return;
    // }
    // if (
    //   recipeForm.preparation.length === 0 ||
    //   recipeForm.preparation[0] === ""
    // ) {
    //   toast.error("Preparation type is required.");
    //   return;
    // }

    const numOfIngredients = recipeForm.ingredients.length;

    setLoading(true);
    try {
      const endpoint = recipieData ? `${RECIPES}/${recipieData._id}` : RECIPES;
      const method = recipieData ? "put" : "post";

      const response = await httpRequest[method](
        endpoint,
        { ...recipeForm, numOfIngredients, numberOfCalories: calories },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Recipe saved successfully!");
        navigate("/recipes");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error saving recipe. Please try again."
      );
      if (error.response?.status === 401) {
        dispatch(clearUser());
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientSelect = (ingredient) => {
    console.log("ingredient", ingredient);
    const ingredientsData = ingredient?.map((ing) => ing.value);
    setRecipeForm((prev) => ({
      ...prev,
      ingredients: ingredientsData,
    }));
    formik.setFieldValue("ingredients", ingredientsData);
  };

  const handleSelectChange = (fieldName) => (selectedOptions) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setRecipeForm((prevState) => ({
      ...prevState,
      [fieldName]: selectedValues,
    }));
  };
  const complexityOptions = complexities.map((complexity) => ({
    value: complexity.complexityLevel,
    label: complexity.complexityLevel,
  }));
  const mealStyleOptions = mealStyleDropdown?.map((style) => ({
    value: style.mealStyle,
    label: style.mealStyle,
  }));
  const categoryOptions = categoryDropdown?.map((category) => ({
    value: category.category,
    label: category.category,
  }));
  const proteinTypeOptions = proteinTypeDropdown?.map((protein) => ({
    value: protein.proteinStyle,
    label: protein.proteinStyle,
  }));
  const dietaryRestrictionOptions = dietaryDropdown?.map((restriction) => ({
    value: restriction.dietaryRestriction,
    label: restriction.dietaryRestriction,
  }));
  const preparationMethodOptions = preparationDropdown?.map((option) => ({
    value: option.preparationType,
    label: option.preparationType,
  }));

  console.log("recipis form", recipeForm);

  const calories = recipeForm?.ingredients?.reduce((total, ing) => {
    return total + Number(ing?.calories);
  }, 0);

  return (
    <div className="p-4 rounded-lg overflow-hidden">
       <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-2">
        <button
          className="btn btn-primary"
          onClick={() => window.history.go(-1)}
        >
          Back
        </button>
      </div>
      <p className="pb-6 text-lg font-semibold">Recipe configuration</p>
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
        <p>Recipe name</p>
        <input
          type="text"
          name="name"
          value={recipeForm.name}
          placeholder="Recipe Name"
          className="w-full p-2 mt-2 border rounded-md"
          onChange={handleInputChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-600">{formik.errors.name}</p>
        )}

        <div className="mt-4">
          <p>Recipe description</p>
          <textarea
            name="description"
            value={recipeForm.description}
            placeholder="Recipe Description"
            className="w-full p-2 mt-2 border rounded-md"
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-600">{formik.errors.description}</p>
          )}
        </div>
        <div className="mt-4">
          <p>Optional field </p>
          <textarea
            name="optionalField"
            value={recipeForm.optionalField}
            placeholder="Optional Field"
            className="w-full p-2 mt-2 border rounded-md"
            onChange={handleInputChange}
          />
        </div>
        <div className="mt-4">
          <p>Comments</p>
          <textarea
            name="comment"
            value={recipeForm.comment}
            placeholder="Comments"
            className="w-full p-2 mt-2 border rounded-md"
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Image Upload Section */}
      <div className="mt-4">
        <p className="font-semibold pb-2 ">Upload Image (PNG, SVG, JPG)</p>
        <label className=" mt-2 btn btn-primary">
          {recipeForm.image ? "Change Image" : "Upload Image"}
          <input
            type="file"
            accept=".png, .svg, .jpg, .jpeg"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        {recipeForm.image && (
          <p className="mt-2 text-sm text-gray-600 flex items-center">
            Selected Image:{" "}
            <img
              src={recipeForm.image}
              style={{ height: "100px", width: "100px" }}
              alt="Selected"
            />
          </p>
        )}
      </div>

      {/* Ingredients Section */}
      <div className="mt-4">
        <p className="font-semibold">Ingredients</p>
        <div className="w-full p-4 mt-2 border rounded-md bg-white">
          <Select
            placeholder="Select ingredients"
            value={recipeForm.ingredients.map((ingredient) => ({
              value: ingredient,
              label: [
                ingredient.name,
                ingredient.specificity1,
                ingredient.specificity2,
                ingredient.specificity3,
                formatFraction(ingredient?.quantity)  + " " + ingredient.measurement,
              ]
                .filter(Boolean) // Filters out null, undefined, or empty values
                .join(", "),
            }))}
            isMulti
            name="ingredients"
            options={allIngredients
              .filter(
                (ingredient) =>
                  !recipeForm.ingredients.some(
                    (selected) => selected._id === ingredient._id
                  )
              )
              .map((ingredient) => ({
                value: ingredient,
                label: [
                  ingredient.name,
                  ingredient.specificity1,
                  ingredient.specificity2,
                  ingredient.specificity3,
                  formatFraction(ingredient?.quantity)  + " " + ingredient.measurement,
                ]
                  .filter(Boolean) 
                  .join(", "),
              }))}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleIngredientSelect}
            onBlur={() => {
              formik.setFieldTouched("ingredients", true);
            }}
          />

          {formik.touched.ingredients && formik.errors.ingredients && (
            <p className="text-red-600">{formik.errors.ingredients}</p>
          )}
        </div>
      </div>

      {/* Preparation Steps Section */}
      <div className="mt-4">
        <p className="font-semibold">Preparation Steps</p>

        <ul className="mt-2">
          {recipeForm.preparationSteps.map((step, index) => (
            <li key={index} className="flex items-center mt-2">
              <input
                type="text"
                value={step}
                placeholder={`Step ${index + 1}`}
                className="w-full p-2 border rounded-md"
                onChange={(e) => handleStepChange(e.target.value, index)}
              />
              {recipeForm.preparationSteps.length > 1 && (
                <button
                  onClick={() => handleRemoveStep(index)}
                  className="ml-2 px-2 py-1 btn btn-danger"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        <button onClick={handleAddStep} className="mt-2 btn btn-primary">
          Add Step
        </button>
      </div>

      {/* Other Fields */}
      <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6 mt-4">
        <div className="flex flex-wrap">
          <div className="flex-1 pr-2">
            <p>Number of calories</p>
            <input
              type="number"
              // name="numberOfCalories"
              value={calories}
              placeholder="Calories"
              className="w-full p-2 mt-2 border rounded-md"
              min="0"
              // onChange={handleInputChange}
            />
          </div>
          <div className="flex-1 pr-2">
            <p>Number of servings</p>
            <input
              type="number"
              name="servings"
              value={recipeForm.servings}
              placeholder="Servings"
              className="w-full p-2 mt-2 border rounded-md"
              min="0"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex-1 pr-2">
            <div className="flex-1">
              <p>Cooking Time</p>
              <input
                type="number"
                name="cookingTime"
                value={recipeForm.cookingTime}
                placeholder="Cooking Time (mins)"
                className="w-full p-2 border rounded-md mt-2"
                min="0"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex-1">
              <p>Preperation Time</p>
              <input
                type="number"
                name="preparationTime"
                value={recipeForm.preparationTime}
                placeholder="Preperation Time (mins)"
                className="w-full p-2 border rounded-md mt-2"
                min="0"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mt-4 gap-2">
          <div className="flex-1">
            <p className="mb-2">Complexity level</p>
            <Select
              menuPlacement="auto"
              name="complexity"
              options={complexityOptions}
              value={complexityOptions.find(
                (option) => option.value === recipeForm.complexity
              )} // Single value
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, complexity: e.value })
              }
              className="w-full"
              placeholder="Select complexity"
            />
          </div>

          <div className="flex-1">
            <p className="mb-2">Meal style</p>
            <Select
              menuPlacement="top"
              name="style"
              options={mealStyleOptions}
              value={mealStyleOptions.find(
                (option) => option.value === recipeForm.style
              )} // Single value
              onChange={(e) => setRecipeForm({ ...recipeForm, style: e.value })} // Pass the selected value
              className="w-full"
              placeholder="Select meal style"
            />
          </div>

          <div className="flex-1">
            <p className="mb-2">Category</p>
            <Select
              menuPlacement="top"
              isMulti
              name="category"
              options={categoryOptions}
              value={categoryOptions.filter((option) =>
                recipeForm.category.includes(option.value)
              )}
              onChange={handleSelectChange("category")}
              className="w-full"
              placeholder="Select category"
            />
          </div>
        </div>
        <div className="flex flex-wrap mt-4 gap-2 ">
          <div className="flex-1">
            <p className="mb-2">Proteins Type</p>
            <Select
              menuPlacement="auto"
              isMulti
              name="proteins"
              options={proteinTypeOptions}
              value={proteinTypeOptions.filter((option) =>
                recipeForm.proteins.includes(option.value)
              )}
              onChange={handleSelectChange("proteins")}
              className="w-full"
              placeholder="Select protein type"
            />
          </div>
          <div className="flex-1">
            <p className="mb-2">Dietary restriction</p>
            <Select
              menuPlacement="auto"
              isMulti
              name="dietary"
              options={dietaryRestrictionOptions}
              value={dietaryRestrictionOptions.filter((option) =>
                recipeForm.dietary.includes(option.value)
              )}
              onChange={handleSelectChange("dietary")}
              className="w-full"
              placeholder="Select dietary restriction"
            />
          </div>
          <div className="flex-1">
            <p className="mb-2">Preparation</p>
            <Select
              menuPlacement="auto"
              isMulti
              name="preparation"
              options={preparationMethodOptions}
              value={preparationMethodOptions.filter((option) =>
                recipeForm.preparation.includes(option.value)
              )}
              onChange={handleSelectChange("preparation")}
              className="w-full"
              placeholder="Select preparation"
            />
          </div>
        </div>
        <div className="pt-4">
          <label htmlFor="startDate" className="block font-semibold">
            Set publish status
          </label>
        </div>
        <div className="form-group flex items-center gap-6">
          {/* <div>
            <input
              type="date"
              id="publishDate"
              value={recipeForm.publishDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setRecipeForm({ ...recipeForm, publishDate: e.target.value })
              }
              className="w-full p-2 mt-2 border rounded-md"
            />
          </div> */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={recipeForm.isPublished}
                name="isWeeklyPlanPublished"
                className="mr-2"
                onChange={(e) =>
                  setRecipeForm({
                    ...recipeForm,
                    isPublished: e.target.checked,
                  })
                }
              />
              Publish
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className={`mt-4 px-4 py-2 btn btn-primary shadow-md ${
          loading ? "cursor-not-allowed opacity-70" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <LoadingIcon
            icon="tail-spin"
            color="white"
            className="w-8 h-6 ml-2"
          />
        ) : (
          "Save Recipe"
        )}
      </button>
    </div>
  );
};

export default RecipeSettings;
