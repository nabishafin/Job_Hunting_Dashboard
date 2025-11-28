import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const ProductPopup = ({ item, onClose, onSave, itemIndex, jobId, getJobDetails }) => {
  const basePrice = useRef(item.quantity > 0 ? item.price / item.quantity : 0);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ ...item, materialContent: item.materialContent || "" });
  const [isPriceManuallyEdited, setIsPriceManuallyEdited] = useState(false);

  useEffect(() => {
    setFormData({ ...item, materialContent: item.materialContent || "" });
    basePrice.current = item.quantity > 0 ? item.price / item.quantity : 0;
    setIsPriceManuallyEdited(false);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let newData = { ...prev, [name]: value };

      if (name === "quantity" && !isPriceManuallyEdited) {
        const quantity = parseInt(value);
        if (!isNaN(quantity) && quantity > 0) {
          newData.price = parseFloat((quantity * basePrice.current).toFixed(2));
        }
      }

      if (name === "price") {
        setIsPriceManuallyEdited(true);
      }

      if (name === "length" || name === "width" || name === "height") {
        const l = name === "length" ? value : prev.length || "";
        const w = name === "width" ? value : prev.width || "";
        const h = name === "height" ? value : prev.height || "";
        newData.dimensions = `${l}x${w}x${h}`;
      }

      return newData;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, img: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative max-h-[75vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Image Upload Section */}
          <div
            className="flex items-center gap-4 p-3 border rounded mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            {formData.img ? (
              <img src={formData.img} alt="Preview" className="h-16 w-16 object-cover rounded" />
            ) : (
              <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                No Img
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Product Image</p>
              <p className="text-xs text-gray-500">Click to upload new image</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Width</label>
            <input
              type="text"
              name="width"
              value={formData.width || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Length</label>
            <input
              type="text"
              name="length"
              value={formData.length || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity || 0}
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
              value={formData.price || 0}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Material</label>
            <select
              name="materialContent"
              value={formData.materialContent || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select Material</option>
              <option value="Glass">Glass</option>
              <option value="Wood">Wood</option>
              <option value="Metal">Metal</option>
              <option value="Plastic">Plastic</option>
              <option value="Ceramic">Ceramic</option>
            </select>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductPopup;
