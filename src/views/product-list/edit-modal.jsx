import React, { useState } from "react";
import { Modal, ModalBody } from "../../base-components";

const EditModal = ({ openModal, setOpenModal }) => {
  const [editModal, setEditModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const handleSave = (ingredient) => {
    console.log("Saving ingredient:", ingredient);
    // Perform your save logic here (e.g., API call)
    setEditModal(false); // Close modal after saving
  };

  const openEditModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setEditModal(true);
  };

  return (
    <Modal show={openModal} onHidden={() => setOpenModal(false)}>
      <ModalBody className="p-0">
        <div className="p-5">
          <div className="text-3xl mb-5 text-center">Edit Ingredient</div>
          <div className="form-group mt-3">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={selectedIngredient?.quantity || ""}
              //   onChange={handleChange}
            />
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <button
            type="button"
            // onClick={() => setEditModal(false)}
            className="btn btn-outline-secondary w-24 mr-1"
          >
            Cancel
          </button>
          <button
            type="button"
            // onClick={() => handleSave(selectedIngredient)}
            className="btn btn-primary w-24"
          >
            Save
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EditModal;
