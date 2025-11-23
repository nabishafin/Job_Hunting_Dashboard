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
import { useLocation, useNavigate } from "react-router-dom";
import httpRequest from "../../axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { MEAL_PLANS } from "../../constants";





const MealPlanDetail = () => {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeTabData, setActiveTabData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const mealPlanData = location.state.data;
  console.log("mealPlanData", mealPlanData);
  const accessToken = useSelector(selectAccessToken);


  const days = mealPlanData?.plans?.flatMap((plan) => plan);

  console.log("firstDay", days);

  useEffect(() => {
    if (days) {
      setActiveTabData(days[0]);
    }
  }, [mealPlanData]);

  const handleDelete = async(index) => {
    console.log(index, activeTabData);
    
    let updatedPlans = mealPlanData.plans?.filter((plan, i) => plan._id == activeTabData._id);

    updatedPlans[0].meals?.splice(index, 1);
  
    const updatedMealPlanData = {
      ...mealPlanData,
      plans: updatedPlans,
    };
    console.log(updatedMealPlanData);

    const url = `${MEAL_PLANS}/${updatedMealPlanData._id}`;
    console.log(url)

    const method = httpRequest.put

    try {
      const response = await method(url, updatedMealPlanData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200 || response.status === 201) {
        toast.success("Meal deleted successfully");
        setDeleteConfirmationModal(false);
        setDeleteIndex(null);
        
      } else {
        toast.error("Only super Admins can login");
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data.message || "An unknown error occurred."
      );
      console.error("Submit failed:", error?.response?.data);
    } 
  
  };
  

  return (
    <div>
      <div className="grid grid-cols-12 gap-6 mt-5">
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-2">
        <button
          className="btn btn-primary"
          onClick={() => window.history.go(-1)}
        >
          Back
        </button>
      </div>
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
      
          <div>
            <p className="text-lg font-medium">{mealPlanData?.title}</p>
          </div>
          <div>
            <p className="text-md font-normal">
              {mealPlanData?.startDate
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(mealPlanData.startDate))
                : "No date provided"}
            </p>
          </div>
        </div>
      </div>

      <TabGroup className="col-span-12 lg:col-span-4 mt-4">
        <div className="intro-y pr-1">
          <div className="box p-2">
            <TabList className="nav-pills overflow-x-auto whitespace-nowrap scrollbar-hidden">
              {days?.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveTab(index);
                    setActiveTabData(days[index]);
                  }}
                >
                  <Tab
                    className={`w-full py-2 ${
                      activeTab === index ? "active" : ""
                    }`}
                    tag="button"
                  >
                    {/* Adding a space or dash between days */}
                    {Array.isArray(tab.days) ? tab.days.join(" - ") : tab.days}
                  </Tab>
                </button>
              ))}
            </TabList>
          </div>
        </div>

        {activeTabData && (
          <div className="mt-5">
            <TabPanel>
              <div>
                {/* <div className="box p-5 rounded-md mb-4">
                  <div className="flex justify-between">
                    <h1 className=" font-semibold ">
                      Meals per day: {activeTabData?.mealsPerDay}
                    </h1>
                    <h1 className="font-semibold">
                      Snacks per day: {activeTabData?.snacksPerDay}
                    </h1>
                    <h1 className="font-semibold">
                      Add-on per day: {activeTabData?.addOnsPerDay}
                    </h1>
                  </div>
                </div> */}
                <div className="box p-5 rounded-md overflow-x-auto"> 
                  <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-5 mb-5">
                    <div className="flex items-center justify-between w-full">
                      <div className="font-medium text-base truncate">
                        Meals
                      </div>
                    </div>
                  </div>

                  <div className="overflow-auto lg:overflow-visible -mt-3">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="whitespace-nowrap !py-5">
                            Recipe image
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Meal title
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Recipe name
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Style
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Complexity
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Portion size
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Total time needed
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Number of ingredients
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Calories per serving
                          </th>
                          <th className="whitespace-nowrap text-center">
                            Actions
                          </th>
                         
                        </tr>
                      </thead>
                      <tbody>
                        {activeTabData?.meals?.map((mealPlan, i) => (
                          <tr key={i}>
                            <td className="w-40">
                              <div className="flex">
                                <div className="w-10 h-10 image-fit zoom-in ">
                                  <img
                                    tag="img"
                                    alt="Locker Room"
                                    className="rounded-full object-contain"
                                    src={mealPlan.recipes?.image}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="text-center">
                              {mealPlan.mealTitle || "N/A"}
                            </td>
                            <td className="text-center">
                              {mealPlan.recipes?.name || "N/A"}
                            </td>
                            <td className="text-center">
                              {mealPlan.recipes?.style || "N/A"}
                            </td>
                            <td className="text-center">
                              {mealPlan.recipes?.complexity || "N/A"}
                            </td>
                            <td className="text-center">
                              {mealPlan.portionSize || "N/A"}
                            </td>
                            <td className="text-center">
                              {mealPlan.recipes?.cookingTime } min
                            </td>
                            <td className="text-center">
                              {mealPlan.recipes?.numOfIngredients }
                            </td>
                            <td className="text-center">
                              {mealPlan.recipes?.numberOfCalories }
                            </td>
                            <td className="text-center">
                              <div className="flex justify-center items-center">
                                <div
                                  onClick={() =>
                                    navigate("/add-meal-plan", {
                                      state: { data: mealPlanData, index: i },
                                    })
                                  }
                                  className="flex items-center mr-3 cursor-pointer"
                                >
                                  <Lucide
                                    icon="CheckSquare"
                                    className="w-4 h-4 mr-1"
                                  />
                                </div>
                                {/* {activeTabData?.ingredients?.length > 1 && ( */}
                                <button
                                  className="flex items-center text-danger"
                                  onClick={() => {
                                    setDeleteConfirmationModal(true);
                                    setDeleteIndex(i);
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
              </div>
            </TabPanel>
          </div>
        )}
      </TabGroup>

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
              onClick={() => handleDelete(deleteIndex)}
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

export default MealPlanDetail;
