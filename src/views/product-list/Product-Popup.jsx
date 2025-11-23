import { useState, useEffect, useRef } from "react";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import toast from "react-hot-toast";

const ProductPopup = ({ item, onClose, onSave , itemIndex , jobId , getJobDetails}) => {
  const basePrice = useRef(item.qty > 0 ? item.price / item.qty : 0);

  const [formData, setFormData] = useState({ ...item });
  const [isPriceManuallyEdited, setIsPriceManuallyEdited] = useState(false);
    const {submitData} = useCreateOrEdit()
  

  useEffect(() => {
    setFormData({ ...item });
    basePrice.current = item.qty > 0 ? item.price / item.qty : 0;
    setIsPriceManuallyEdited(false);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newData = { ...prev, [name]: value };

      if (name === "qty" && !isPriceManuallyEdited) {
        const qty = parseInt(value);
        if (!isNaN(qty) && qty > 0) {
          newData.price = parseFloat((qty * basePrice.current).toFixed(2));
        }
      }

      if (name === "price") {
        setIsPriceManuallyEdited(true);
      }

      return newData;
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('itemdan gelen itemIndex:', itemIndex, 'formData:', formData);
    // onSave(formData);
    try{
        const response = await submitData(`/admin/update-job/items/${jobId}`, {item:formData, index:itemIndex}, 'PUT');
        toast.success('Product updated successfully');
        getJobDetails();
        onClose();


    }catch(error){
        console.error('Error saving product:', error);

    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
        <h3 className="text-xl font-bold mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Width</label>
            <input
              type="text"
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Length</label>
            <input
              type="text"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Price (€)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              step="0.01"
              min="0"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductPopup;
