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
import { useGetJobsWithStatusQuery, useGetAllJobsQuery } from "../../redux/features/job/jobApi";
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
    "Drenthe",
    "Flevoland",
    "Friesland",
    "Gelderland",
    "Groningen",
    "Limburg",
    "Noord-Brabant",
    "Noord-Holland",
    "Zuid-Holland",
    "Overijssel",
    "Utrecht",
    "Zeeland",
  ],
  Germany: [
    "Bavaria",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hesse",
    "Lower Saxony",
    "Mecklenburg-Vorpommern",
    "North Rhine-Westphalia",
    "Rhineland-Palatinate",
    "Saarland",
    "Saxony",
    "Saxony-Anhalt",
    "Schleswig-Holstein",
    "Thuringia",
  ],
  Belgium: [
    "Antwerp",
    "East Flanders",
    "Flemish Brabant",
    "Hainaut",
    "Liège",
    "Limburg",
    "Luxembourg",
    "Namur",
    "Walloon Brabant",
    "West Flanders",
    "Brussels",
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
  dateFilter: "",
  customDate: null,
  status: [],
};

// Admin Filters Component
const AdminFiltersJobs = ({ filters, setFilters, onApply, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(filters.customDate || null);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const handleSortChange = (e) => {
    setFilters({ ...filters, sortByPrice: e.target.value });
  };

  const handleDateChange = (dateName) => {
    if (dateName === "Custom Date") {
      setFilters({
        ...filters,
        dateFilter: "custom",
        customDate: selectedDate,
      });
    } else {
      setSelectedDate(null);
      setFilters({
        ...filters,
        dateFilter: dateName.toLowerCase().replace(" ", "-"),
        customDate: null,
      });
    }
  };

  const handleCountryToggle = (countryName, isChecked) => {
    let updatedCountries = [...selectedCountries];
    let updatedLocations = [...filters.locations];

    if (isChecked) {
      updatedCountries.push(countryName);
    } else {
      updatedCountries = updatedCountries.filter((c) => c !== countryName);
      // Remove the country's regions from selected locations
      const regionsToRemove = regionsByCountry[countryName] || [];
      updatedLocations = updatedLocations.filter(
        (loc) => !regionsToRemove.includes(loc)
      );
    }

    setSelectedCountries(updatedCountries);
    setFilters({ ...filters, locations: updatedLocations });
  };

  const handleRegionChange = (region, isChecked) => {
    const updated = isChecked
      ? [...filters.locations, region]
      : filters.locations.filter((loc) => loc !== region);
    setFilters({ ...filters, locations: updated });
  };

  const handleStatusChange = (statusValue, isChecked) => {
    const updated = isChecked
      ? [...filters.status, statusValue]
      : filters.status.filter((s) => s !== statusValue);
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
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <Lucide icon="X" className="w-5 h-5" />
          </button>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={resetFilters}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
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
              <label
                key={status.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.status.includes(status.value)}
                  onChange={(e) =>
                    handleStatusChange(status.value, e.target.checked)
                  }
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
              <label
                key={country.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country.name)}
                  onChange={(e) =>
                    handleCountryToggle(country.name, e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="text-[#92939E] text-md">{country.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Select Regions Based on Selected Countries */}
        {selectedCountries.map((country) => (
          <div key={country} className="w-full mt-4">
            <h3 className="font-semibold text-md mb-2">{country} Regions</h3>
            <div className="grid grid-cols-2 gap-2">
              {regionsByCountry[country].map((region, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.locations.includes(region)}
                    onChange={(e) =>
                      handleRegionChange(region, e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-[#92939E] text-md">{region}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

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
                      (item.name === "Custom Date" &&
                        filters.dateFilter === "custom") ||
                      filters.dateFilter ===
                      item.name.toLowerCase().replace(" ", "-")
                    }
                    onChange={() => handleDateChange(item.name)}
                    className="h-4 w-4"
                  />
                  <span className="text-[#92939E] text-md">{item.name}</span>
                </label>
                {item.name === "Custom Date" &&
                  filters.dateFilter === "custom" && (
                    <div className="mt-2 ml-6">
                      <input
                        type="date"
                        value={
                          selectedDate
                            ? selectedDate.toISOString().split("T")[0]
                            : ""
                        }
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
  const [loading, setLoading] = useState(false); // Changed to false for dummy data
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

  // Clean filters to remove empty values
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0;
      return v !== "" && v !== null;
    })
  );

  // Add pagination params
  const queryParams = {
    ...activeFilters,
    page: currentPage,
    limit: itemsPerPage,
  };

  const { data: jobsListResponse, isLoading: isJobsLoading } = useGetAllJobsQuery(queryParams);
  const jobsList = jobsListResponse?.data || [];
  const paginationMeta = jobsListResponse?.meta || { totalPage: 1, total: 0 };
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Dummy jobs data (25 jobs)
  const dummyJobs = [
    {
      _id: "1",
      jobNumber: "JOB-001",
      fromAddress: { address: "Amsterdam Central, Netherlands" },
      toAddress: { address: "Rotterdam Port, Netherlands" },
      pickupDate: "2024-10-15T10:00:00Z",
      createdAt: "2024-10-01T08:30:00Z",
      status: "pending",
    },
    {
      _id: "2",
      jobNumber: "JOB-002",
      fromAddress: { address: "Berlin Mitte, Germany" },
      toAddress: { address: "Munich Center, Germany" },
      pickupDate: "2024-10-16T14:00:00Z",
      createdAt: "2024-10-02T09:15:00Z",
      status: "in-progress",
    },
    {
      _id: "3",
      jobNumber: "JOB-003",
      fromAddress: { address: "Brussels Grand Place, Belgium" },
      toAddress: { address: "Antwerp Harbor, Belgium" },
      pickupDate: "2024-10-17T11:30:00Z",
      createdAt: "2024-10-03T10:45:00Z",
      status: "completed",
    },
    {
      _id: "4",
      jobNumber: "JOB-004",
      fromAddress: { address: "Utrecht Station, Netherlands" },
      toAddress: { address: "Eindhoven Tech, Netherlands" },
      pickupDate: "2024-10-18T09:00:00Z",
      createdAt: "2024-10-04T11:20:00Z",
      status: "pending",
    },
    {
      _id: "5",
      jobNumber: "JOB-005",
      fromAddress: { address: "Hamburg Port, Germany" },
      toAddress: { address: "Frankfurt Main, Germany" },
      pickupDate: "2024-10-19T15:30:00Z",
      createdAt: "2024-10-05T12:00:00Z",
      status: "canceled",
    },
    {
      _id: "6",
      jobNumber: "JOB-006",
      fromAddress: { address: "Ghent University, Belgium" },
      toAddress: { address: "Liège Station, Belgium" },
      pickupDate: "2024-10-20T08:45:00Z",
      createdAt: "2024-10-06T13:30:00Z",
      status: "in-progress",
    },
    {
      _id: "7",
      jobNumber: "JOB-007",
      fromAddress: { address: "The Hague Center, Netherlands" },
      toAddress: { address: "Groningen North, Netherlands" },
      pickupDate: "2024-10-21T10:15:00Z",
      createdAt: "2024-10-07T14:00:00Z",
      status: "completed",
    },
    {
      _id: "8",
      jobNumber: "JOB-008",
      fromAddress: { address: "Cologne Cathedral, Germany" },
      toAddress: { address: "Dortmund Plaza, Germany" },
      pickupDate: "2024-10-22T13:00:00Z",
      createdAt: "2024-10-08T15:15:00Z",
      status: "pending",
    },
    {
      _id: "9",
      jobNumber: "JOB-009",
      fromAddress: { address: "Bruges Market, Belgium" },
      toAddress: { address: "Namur Castle, Belgium" },
      pickupDate: "2024-10-23T11:00:00Z",
      createdAt: "2024-10-09T16:30:00Z",
      status: "in-progress",
    },
    {
      _id: "10",
      jobNumber: "JOB-010",
      fromAddress: { address: "Maastricht Square, Netherlands" },
      toAddress: { address: "Tilburg Center, Netherlands" },
      pickupDate: "2024-10-24T09:30:00Z",
      createdAt: "2024-10-10T08:00:00Z",
      status: "completed",
    },
    {
      _id: "11",
      jobNumber: "JOB-011",
      fromAddress: { address: "Stuttgart Auto, Germany" },
      toAddress: { address: "Nuremberg Old Town, Germany" },
      pickupDate: "2024-10-25T14:30:00Z",
      createdAt: "2024-10-11T09:30:00Z",
      status: "pending",
    },
    {
      _id: "12",
      jobNumber: "JOB-012",
      fromAddress: { address: "Leuven Library, Belgium" },
      toAddress: { address: "Mechelen Station, Belgium" },
      pickupDate: "2024-10-26T10:00:00Z",
      createdAt: "2024-10-12T10:15:00Z",
      status: "canceled",
    },
    {
      _id: "13",
      jobNumber: "JOB-013",
      fromAddress: { address: "Leiden University, Netherlands" },
      toAddress: { address: "Haarlem Center, Netherlands" },
      pickupDate: "2024-10-27T12:00:00Z",
      createdAt: "2024-10-13T11:00:00Z",
      status: "in-progress",
    },
    {
      _id: "14",
      jobNumber: "JOB-014",
      fromAddress: { address: "Dresden Palace, Germany" },
      toAddress: { address: "Leipzig Market, Germany" },
      pickupDate: "2024-10-28T08:00:00Z",
      createdAt: "2024-10-14T12:30:00Z",
      status: "completed",
    },
    {
      _id: "15",
      jobNumber: "JOB-015",
      fromAddress: { address: "Charleroi Airport, Belgium" },
      toAddress: { address: "Mons Center, Belgium" },
      pickupDate: "2024-10-29T15:00:00Z",
      createdAt: "2024-10-15T13:45:00Z",
      status: "pending",
    },
    {
      _id: "16",
      jobNumber: "JOB-016",
      fromAddress: { address: "Arnhem Bridge, Netherlands" },
      toAddress: { address: "Nijmegen University, Netherlands" },
      pickupDate: "2024-10-30T11:30:00Z",
      createdAt: "2024-10-16T14:20:00Z",
      status: "in-progress",
    },
    {
      _id: "17",
      jobNumber: "JOB-017",
      fromAddress: { address: "Bonn Government, Germany" },
      toAddress: { address: "Essen Industrial, Germany" },
      pickupDate: "2024-10-31T09:45:00Z",
      createdAt: "2024-10-17T15:00:00Z",
      status: "completed",
    },
    {
      _id: "18",
      jobNumber: "JOB-018",
      fromAddress: { address: "Hasselt Market, Belgium" },
      toAddress: { address: "Tournai Cathedral, Belgium" },
      pickupDate: "2024-11-01T13:30:00Z",
      createdAt: "2024-10-18T16:10:00Z",
      status: "pending",
    },
    {
      _id: "19",
      jobNumber: "JOB-019",
      fromAddress: { address: "Delft Tech, Netherlands" },
      toAddress: { address: "Gouda Cheese Market, Netherlands" },
      pickupDate: "2024-11-02T10:30:00Z",
      createdAt: "2024-10-19T08:45:00Z",
      status: "canceled",
    },
    {
      _id: "20",
      jobNumber: "JOB-020",
      fromAddress: { address: "Heidelberg Castle, Germany" },
      toAddress: { address: "Mannheim Port, Germany" },
      pickupDate: "2024-11-03T14:00:00Z",
      createdAt: "2024-10-20T09:30:00Z",
      status: "in-progress",
    },
    {
      _id: "21",
      jobNumber: "JOB-021",
      fromAddress: { address: "Ostend Beach, Belgium" },
      toAddress: { address: "Kortrijk Center, Belgium" },
      pickupDate: "2024-11-04T12:30:00Z",
      createdAt: "2024-10-21T10:00:00Z",
      status: "completed",
    },
    {
      _id: "22",
      jobNumber: "JOB-022",
      fromAddress: { address: "Zwolle Station, Netherlands" },
      toAddress: { address: "Apeldoorn Park, Netherlands" },
      pickupDate: "2024-11-05T09:00:00Z",
      createdAt: "2024-10-22T11:15:00Z",
      status: "pending",
    },
    {
      _id: "23",
      jobNumber: "JOB-023",
      fromAddress: { address: "Augsburg Town Hall, Germany" },
      toAddress: { address: "Regensburg Cathedral, Germany" },
      pickupDate: "2024-11-06T15:30:00Z",
      createdAt: "2024-10-23T12:00:00Z",
      status: "in-progress",
    },
    {
      _id: "24",
      jobNumber: "JOB-024",
      fromAddress: { address: "Aalst Carnival, Belgium" },
      toAddress: { address: "Dendermonde Center, Belgium" },
      pickupDate: "2024-11-07T11:00:00Z",
      createdAt: "2024-10-24T13:30:00Z",
      status: "completed",
    },
    {
      _id: "25",
      jobNumber: "JOB-025",
      fromAddress: { address: "Almere City, Netherlands" },
      toAddress: { address: "Lelystad Airport, Netherlands" },
      pickupDate: "2024-11-08T08:30:00Z",
      createdAt: "2024-10-25T14:45:00Z",
      status: "pending",
    },
  ];

  const dummyJobStats = {
    totalJobs: 25,
    pendingJobs: 7,
    inProgressJobs: 6,
    completedJobs: 8,
    canceledJobs: 4,
  };

  // Commented out API call - using dummy data
  // const getJobs = async (fieldName = "", type = "") => {
  //   try {
  //     const params = {
  //       searchQuery,
  //       fieldName,
  //       type,
  //       ...filters
  //     };
  //
  //     if (filters.dateFilter === 'custom' && filters.customDate) {
  //       params.customDate = filters.customDate.toISOString();
  //     }
  //
  //     const response = await submitData(
  //       "/admin/get-all-jobs",
  //       params,
  //       "POST"
  //     );
  //     setLoading(false);
  //     setJobsData(response?.data);
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    // getJobs();
    // Apply filters and search to dummy data
    let jobs = [...dummyJobs];

    // Search filter
    if (searchQuery) {
      jobs = jobs.filter(
        (job) =>
          job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.fromAddress?.address
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          job.toAddress?.address
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      jobs = jobs.filter((job) => filters.status.includes(job.status));
    }

    // Location filter (check if address contains any of the selected locations)
    if (filters.locations.length > 0) {
      jobs = jobs.filter((job) =>
        filters.locations.some(
          (location) =>
            job.fromAddress?.address.includes(location) ||
            job.toAddress?.address.includes(location)
        )
      );
    }

    // Sort by price (dummy implementation - using job number as proxy)
    if (filters.sortByPrice === "low-to-high") {
      jobs.sort((a, b) => a.jobNumber.localeCompare(b.jobNumber));
    } else if (filters.sortByPrice === "high-to-low") {
      jobs.sort((a, b) => b.jobNumber.localeCompare(a.jobNumber));
    }

    setFilteredJobs(jobs);
    setJobsData({ ...dummyJobStats, data: jobs });
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Initialize on mount and update when API data changes
  useEffect(() => {
    if (jobsList.length > 0) {
      setFilteredJobs(jobsList);
      setJobsData({ ...dummyJobStats, data: jobsList });
    }
  }, [jobsList]);

  // Pagination logic
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = jobsList; // API returns paginated data
  const totalPages = paginationMeta.totalPage;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Dummy delete function
  const handleDelete = (id) => {
    const updatedJobs = filteredJobs.filter((job) => job._id !== id);
    setFilteredJobs(updatedJobs);
    setJobsData({ ...jobsData, data: updatedJobs });
    toast.success("Job deleted successfully (dummy mode)");
    setDeleteConfirmationModal(false);
  };

  const PricingReport = [
    {
      icon: "BarChart",
      iconColor: "text-primary",
      value: apiData?.data?.allJobs || 0,
      label: "Total Jobs Posted",
    },
    {
      icon: "close",
      iconColor: "text-orange-500",
      value: apiData?.data?.allAcceptedJobs || 0, // Assuming 'in progress' maps to accepted or similar, user said 'allAcceptedJobs' in response
      label: "Accepted Jobs",
    },
    {
      icon: "close",
      iconColor: "text-yellow-500",
      value: apiData?.data?.allPendingJobs || 0,
      label: "Pending Jobs",
    },
    {
      icon: "close",
      iconColor: "text-green-500",
      value: apiData?.data?.allCompletedJobs || 0,
      label: "Completed Jobs",
    },
    {
      icon: "close",
      iconColor: "text-red-500",
      value: apiData?.data?.allCancelIedJobs || 0, // Note the typo in user's response 'allCancelIedJobs'
      label: "Canceled Jobs",
    },
  ];

  if (isLoading) {
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
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 mt-2">
          <div className="grid grid-cols-12 gap-6 mt-0">
            {PricingReport.map((item, index) => (
              <div
                key={index}
                className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y"
              >
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div
                      className={`text-3xl font-medium leading-8 mt-6 ${item.iconColor}`}
                    >
                      {item.value}
                    </div>
                    <div className="text-[12px] font-semibold uppercase text-slate-500 mt-1">
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2 justify-between">
          <div>
            <p className="text-xl font-bold uppercase">Manage Jobs</p>
          </div>
          <div className="flex gap-4">
            <div>
              <input
                type="text"
                placeholder="Search jobs"
                className="rounded-md border border-slate-200/60 px-4 py-2"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => setFiltersModal(true)}
                className="btn btn-primary shadow-md flex items-center"
              >
                <Lucide icon="Filter" className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
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
                  <th className="text-left whitespace-nowrap">Status</th>
                  <th className="text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((job, index) => (
                  <tr key={index} className="intro-x">
                    <td className="text-left whitespace-nowrap">
                      {job._id}
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {job.pickupAddress?.streetAddress || job.from}
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {job.deliveryAddress?.streetAddress || job.to}
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {job.pickupDateInfo?.date ? new Date(job.pickupDateInfo.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {job.deliveryDateInfo?.date ? new Date(job.deliveryDateInfo.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="text-left whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleDateString()}
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
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                        {job.status}
                      </div>
                    </td>
                    <td className="w-64">
                      <div className="flex justify-center items-center gap-2">
                        <div
                          onClick={() => navigate(`/job-details/${job._id}`)}
                          className="flex items-center cursor-pointer"
                        >
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
            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 px-4">
              <div className="text-sm text-slate-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, paginationMeta.total)} of{" "}
                {paginationMeta.total} entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="intro-y col-span-12 flex justify-center items-center">
            No jobs found
          </div>
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
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
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
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleDelete(id)}
              className="btn btn-danger w-24"
            >
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Jobs;
