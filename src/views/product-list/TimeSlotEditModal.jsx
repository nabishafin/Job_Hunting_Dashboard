import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";

const TimeSlotEditModal = ({
  open,
  onClose,
  onSave,
  type,
  timeSlot = {},
  jobId,
  getJobDetails,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [cost, setCost] = useState("");

  const { submitData } = useCreateOrEdit();

  useEffect(() => {
    if (type === "pickup" && timeSlot.start) {
      const [start, end] = timeSlot.start.split(" - ");
      setStartTime(start || "");
      setEndTime(end || "");
      setCost(timeSlot.cost || "");
    } else if (type === "delivery" && timeSlot.end) {
      const [start, end] = timeSlot.end.split(" - ");
      setStartTime(start || "");
      setEndTime(end || "");
      setCost(timeSlot.cost || "");
    } else {
      setStartTime("");
      setEndTime("");
      setCost("");
    }
  }, [timeSlot, type]);

  const handleSave = async () => {
    if (!startTime || !endTime || !cost) {
      toast.error("Please enter both times and cost.");
      return;
    }

    const name = `${startTime} - ${endTime}`;
    const payload = {
      timeSlot: {
        ...timeSlot,
        ...(type === "pickup"
          ? { start: name, cost }
          : { end: name, cost }),
      },
    };

    try {
      await submitData(`/admin/update-job/${jobId}`, payload, "PUT");
      toast.success("Time slot updated successfully");
      getJobDetails();
      onClose();
    } catch (error) {
      console.error("Error saving time slot:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {type === "pickup" ? "Edit Pickup Time" : "Edit Delivery Time"}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium">Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium">Cost:</label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            />
          </div> */}
        </div>

        <div className="flex justify-between mt-6 space-x-3">
          <button
            className="px-4 py-2 rounded-full border border-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="custom_black_button_small"
            onClick={handleSave}
            disabled={!startTime || !endTime || !cost}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotEditModal;
