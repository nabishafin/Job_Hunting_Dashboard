/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Lucide, Modal, ModalBody } from "@/base-components";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { useGetJobsWithStatusQuery, useGetAllJobsQuery, useDeleteJobMutation, useUpdateJobMutation } from "../../redux/features/job/jobApi";
import { LoadingIcon } from "../../base-components";
import { calculateAge } from "../../utils/helper";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";

// Filter constants
const Dates = [
  { id: 1, name: "View all days" },
  { id: 2, name: "Today" },
  { id: 3, name: "Tomorrow" },
  { id: 4, name: "Custom Date" },
];

const countries = [
  { id: 1, name: "Netherlands" },
  { id: 2, name: "Germany" },
  { id: 3, name: "Belgium" },
];

const regionsByCountry = {
  Netherlands: [
    "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg",
    "Noord-Brabant", "Noord-Holland", "Zuid-Holland", "Overijssel", "Utrecht", "Zeeland",
  ],
  Germany: [
    "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse",
    "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate",
    "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia",
  ],
  Belgium: [
    "Antwerp", "East Flanders", "Flemish Brabant", "Hainaut", "Liège", "Limburg",
    "Luxembourg", "Namur", "Walloon Brabant", "West Flanders", "Brussels",
  ],
};

const jobStatuses = [
  { id: 1, name: "Pending", value: "pending" },
  { id: 2, name: "Accepted Jobs", value: "accepted" },
  { id: 3, name: "Completed", value: "completed" },
  { id: 4, name: "Canceled", value: "canceled" },
];

const initialFilters = {
  sortByPrice: "",
  locations: [],
  countries: [],
  dateFilter: "",
  customDate: null,
  status: [],
};

