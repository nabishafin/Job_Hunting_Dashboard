import React, { useState, useEffect } from "react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import toast from "react-hot-toast";

const PickupTypeSelector = ({ pickupType, itemSource, onClose, onSave, getJobDetails, jobId }) => {
  const pickupTypes = ["private home", "store", "auction", "small move"];
  const sources = {
    "private home": ["family", "Marktplaats", "facebook", "2dehands", "others"],
    auction: ["Troostwijk", "Vavato", "Belga Veiling", "Onlineveilingmeester"],
  };
  const { submitData } = useCreateOrEdit();

  // Internal state to manage selection
  const [localPickupType, setLocalPickupType] = useState(pickupType || "");
  const [localSource, setLocalSource] = useState(itemSource || "");

  // Reset source when pickupType changes
  useEffect(() => {
    if (
      localPickupType !== "private home" &&
      localPickupType !== "auction"
    ) {
      setLocalSource("");
    }
  }, [localPickupType]);

  const handleSave = async (type, source) => {
    try {
      const response = await submitData(`/admin/update-job/${jobId}`, {
        pickupType: type,
        itemSource: source,
      }, 'PUT');
      toast.success('Pickup type updated successfully');
      getJobDetails();
      onClose();

    } catch (error) {
      console.error('Error saving pickup type:', error);
    }

  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4 text-center">Select Pickup Type</h2>

        {/* Pickup Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {pickupTypes.map((type) => (
            <div
              key={type}
              className={`border p-3 rounded cursor-pointer text-center ${localPickupType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
                }`}
              onClick={() => setLocalPickupType(type)}
            >
              {type}
            </div>
          ))}
        </div>

        {/* Source (if applicable) */}
        {(localPickupType === "private home" || localPickupType === "auction") && (
          <>
            <h3 className="text-lg font-semibold mb-2">Source</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
              {sources[localPickupType].map((source) => (
                <div
                  key={source}
                  className={`border p-3 rounded cursor-pointer text-center ${localSource === source
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                    }`}
                  onClick={() => setLocalSource(source)}
                >
                  {source}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white"
            onClick={() => handleSave(localPickupType, localSource)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PickupTypeSelector;
