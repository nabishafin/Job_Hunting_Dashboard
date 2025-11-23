import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import { useLocation } from "react-router-dom";
import { Lucide } from "../../base-components";
import { formatFraction } from "../../utils/helper";

function Main() {
  const location = useLocation();
  const recipeData = location.state.data;
  console.log("recipeData", recipeData);

  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <button
          className="btn btn-primary"
          onClick={() => window.history.go(-1)}
        >
          Back
        </button>
      </div>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-4">
        <h2 className="text-lg font-medium mr-auto">
          Recipe Details - {recipeData?.name}
        </h2>
      </div>
      {/* BEGIN: Transaction Details */}
      <div className="intro-y grid grid-cols-11 gap-5 mt-5">
        <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
          <div className="box p-5 rounded-md ">
            <div className="flex items-center">
              <img
                className="rounded-md"
                src={recipeData?.image}
                alt="Recipe"
              />
            </div>
          </div>
          <div className="py-5">
            <h1 className="text-xl font-medium truncate">Others</h1>
          </div>
          <div className="box p-5 rounded-md ">
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Calories per serving</h1>
              <h1>{recipeData?.numberOfCalories || ""}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Servings</h1>
              <h1>{recipeData?.servings}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Preparation time</h1>
              <h1>{recipeData?.preparationTime} min</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Cooking time</h1>
              <h1>{recipeData?.cookingTime} min</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Total time needed</h1>
              <h1>
                {recipeData?.cookingTime + recipeData?.preparationTime} min
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Complexity</h1>
              <h1>
                {Array.isArray(recipeData?.complexity)
                  ? recipeData.complexity.join(", ")
                  : recipeData?.complexity || "N/A"}{" "}
              </h1>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Style</h1>
              <h1>
                {Array.isArray(recipeData?.style)
                  ? recipeData.style.join(", ")
                  : recipeData?.style || "N/A"}{" "}
              </h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Total download</h1>
              <h1>{recipeData?.numberOfDownloads || ""}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Total Likes</h1>
              <h1>{recipeData?.numberOfLikes || ""}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Number of ingredients</h1>
              <h1>{recipeData?.numOfIngredients || ""}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className=" py-2 truncate">Creation date</h1>
              <h1>{new Date(recipeData?.createdAt).toDateString() || ""}</h1>
            </div>
          </div>

          <div className="box p-5 rounded-md mt-5 ">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">Category</div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(recipeData?.category) ? (
                  recipeData.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm  text-white rounded-md"
                      style={{ backgroundColor: "#f79256" }} // Custom color
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">
                    {recipeData?.category || "N/A"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="box p-5 rounded-md mt-5 ">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">
                Proteins type
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(recipeData?.proteins) ? (
                  recipeData.proteins.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm  text-white rounded-md"
                      style={{ backgroundColor: "#f79256" }} // Custom color
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">
                    {recipeData?.proteins || "N/A"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="box p-5 rounded-md mt-5 ">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">
                Dietary restrictions
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(recipeData?.dietary) ? (
                  recipeData.dietary.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm  text-white rounded-md"
                      style={{ backgroundColor: "#f79256" }} // Custom color
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">
                    {recipeData?.dietary || "N/A"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="box p-5 rounded-md mt-5 ">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">
                Preparation type
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(recipeData?.preparation) ? (
                  recipeData.preparation.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm  text-white rounded-md"
                      style={{ backgroundColor: "#f79256" }} // Custom color
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">
                    {recipeData?.preparation || "N/A"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Category</h1>
              <h1>
                {Array.isArray(recipeData?.category)
                  ? recipeData.category.join(", ")
                  : recipeData?.category || "N/A"}{" "}
              </h1>
            </div>


            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Dietary</h1>
              <h1>
                {Array.isArray(recipeData?.dietary)
                  ? recipeData.dietary.join(", ") 
                  : recipeData?.dietary || "N/A"}{" "}
              </h1>
            </div>

            <div className="flex justify-between items-center">
              <h1 className="py-2 truncate">Preparation</h1>
              <h1>
                {Array.isArray(recipeData?.preparation)
                  ? recipeData.preparation.join(", ") 
                  : recipeData?.preparation || "N/A"}{" "}
              </h1>
            </div> */}
        </div>
        <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
          {/* <div className="box p-5 rounded-md">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">Ingredients</div>
            </div>
            <div className="overflow-auto lg:overflow-visible -mt-3">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap !py-5">Name</th>
                    <th className="whitespace-nowrap text-center">
                      Specificity 1
                    </th>
                    <th className="whitespace-nowrap text-center">Qty</th>
                    <th className="whitespace-nowrap text-center">
                      Measurements
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recipeData?.ingredients.map((ingredient, index) => (
                    <tr key={index}>
                      <td>{ingredient.name}</td>
                      <td className="text-center">{ingredient.specificity1}</td>
                      <td className="text-center">{ingredient.quantity}</td>
                      <td className="text-center">{ingredient.measurement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
          <div className="overflow-auto box p-5 rounded-md  ">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">Ingredients</div>
            </div>
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
                  <th className="whitespace-nowrap text-center">Quantity</th>
                  <th className="whitespace-nowrap text-center">
                    Measurements
                  </th>
                  <th className="whitespace-nowrap text-center">
                    Grocery list visiual
                  </th>
                  <th className="whitespace-nowrap text-center">Calories</th>
                  <th className="whitespace-nowrap text-center">Protein</th>
                  <th className="whitespace-nowrap text-center">Carbs</th>
                  <th className="whitespace-nowrap text-center">Fat</th>
                  <th className="whitespace-nowrap text-center">Sugar</th>
                  <th className="whitespace-nowrap text-center">Sodium</th>
                  {/* <th className="whitespace-nowrap text-center">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {recipeData?.ingredients?.map((ingredient, i) => (
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
                      {formatFraction(ingredient?.quantity)  || "-"}
                    </td>
                    <td className="text-center">
                      {ingredient.measurement || "-"}
                    </td>
                    <td className="text-center">
                      {[
                        ingredient.name,
                        ingredient.specificity1,
                        ingredient.specificity2,
                        ingredient.specificity3,
                        formatFraction(ingredient?.quantity) + " " + ingredient.measurement,
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
                      {ingredient?.proteins ? `${ingredient.proteins} g` : "-"}
                    </td>

                    <td
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {ingredient?.carbs ? `${ingredient.carbs} g` : "-"}
                    </td>

                    <td
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {ingredient?.fats ? `${ingredient.fats} g` : "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {ingredient?.sugar ? `${ingredient.sugar} g` : "-"}
                    </td>
                    <td
                      className="text-center"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {ingredient?.sodium ? `${ingredient.sodium} mg` : "-"}
                    </td>
                    {/* <td className="text-center">
                      <div className="flex justify-center items-center">
                        <div
                          onClick={() =>
                            navigate("/add-ingredients", {
                              state: {
                                data: activeTabData,
                                index: i,
                              },
                            })
                          }
                          className="flex items-center mr-3 cursor-pointer"
                        >
                          <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />
                        </div>
                        <button
                          className="flex items-center text-danger"
                          onClick={() => {
                            setDeleteConfirmationModal(true);
                            setRowIndex(i);
                          }}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="box p-5 rounded-md mt-5 ">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">Description</div>
            </div>
            <div className="flex items-center">
              <p>{recipeData?.description}</p>
            </div>
          </div>
          <div className="box p-5 rounded-md mt-5 mb-5">
            <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
              <div className="font-medium text-base truncate">
                Preparation steps
              </div>
            </div>
            <div>
              <ol className="list-decimal list-inside space-y-2">
                {recipeData?.preparationSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          {recipeData?.optionalField && (
            <div className="box p-5 rounded-md mt-5">
              <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                <div className="font-medium text-base truncate">
                  Optional fields
                </div>
              </div>
              <div className="flex items-center">
                <p>{recipeData.optionalField}</p>
              </div>
            </div>
          )}
          {recipeData?.comment && (
            <div className="box p-5 rounded-md mt-5">
              <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                <div className="font-medium text-base truncate">Comments</div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <p className="truncate" style={{ whiteSpace: "pre-wrap" }}>
                    {recipeData?.comment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* END: Transaction Details */}
    </>
  );
}

export default Main;
