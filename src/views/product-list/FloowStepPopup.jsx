import React, { useState, useEffect } from "react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import toast from "react-hot-toast";

const floorsArray = [
  {
    id: 1,
    name: "Ground floor",
    desc: "Have the items ready for pickup",
    price: 0,
    image: '<svg class="IconDoor" version="1.1" x="0px" y="0px" viewBox="0 0 115.2 84"><g><path d="M31.4,39.7c1.1,0,2-0.9,2-2V4h48.2v33.7c0,1.1,0.9,2,2,2s2-0.9,2-2V2c0-1.1-0.9-2-2-2H31.4c-1.1,0-2,0.9-2,2v35.7 C29.4,38.8,30.3,39.7,31.4,39.7z"></path><path d="M102,80H85.7V47.7c0-1.1-0.9-2-2-2s-2,0.9-2,2V80H33.4V47.7c0-1.1-0.9-2-2-2s-2,0.9-2,2V80H13.2c-1.1,0-2,0.9-2,2 s0.9,2,2,2H102c1.1,0,2-0.9,2-2S103.1,80,102,80z"></path><path d="M68.3,39.8c-1.1,0-2,0.9-2,2s0.9,2,2,2h7.5c1.1,0,2-0.9,2-2s-0.9-2-2-2H68.3z"></path></g></svg>'
  },
  {
    id: 2,
    name: "Elevator available",
    desc: "Regardless which floor",
    price: 10,
    image: '<svg class="IconElevator" version="1.1" viewBox="0 0 31 31"><g><path d="..."/></g></svg>'
  },
  {
    id: 3,
    name: "Basement",
    desc: "Without elevator",
    price: 10,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">-1</span></div>'
  },
  {
    id: 4,
    name: "1st floor",
    desc: "Without elevator",
    price: 10,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">1</span></div>'
  },
  {
    id: 5,
    name: "2nd Floor",
    desc: "Without elevator",
    price: 20,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">2</span></div>'
  },
  {
    id: 6,
    name: "3rd Floor",
    desc: "Without elevator",
    price: 30,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">3</span></div>'
  },
  {
    id: 7,
    name: "4th Floor",
    desc: "Without elevator",
    price: 40,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">4</span></div>'
  },
  {
    id: 8,
    name: "5th Floor",
    desc: "Without elevator",
    price: 50,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">5</span></div>'
  },
  {
    id: 9,
    name: "6th Floor",
    desc: "Without elevator",
    price: 60,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">6</span></div>'
  },
  {
    id: 10,
    name: "7th Floor",
    desc: "Without elevator",
    price: 70,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">7</span></div>'
  },
  {
    id: 11,
    name: "8th Floor",
    desc: "Without elevator",
    price: 80,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">8</span></div>'
  },
  {
    id: 12,
    name: "9th Floor",
    desc: "Without elevator",
    price: 90,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">9</span></div>'
  },
  {
    id: 13,
    name: "10th Floor",
    desc: "Without elevator",
    price: 100,
    image: '<div class="input-el--tile--prefix"><span class="floor-indication custom">10</span></div>'
  }
];

const FloorSelectPopup = ({ open, onClose, initialValue, onSave, getJobDetails, jobId }) => {
  const [selectedFloor, setSelectedFloor] = useState(null);
  const { submitData } = useCreateOrEdit()

  useEffect(() => {
    if (initialValue?.floor) {
      const match = floorsArray.find((f) => f.name === initialValue?.floor);
      setSelectedFloor(match || null);
    }
  }, [initialValue]);

  if (!open) return null;

  const handleSave = async () => {
    if (!selectedFloor) return;

    console.log('Saving floor:', selectedFloor);
    const payload = {
      helpers: initialValue?.helpers, // 0, 1, or 2 couriers
      floor: selectedFloor?.name || initialValue?.floor, // e.g., 0 (Ground)
      elevator: initialValue?.elevator, // true or false
      help: initialValue?.help, // true or false
    }
    try {
      const res = await submitData(`/admin/update-job/${jobId}`, { extraServices: payload }, 'PUT')
      toast.success('Floor selection updated successfully');
      getJobDetails()
      onClose();
    } catch (error) {
      console.error("Failed to save floor selection", error);

    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Floor</h2>

        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
          {floorsArray.map((floor) => (
            <div
              key={floor.id}
              onClick={() => setSelectedFloor(floor)}
              className={`p-4 rounded-lg border text-center cursor-pointer flex flex-col items-center justify-center
                ${selectedFloor?.id === floor.id ? "bg-blue-500 text-white" : "bg-white"}
              `}
            >
              <div
                className="w-8 h-8"
                dangerouslySetInnerHTML={{ __html: floor.image }}
              />
              <div className="font-medium mt-2">{floor.name}</div>
              <div className="text-sm">{floor.desc}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            // disabled={!selectedFloor}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloorSelectPopup;