// Admin Filters Component
const AdminFiltersJobs = ({ filters, setFilters, onApply, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(filters.customDate || null);
  const [selectedCountries, setSelectedCountries] = useState(filters.countries || []);

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortByPrice: e.target.value });
  };

  const handleDateChange = (dateName) => {
    if (dateName === "Custom Date") {
      setFilters({ ...filters, dateFilter: "custom", customDate: selectedDate });
    } else {
      setSelectedDate(null);
      setFilters({ ...filters, dateFilter: dateName.toLowerCase().replace(" ", "-"), customDate: null });
    }
  };

  const handleCountryToggle = (countryName, isChecked) => {
    let updatedCountries = [...selectedCountries];
    let updatedLocations = [...filters.locations];

    const countryLower = countryName.toLowerCase();

    if (isChecked) {
      updatedCountries.push(countryLower);
    } else {
      updatedCountries = updatedCountries.filter((c) => c !== countryLower);
      // Remove the country's regions from selected locations
      const regionsToRemove = regionsByCountry[countryName] || [];
      updatedLocations = updatedLocations.filter((loc) => !regionsToRemove.includes(loc));
    }

    setSelectedCountries(updatedCountries);
    setFilters({
      ...filters,
      locations: updatedLocations,
      countries: updatedCountries,
    });
  };

  const handleRegionChange = (region, isChecked) => {
    const updated = isChecked ? [...filters.locations, region] : filters.locations.filter((loc) => loc !== region);
    setFilters({ ...filters, locations: updated });
  };

  const handleStatusChange = (statusValue, isChecked) => {
    const updated = isChecked ? [...filters.status, statusValue] : filters.status.filter((s) => s !== statusValue);
    setFilters({ ...filters, status: updated });
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setSelectedCountries([]);
    setSelectedDate(null);
  };

  const applyFilters = () => {
    onApply();
    onClose();
  };

  return (
    <ModalBody className="p-0">
      <div className="max-h-[75vh] overflow-y-auto pr-2 p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Filter Jobs</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end mb-4">
          <button onClick={resetFilters} className="text-sm text-blue-500 hover:text-blue-700">
            Reset Filters
          </button>
        </div>

        {/* Sort By */}
        <div className="w-full mb-4">
          <h3 className="font-semibold text-md mb-2">Sort By</h3>
          <select
            className="mt-1 w-full border border-[#EEEEF0] py-2 px-3 rounded-lg"
            value={filters.sortByPrice}
            onChange={handleSortChange}
          >
            <option value="">Select</option>
            <option value="low-to-high">By Price (Low to High)</option>
            <option value="high-to-low">By Price (High to Low)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full mb-4">
          <h3 className="font-semibold text-md mb-2">By Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {jobStatuses.map((status) => (
              <label key={status.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status.value)}
                  onChange={(e) => handleStatusChange(status.value, e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-[#92939E] text-md">{status.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Select Countries */}
        <div className="w-full mt-4">
          <h3 className="font-semibold text-md mb-2">By Country</h3>
          <div className="grid grid-cols-2 gap-2">
            {countries.map((country) => (
              <label key={country.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country.name.toLowerCase())}
                  onChange={(e) => handleCountryToggle(country.name, e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-[#92939E] text-md">{country.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Select Regions Based on Selected Countries */}
        {selectedCountries.map((countryLower) => {
          const countryName = countries.find((c) => c.name.toLowerCase() === countryLower)?.name;
          if (!countryName) return null;
          return (
            <div key={countryLower} className="w-full mt-4">
              <h3 className="font-semibold text-md mb-2">{countryName} Regions</h3>
              <div className="grid grid-cols-2 gap-2">
                {regionsByCountry[countryName].map((region, idx) => (
                  <label key={idx} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(region)}
                      onChange={(e) => handleRegionChange(region, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="text-[#92939E] text-md">{region}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        {/* Date Filter */}
        <div className="w-full mt-4">
          <h3 className="font-semibold text-md mb-2">By Date</h3>
          <div className="grid grid-cols-2 gap-2">
            {Dates.map((item) => (
              <div key={item.id}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateFilter"
                    checked={
                      (item.name === "Custom Date" && filters.dateFilter === "custom") ||
                      filters.dateFilter === item.name.toLowerCase().replace(" ", "-")
                    }
                    onChange={() => handleDateChange(item.name)}
                    className="h-4 w-4"
                  />
                  <span className="text-[#92939E] text-md">{item.name}</span>
                </label>
                {item.name === "Custom Date" && filters.dateFilter === "custom" && (
                  <div className="mt-2 ml-6">
                    <input
                      type="date"
                      value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setSelectedDate(date);
                        setFilters({ ...filters, customDate: date });
                      }}
                      className="border border-[#EEEEF0] py-2 px-3 rounded-lg w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={applyFilters}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </ModalBody>
  );
};

// Main Jobs Component
function Jobs() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [filtersModal, setFiltersModal] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobsData, setJobsData] = useState({});
  const { data: apiData, isLoading } = useGetJobsWithStatusQuery();
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const { submitData } = useCreateOrEdit();
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editingPrices, setEditingPrices] = useState({}); // Track price edits

  // Delete mutation
  const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
  const [updateJob] = useUpdateJobMutation();

  const handleApprovalChange = async (jobId, currentStatus) => {
    try {
      await updateJob({
        id: jobId,
        updatedData: { adminApproved: !currentStatus }
      }).unwrap();
      toast.success("Job approval status updated");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update job status");
    }
  };

  // Handle price change (local state only)
  const handlePriceChange = (jobId, value) => {
    setEditingPrices(prev => ({
      ...prev,
      [jobId]: value
    }));
  };

  // Save price to API (on blur or Enter)
  const handlePriceSave = async (jobId, job) => {
    const newPrice = editingPrices[jobId];

    // If no edit or same value, don't update
    if (newPrice === undefined || parseFloat(newPrice) === parseFloat(job.courierPrice || 0)) {
      return;
    }

    // Prevent duplicate saves
    if (editingPrices[`${jobId}_saving`]) {
      return;
    }

    try {
      // Mark as saving
      setEditingPrices(prev => ({ ...prev, [`${jobId}_saving`]: true }));

      await updateJob({
        id: jobId,
        updatedData: { courierPrice: parseFloat(newPrice) || 0 }
      }).unwrap();

      toast.success("Price updated successfully");

      // Clear editing state and saving flag
      setEditingPrices(prev => {
        const newState = { ...prev };
        delete newState[jobId];
        delete newState[`${jobId}_saving`];
        return newState;
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || "Failed to update price");
      // Clear saving flag on error
      setEditingPrices(prev => {
        const newState = { ...prev };
        delete newState[`${jobId}_saving`];
        return newState;
      });
    }
  };

  // Clean filters to remove empty values and format date for API
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([key, v]) => {
      if (key === "dateFilter" || key === "customDate" || key === "countries" || key === "locations") return false;
      if (Array.isArray(v)) return v.length > 0;
      return v !== "" && v !== null;
    })
  );

  const formatDateForAPI = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    if (filters.dateFilter === "today") return formatDate(today);
    if (filters.dateFilter === "tomorrow") return formatDate(tomorrow);
    if (filters.dateFilter === "custom" && filters.customDate) return formatDate(new Date(filters.customDate));
    return null;
  };

  const dateParam = formatDateForAPI();

  // Send country as single string if one selected, or countries array if multiple
  const countryParam = filters.countries?.length === 1
    ? filters.countries[0].toLowerCase()
    : undefined;
  const countriesParam = filters.countries?.length > 1
    ? filters.countries.map((c) => c.toLowerCase())
    : undefined;

  const regionsParam =
    filters.locations?.length > 0 ? filters.locations.map((r) => r.toLowerCase()) : undefined;

  const queryParams = {
    ...activeFilters,
    page: currentPage,
    limit: itemsPerPage,
    ...(dateParam && { date: dateParam }),
    ...(countryParam && { country: countryParam }),
    ...(countriesParam && { countries: countriesParam }),
    ...(regionsParam && { regions: regionsParam }),
    ...(searchQuery && { search: searchQuery }),
  };

  const { data: jobsListResponse, isLoading: isJobsLoading } = useGetAllJobsQuery(queryParams);
  const jobsList = jobsListResponse?.data || [];
  const paginationMeta = jobsListResponse?.meta || { totalPage: 1, total: 0 };
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    if (jobsList.length > 0) setFilteredJobs(jobsList);
  }, [jobsList]);

  const currentItems = jobsList; // API already paginated
  const totalPages = paginationMeta.totalPage;
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = async (id) => {
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted successfully");
      setDeleteConfirmationModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete job");
    }
  };

  const PricingReport = [
    { icon: "BarChart", iconColor: "text-primary", value: apiData?.data?.allJobs || 0, label: "Total Jobs Posted" },
    { icon: "close", iconColor: "text-orange-500", value: apiData?.data?.allAcceptedJobs || 0, label: "Accepted Jobs" },
    { icon: "close", iconColor: "text-yellow-500", value: apiData?.data?.allPendingJobs || 0, label: "Pending Jobs" },
    { icon: "close", iconColor: "text-green-500", value: apiData?.data?.allCompletedJobs || 0, label: "Completed Jobs" },
    { icon: "close", iconColor: "text-red-500", value: apiData?.data?.allCancelIedJobs || 0, label: "Canceled Jobs" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon icon="tail-spin" className="" style={{ width: "100px", height: "100px" }} />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* Summary Cards */}
        <div className="col-span-12 mt-2">
          <div className="grid grid-cols-12 gap-6 mt-0">
            {PricingReport.map((item, index) => (
              <div key={index} className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div className={`text-3xl font-medium leading-8 mt-6 ${item.iconColor}`}>{item.value}</div>
                    <div className="text-[12px] font-semibold uppercase text-slate-500 mt-1">{item.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Table and Filters */}
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-xl font-bold uppercase">Manage Jobs</p>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by Job ID, From or To Address"
              className="rounded-md border border-slate-200/60 px-4 py-2"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => setFiltersModal(true)} className="btn btn-primary shadow-md flex items-center">
              <Lucide icon="Filter" className="w-4 h-4 mr-2" /> Filters
            </button>
          </div>
        </div>

        {filteredJobs?.length > 0 ? (
          <div className="intro-y col-span-12 overflow-auto">
            <table className="table table-report -mt-2">
              <thead className="bg-purple-200">
                <tr>
                  <th className="text-left whitespace-nowrap">Job Number</th>
                  <th className="text-left whitespace-nowrap">From Address</th>
                  <th className="text-left whitespace-nowrap">To Address</th>
                  <th className="text-left whitespace-nowrap">Pickup Date</th>
                  <th className="text-left whitespace-nowrap">Delivery Date</th>
                  <th className="text-left whitespace-nowrap">Created Date</th>
                  <th className="text-left whitespace-nowrap">Approval</th>
                  <th className="text-left whitespace-nowrap">Price</th>
                  <th className="text-left whitespace-nowrap">Status</th>
                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((job, index) => (
                  <tr key={index} className="intro-x">
                    <td className="text-left whitespace-nowrap">{job.jobId || job._id}</td>
                    <td className="text-left whitespace-nowrap">{job.pickupAddress?.streetAddress || job.from}</td>
                    <td className="text-left whitespace-nowrap">{job.deliveryAddress?.streetAddress || job.to}</td>
                    <td className="text-left whitespace-nowrap">
                      {job.pickupDateInfo?.date ? new Date(job.pickupDateInfo.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {job.deliveryDateInfo?.date ? new Date(job.deliveryDateInfo.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-left whitespace-nowrap">{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td className="text-left whitespace-nowrap">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={job.adminApproved || false}
                          onChange={() => handleApprovalChange(job._id, job.adminApproved)}
                        />
                      </div>
                    </td>
                    <td className="text-left whitespace-nowrap w-40">
                      <input
                        type="number"
                        className="form-control w-24"
                        value={editingPrices[job._id] !== undefined ? editingPrices[job._id] : (job.courierPrice || 0)}
                        onChange={(e) => handlePriceChange(job._id, e.target.value)}
                        onBlur={() => handlePriceSave(job._id, job)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handlePriceSave(job._id, job);
                            e.target.blur();
                          }
                        }}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="text-left whitespace-nowrap">
                      <div
                        className={`flex items-center whitespace-nowrap ${job.status === "accepted" || job.status === "completed"
                          ? "text-success"
                          : job.status === "pending"
                            ? "text-warning"
                            : "text-danger"
                          }`}
                      >
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" /> {job.status}
                      </div>
                    </td>
                    <td className="w-64">
                      <div className="flex justify-center items-center gap-2">
                        <div onClick={() => navigate(`/job-details/${job._id}`)} className="flex items-center cursor-pointer">
                          <Lucide icon="Eye" className="w-4 h-4 mr-1" />
                        </div>
                        <div
                          onClick={() => {
                            setDeleteConfirmationModal(true);
                            setId(job._id);
                          }}
                          className="flex items-center text-red-500 cursor-pointer"
                        >
                          <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 px-4">
              <div className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, paginationMeta.total)} of {paginationMeta.total} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="intro-y col-span-12 flex justify-center items-center">No jobs found</div>
        )}
      </div>

      {/* Filters Modal */}
      <Modal show={filtersModal} onHidden={() => setFiltersModal(false)}>
        <AdminFiltersJobs
          filters={filters}
          setFilters={setFilters}
          onApply={() => { }}
          onClose={() => setFiltersModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmationModal} onHidden={() => setDeleteConfirmationModal(false)}>
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete this record? This process cannot be undone.
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
              onClick={() => handleDelete(id)}
              className="btn btn-danger w-24"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Jobs;
