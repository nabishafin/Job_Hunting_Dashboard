// src/pages/Payments.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Tabs } from "./Tabs";
import { Button } from "./Button";
import { Lucide, Modal, ModalBody } from "../../base-components";

const Payments = () => {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);

  const [activeTab, setActiveTab] = useState("current");
  const [pendingPayments, setPendingPayments] = useState([
    {
      courier: {
        _id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com"
      },
      jobCount: 15,
      totalEarning: 450.00,
      commissionPercentage: 10,
      commissionAmount: 45.00,
      finalPayout: 405.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "2",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.j@example.com"
      },
      jobCount: 22,
      totalEarning: 660.00,
      commissionPercentage: 10,
      commissionAmount: 66.00,
      finalPayout: 594.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "3",
        firstName: "Michael",
        lastName: "Brown",
        email: "m.brown@example.com"
      },
      jobCount: 18,
      totalEarning: 540.00,
      commissionPercentage: 10,
      commissionAmount: 54.00,
      finalPayout: 486.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "4",
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@example.com"
      },
      jobCount: 12,
      totalEarning: 360.00,
      commissionPercentage: 10,
      commissionAmount: 36.00,
      finalPayout: 324.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "5",
        firstName: "Daniel",
        lastName: "Moore",
        email: "daniel.m@example.com"
      },
      jobCount: 20,
      totalEarning: 600.00,
      commissionPercentage: 10,
      commissionAmount: 60.00,
      finalPayout: 540.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "6",
        firstName: "Jessica",
        lastName: "Lee",
        email: "jessica.lee@example.com"
      },
      jobCount: 16,
      totalEarning: 480.00,
      commissionPercentage: 10,
      commissionAmount: 48.00,
      finalPayout: 432.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "7",
        firstName: "Christopher",
        lastName: "White",
        email: "chris.w@example.com"
      },
      jobCount: 14,
      totalEarning: 420.00,
      commissionPercentage: 10,
      commissionAmount: 42.00,
      finalPayout: 378.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    },
    {
      courier: {
        _id: "8",
        firstName: "Amanda",
        lastName: "Harris",
        email: "amanda.h@example.com"
      },
      jobCount: 25,
      totalEarning: 750.00,
      commissionPercentage: 10,
      commissionAmount: 75.00,
      finalPayout: 675.00,
      dateRange: {
        from: new Date(2025, 9, 1),
        to: new Date(2025, 9, 7)
      }
    }
  ]);
  const [history, setHistory] = useState([
    {
      _id: "h1",
      courier: {
        firstName: "David",
        lastName: "Wilson",
        email: "david.w@example.com"
      },
      jobsPaid: ["job1", "job2", "job3", "job4", "job5", "job6", "job7", "job8", "job9", "job10"],
      totalEarning: 300.00,
      commissionPercentage: 10,
      commissionAmount: 30.00,
      finalPayout: 270.00,
      paidOn: new Date(2025, 8, 30),
      dateRange: {
        from: new Date(2025, 8, 24),
        to: new Date(2025, 8, 30)
      }
    },
    {
      _id: "h2",
      courier: {
        firstName: "Lisa",
        lastName: "Anderson",
        email: "lisa.a@example.com"
      },
      jobsPaid: ["job11", "job12", "job13", "job14", "job15", "job16", "job17", "job18", "job19", "job20", "job21", "job22", "job23", "job24", "job25"],
      totalEarning: 750.00,
      commissionPercentage: 10,
      commissionAmount: 75.00,
      finalPayout: 675.00,
      paidOn: new Date(2025, 8, 30),
      dateRange: {
        from: new Date(2025, 8, 24),
        to: new Date(2025, 8, 30)
      }
    },
    {
      _id: "h3",
      courier: {
        firstName: "Robert",
        lastName: "Martinez",
        email: "r.martinez@example.com"
      },
      jobsPaid: ["job26", "job27", "job28", "job29", "job30", "job31", "job32", "job33", "job34", "job35", "job36", "job37"],
      totalEarning: 480.00,
      commissionPercentage: 10,
      commissionAmount: 48.00,
      finalPayout: 432.00,
      paidOn: new Date(2025, 8, 23),
      dateRange: {
        from: new Date(2025, 8, 17),
        to: new Date(2025, 8, 23)
      }
    },
    {
      _id: "h4",
      courier: {
        firstName: "Jennifer",
        lastName: "Taylor",
        email: "jen.taylor@example.com"
      },
      jobsPaid: ["job38", "job39", "job40", "job41", "job42", "job43", "job44", "job45"],
      totalEarning: 320.00,
      commissionPercentage: 10,
      commissionAmount: 32.00,
      finalPayout: 288.00,
      paidOn: new Date(2025, 8, 23),
      dateRange: {
        from: new Date(2025, 8, 17),
        to: new Date(2025, 8, 23)
      }
    },
    {
      _id: "h5",
      courier: {
        firstName: "James",
        lastName: "Garcia",
        email: "james.g@example.com"
      },
      jobsPaid: ["job46", "job47", "job48", "job49", "job50", "job51", "job52", "job53", "job54", "job55", "job56", "job57", "job58", "job59", "job60", "job61", "job62", "job63", "job64", "job65"],
      totalEarning: 900.00,
      commissionPercentage: 10,
      commissionAmount: 90.00,
      finalPayout: 810.00,
      paidOn: new Date(2025, 8, 16),
      dateRange: {
        from: new Date(2025, 8, 10),
        to: new Date(2025, 8, 16)
      }
    },
    {
      _id: "h6",
      courier: {
        firstName: "Patricia",
        lastName: "Rodriguez",
        email: "patricia.r@example.com"
      },
      jobsPaid: ["job66", "job67", "job68", "job69", "job70", "job71", "job72", "job73", "job74", "job75", "job76", "job77", "job78"],
      totalEarning: 520.00,
      commissionPercentage: 10,
      commissionAmount: 52.00,
      finalPayout: 468.00,
      paidOn: new Date(2025, 8, 9),
      dateRange: {
        from: new Date(2025, 8, 3),
        to: new Date(2025, 8, 9)
      }
    },
    {
      _id: "h7",
      courier: {
        firstName: "Thomas",
        lastName: "Lewis",
        email: "thomas.l@example.com"
      },
      jobsPaid: ["job79", "job80", "job81", "job82", "job83", "job84", "job85", "job86", "job87", "job88"],
      totalEarning: 400.00,
      commissionPercentage: 10,
      commissionAmount: 40.00,
      finalPayout: 360.00,
      paidOn: new Date(2025, 8, 9),
      dateRange: {
        from: new Date(2025, 8, 3),
        to: new Date(2025, 8, 9)
      }
    },
    {
      _id: "h8",
      courier: {
        firstName: "Nancy",
        lastName: "Walker",
        email: "nancy.w@example.com"
      },
      jobsPaid: ["job89", "job90", "job91", "job92", "job93", "job94", "job95", "job96", "job97", "job98", "job99", "job100", "job101", "job102", "job103", "job104"],
      totalEarning: 640.00,
      commissionPercentage: 10,
      commissionAmount: 64.00,
      finalPayout: 576.00,
      paidOn: new Date(2025, 8, 2),
      dateRange: {
        from: new Date(2025, 7, 27),
        to: new Date(2025, 8, 2)
      }
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 5;

  const handleSendPayment = (courierId) => {
    // Dummy implementation - move payment from pending to history
    const paymentToSend = pendingPayments.find(p => p.courier._id === courierId);
    if (paymentToSend) {
      // Remove from pending
      setPendingPayments(prev => prev.filter(p => p.courier._id !== courierId));
      
      // Add to history
      const newHistoryEntry = {
        _id: `h${Date.now()}`,
        courier: paymentToSend.courier,
        jobsPaid: Array.from({ length: paymentToSend.jobCount }, (_, i) => `job${Date.now()}_${i}`),
        totalEarning: paymentToSend.totalEarning,
        commissionPercentage: paymentToSend.commissionPercentage,
        commissionAmount: paymentToSend.commissionAmount,
        finalPayout: paymentToSend.finalPayout,
        paidOn: new Date(),
        dateRange: paymentToSend.dateRange
      };
      setHistory(prev => [newHistoryEntry, ...prev]);
      
      toast.success("Payment sent successfully");
      setSelectedCourier(null);
    }
    setShowConfirmation(false);
  };

  const openConfirmation = (courierId) => {
    setSelectedCourier(courierId);
    setShowConfirmation(true);
  };

  const handleDelete = (id) => {
    // Dummy implementation - remove from history
    setHistory(prev => prev.filter(payment => payment._id !== id));
    toast.success("Payment entry deleted");
    setDeleteConfirmationModal(false);
    setSelectedCourier(null);
  };

  // Pagination calculations
  const indexOfLastPending = currentPage * itemsPerPage;
  const indexOfFirstPending = indexOfLastPending - itemsPerPage;
  const currentPendingPayments = pendingPayments.slice(indexOfFirstPending, indexOfLastPending);
  const totalPendingPages = Math.ceil(pendingPayments.length / itemsPerPage);

  const indexOfLastHistory = historyPage * itemsPerPage;
  const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
  const currentHistoryPayments = history.slice(indexOfFirstHistory, indexOfLastHistory);
  const totalHistoryPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleHistoryPageChange = (page) => {
    setHistoryPage(page);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Tabs active={activeTab} onTabChange={setActiveTab} tabs={["current", "history"]} />

      {loading && <p className="mt-4 text-center">Loading...</p>}

      {activeTab === "current" && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Pending Payments</h2>
          <div className="overflow-auto rounded-xl shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="p-3">Courier</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Job Count</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Commission</th>
                  <th className="p-3">Final</th>
                  <th className="p-3">From - To</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPendingPayments?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{item.courier?.firstName} {item.courier?.lastName}</td>
                    <td className="p-3">{item.courier?.email}</td>
                    <td className="p-3">{item.jobCount}</td>
                    <td className="p-3">${item.totalEarning?.toFixed(2) || ''}</td>
                    <td className="p-3">{item.commissionPercentage || 0}% (${item.commissionAmount?.toFixed(2) || 0})</td>
                    <td className="p-3">${item.finalPayout?.toFixed(2)}</td>
                    <td className="p-3">{new Date(item.dateRange.from).toLocaleDateString()} - {new Date(item.dateRange.to).toLocaleDateString()}</td>
                    <td className="p-3">
                       <Button onClick={() => openConfirmation(item.courier._id)}>Send Payment</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination for Pending Payments */}
          {totalPendingPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: totalPendingPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPendingPages}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <div className="overflow-auto rounded-xl shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase">
                <tr>
                  <th className="p-3">Courier</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Jobs</th>
                  <th className="p-3">Earnings</th>
                  <th className="p-3">Commission</th>
                  <th className="p-3">Final</th>
                  <th className="p-3">Paid On</th>
                  <th className="p-3">Paid From - To</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentHistoryPayments.map((payment, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3">{payment.courier?.firstName} {payment.courier?.lastName}</td>
                    <td className="p-3">{payment.courier?.email}</td>
                    <td className="p-3">{payment.jobsPaid?.length}</td>
                    <td className="p-3">${payment.totalEarning.toFixed(2)}</td>
                    <td className="p-3">{payment.commissionPercentage}% (${payment.commissionAmount.toFixed(2)})</td>
                    <td className="p-3">${payment.finalPayout.toFixed(2)}</td>
                    <td className="p-3">{new Date(payment.paidOn).toLocaleDateString()}</td>
                    <td className="p-3">{new Date(payment.dateRange.from).toLocaleDateString()} - {new Date(payment.dateRange.to).toLocaleDateString()}</td>
                    <td className="p-3">
                      <Button variant="destructive" onClick={() => {
                            setDeleteConfirmationModal(true);
                            setSelectedCourier(payment._id);
                          }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination for History */}
          {totalHistoryPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => handleHistoryPageChange(historyPage - 1)}
                disabled={historyPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handleHistoryPageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    historyPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handleHistoryPageChange(historyPage + 1)}
                disabled={historyPage === totalHistoryPages}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Payment</h3>
            <p className="mb-5">
              Are you sure you want to send this payment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleSendPayment(selectedCourier)}
              >
                Confirm Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* delete modal */}

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
                    onClick={() => handleDelete(selectedCourier)}
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

export default Payments;
