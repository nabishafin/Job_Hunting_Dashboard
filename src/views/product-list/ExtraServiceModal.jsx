import React, { useState, useEffect } from "react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import toast from "react-hot-toast";

const ExtraServiceModal = ({ isOpen, onClose, jobId, index = null, initialValues = {}, onSuccess, getJobDetails, onSave }) => {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const { submitData } = useCreateOrEdit();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialValues.description || initialValues.price) {
      setDescription(initialValues.description || "");
      setPrice(initialValues.price || "");
    } else {
      setDescription("");
      setPrice("");
    }
  }, [initialValues]);

  const handleSubmit = () => {
    if (!description || !price) {
      alert("Both fields are required.");
      return;
    }

    // Determine if this is a floor update or a service option update based on context
    // Since the UI is generic, we'll assume it's adding/editing a service option for now
    // unless the description explicitly mentions "Floor".
    // However, to match the user's request and previous logic, let's pass a generic object
    // and let Job-Details.jsx handle the merging.

    // Actually, looking at Job-Details.jsx:
    // onSave={(newService) => {
    //    handleUpdate({
    //      extraService: {
    //        ...extraService,
    //        service: { ...extraService?.service, ...newService }
    //      }
    //    });
    // }}

    // So we should pass an object that fits into `extraService.service`.
    // But wait, the user wants to add "extra services".
    // The current structure `extraService.service` seems to be an object like { options: "test", carWithLift: 1 ... }
    // So we should pass { [description]: price } or similar?
    // The user's JSON shows: "service": { "carWithLift": 1, "noNeed": 1, "extraHelp": 2 }
    // So if description is "carWithLift" and price is 1, we pass { carWithLift: 1 }

    // But wait, the modal has "Description" and "Price".
    // If I enter "Extra Help" and "50", it should probably become { "Extra Help": 50 } in the service object.

    // Let's pass that.
    const newService = { [description]: parseFloat(price) };
    onSave(newService);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 className="font-bold uppercase mb-5">{index !== null ? "Edit Extra Service" : "Add Extra Service"}</h3>

        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />

        <div style={styles.actions} className="w-full">
          <button onClick={onClose} style={styles.button}>
            Cancel
          </button>
          <button disabled={loading} onClick={handleSubmit} className="custom_black_button_small">
            {index !== null ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtraServiceModal;

// --- Styles ---
const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 999,
  },
  modal: {
    background: "#fff", padding: 20, borderRadius: 8, width: 500,
    display: "flex", flexDirection: "column", gap: 10,
  },
  input: {
    padding: 8, fontSize: 16,
  },
  actions: {
    display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10,
  },
  button: {
    padding: "6px 12px", background: "#fff", border: "1px solid #ccc", borderRadius: 100,
  },
  buttonPrimary: {
    padding: "6px 12px", background: "#007bff", color: "#fff",
    border: "none", borderRadius: 4,
  },
};
