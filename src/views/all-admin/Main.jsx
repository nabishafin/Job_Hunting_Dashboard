import {
    Lucide,
    Modal,
    ModalBody,
} from "@/base-components";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Static fake admin data
const fakeAdminsData = [
    {
        _id: "1",
        name: { firstName: "John", lastName: "Doe" },
        email: "john.doe@admin.com",
        role: "superAdmin",
        emailStatus: "verified",
        status: "active",
        createdAt: "2024-01-15T10:30:00Z",
    },
    {
        _id: "2",
        name: { firstName: "Jane", lastName: "Smith" },
        email: "jane.smith@admin.com",
        role: "admin",
        emailStatus: "verified",
        status: "active",
        createdAt: "2024-02-20T14:45:00Z",
    },
    {
        _id: "3",
        name: { firstName: "Michael", lastName: "Johnson" },
        email: "michael.j@admin.com",
        role: "superAdmin",
        emailStatus: "verified",
        status: "active",
        createdAt: "2024-03-10T09:15:00Z",
    },
    {
        _id: "4",
        name: { firstName: "Sarah", lastName: "Williams" },
        email: "sarah.w@admin.com",
        role: "admin",
        emailStatus: "verified",
        status: "active",
        createdAt: "2024-04-05T16:20:00Z",
    },
    {
        _id: "5",
        name: { firstName: "David", lastName: "Brown" },
        email: "david.brown@admin.com",
        role: "admin",
        emailStatus: "not_verified",
        status: "active",
        createdAt: "2024-05-12T11:30:00Z",
    },
    {
        _id: "6",
        name: { firstName: "Emily", lastName: "Davis" },
        email: "emily.davis@admin.com",
        role: "superAdmin",
        emailStatus: "verified",
        status: "blocked",
        createdAt: "2024-06-18T13:45:00Z",
    },
    {
        _id: "7",
        name: { firstName: "Robert", lastName: "Miller" },
        email: "robert.m@admin.com",
        role: "admin",
        emailStatus: "verified",
        status: "active",
        createdAt: "2024-07-22T10:00:00Z",
    },
    {
        _id: "8",
        name: { firstName: "Lisa", lastName: "Wilson" },
        email: "lisa.wilson@admin.com",
        role: "admin",
        emailStatus: "verified",
        status: "active",
        createdAt: "2024-08-30T15:30:00Z",
    },
];

function AllAdmin() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [adminsData, setAdminsData] = useState(fakeAdminsData);
    const navigate = useNavigate();
    const itemsPerPage = 10;

    // Filter admins based on search query
    const filteredAdmins = adminsData.filter((admin) => {
        const searchLower = searchQuery.toLowerCase();
        const fullName = `${admin.name.firstName} ${admin.name.lastName}`.toLowerCase();
        return fullName.includes(searchLower) || admin.email.toLowerCase().includes(searchLower);
    });

    // Pagination
    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentAdmins = filteredAdmins.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (id) => {
        setAdminsData(adminsData.filter((admin) => admin._id !== id));
        toast.success("Admin deleted successfully");
        setDeleteConfirmationModal(false);
    };

    // Calculate stats
    const totalAdmins = adminsData.length;
    const superAdmins = adminsData.filter((u) => u.role === "superAdmin").length;
    const regularAdmins = adminsData.filter((u) => u.role === "admin").length;
    const blockedAdmins = adminsData.filter((u) => u.status !== "active").length;

    const PricingReport = [
        {
            icon: "Shield",
            iconColor: "text-primary",
            value: totalAdmins,
            label: "Total Admins",
        },
        {
            icon: "ShieldCheck",
            iconColor: "text-green-500",
            value: superAdmins,
            label: "Super Admins",
        },
        {
            icon: "UserCheck",
            iconColor: "text-orange-500",
            value: regularAdmins,
            label: "Regular Admins",
        },
        {
            icon: "UserX",
            iconColor: "text-red-500",
            value: blockedAdmins,
            label: "Blocked Admins",
        },
    ];

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
                        <p className="text-xl font-bold uppercase">Manage All Admins</p>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Search admins"
                                className="rounded-md border border-slate-200/60 px-4 py-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <Link to={"/add-users"}>
                                <button className="btn btn-primary shadow-md mr-2">
                                    Add Admin
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {currentAdmins?.length > 0 ? (
                    <div className="intro-y col-span-12 overflow-auto">
                        <table className="table table-report -mt-2">
                            <thead className="bg-purple-200">
                                <tr>
                                    <th className="text-left whitespace-nowrap">Name</th>
                                    <th className="text-left whitespace-nowrap">Email</th>
                                    <th className="text-left whitespace-nowrap">Role</th>
                                    <th className="text-left whitespace-nowrap">Email Verified</th>
                                    <th className="text-left whitespace-nowrap">Created Date</th>
                                    <th className="text-left whitespace-nowrap">Status</th>
                                    <th className="text-center whitespace-nowrap">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAdmins?.map((user, index) => (
                                    <tr key={index} className="intro-x">
                                        <td className="text-left whitespace-nowrap">
                                            {user.name?.firstName} {user.name?.lastName}
                                        </td>
                                        <td className="text-left whitespace-nowrap">{user.email}</td>
                                        <td
                                            className={`text-left text-[12px] font-semibold ${user.role === "superAdmin" ? "text-purple-600" : "text-blue-600"
                                                }`}
                                        >
                                            {user.role === "superAdmin" ? "Super Admin" : "Admin"}
                                        </td>
                                        <td
                                            className={`text-left font-bold ${user.emailStatus === "verified" ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {user.emailStatus === "verified" ? "Verified" : "Not Verified"}
                                        </td>
                                        <td className="text-left">
                                            {user.createdAt
                                                ? new Intl.DateTimeFormat("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                }).format(new Date(user.createdAt))
                                                : "-"}
                                        </td>
                                        <td
                                            className={`text-left ${user.status === "active" ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {user.status === "active" ? "Active" : "Blocked"}
                                        </td>
                                        <td className="w-64">
                                            <div className="flex justify-center items-center gap-2">
                                                <div
                                                    onClick={() => navigate("/add-users", { state: { data: user } })}
                                                    className="flex items-center cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Lucide icon="Edit" className="w-4 h-4 mr-1" />
                                                </div>
                                                <div
                                                    onClick={() => {
                                                        setDeleteConfirmationModal(true);
                                                        setSelectedUser(user);
                                                    }}
                                                    className="flex items-center text-red-500 cursor-pointer"
                                                    title="Delete"
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
                        {filteredAdmins?.length > 0 && (
                            <div className="flex justify-between items-center mt-4 px-4">
                                <div className="text-sm text-slate-500">
                                    Showing {startIndex + 1} to{" "}
                                    {Math.min(startIndex + itemsPerPage, filteredAdmins.length)} of{" "}
                                    {filteredAdmins.length} entries
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
                        )}
                    </div>
                ) : (
                    <div className="intro-y col-span-12 flex justify-center items-center">
                        No admin users found.
                    </div>
                )}
            </div>

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
                            Do you really want to delete {selectedUser?.name?.firstName}{" "}
                            {selectedUser?.name?.lastName}? This process cannot be undone.
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
                            onClick={() => handleDelete(selectedUser._id)}
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

export default AllAdmin;
