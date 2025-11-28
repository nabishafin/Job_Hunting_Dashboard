/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";

const AddProductAdmin = ({ close, jobId, getJobDetails }) => {
  const fileInputRef = useRef(null);
  const { submitData } = useCreateOrEdit();

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productName, setProductName] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [material, setMaterial] = useState("");
  const [image, setImage] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const materials = ["Glass", "Wood", "Metal", "Plastic", "Ceramic"];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await submitData(
        "/admin/get-items",
        { searchQuery: searchTerm },
        "POST"
      );

      const items = response?.data?.data?.users || [];
      setProductList(items);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProductSelect = (item = null) => {
    setSelectedProduct(item);

    if (item) {
      setProductName(item.name || "");
      setLength(item.length || "");
      setWidth(item.width || "");
      setHeight(item.height || "");
      setMaterial(item.material || "");
      setImage(item.image || "");
      setQty(1);
      setPrice(item.price || 0);
    } else {
      setProductName("");
      setLength("");
      setWidth("");
      setHeight("");
      setMaterial("");
      setImage("");
      setQty(1);
      setPrice(0);
    }
  };

  const handleSave = async () => {
    if (!productName || !length || !width || !height) {
      toast.error("All required fields must be filled");
      return;
    }

    const newProduct = {
      name: productName,
      length,
      width,
      height,
      material,
      image,
      qty,
      price,
    };

    console.log("Product to Save:", newProduct); // Replace with API call
    try {
      const response = await submitData(`/admin/update-job/add-items/${jobId}`, { item: newProduct }, "PUT");
      getJobDetails();
      toast.success("Product added successfully");
      close();
    }

    catch (error) {
      console.error("Error saving product:", error);
    };
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 z-20 flex items-center justify-center">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {!selectedProduct && (
        <div className="flex items-center border rounded-xl px-2 mb-4">
          <IoSearch size={20} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products"
            className="w-full px-2 py-2 outline-none"
          />
        </div>
      )}

      {selectedProduct ? (
        <div>
          <div className="mb-3">
            <label>Product Name *</label>
            <input
              className="form-control"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Dimensions (L x W x H) *</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Length"
                className="form-control"
              />
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
                className="form-control"
              />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-3">
            <label>Material</label>
            <div className="grid grid-cols-3 gap-2">
              {materials.map((mat) => (
                <div
                  key={mat}
                  onClick={() => setMaterial(mat)}
                  className={`text-center py-2 rounded cursor-pointer border ${material === mat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {mat}
                </div>
              ))}
            </div>
          </div>

          <div
            className="flex items-center gap-4 p-3 border rounded mb-3 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            {image ? (
              <img src={image} alt="Preview" className="h-14 w-14 object-cover rounded" />
            ) : (
              <div className="text-sm text-gray-500">Upload image</div>
            )}
          </div>

          <div className="mb-3">
            <label>Quantity *</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label>Price ($)</label>
            <input
              type="number"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="bg-gray-300 px-4 py-2 rounded w-full"
              onClick={() => setSelectedProduct(null)}
            >
              Back
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              onClick={handleSave}
            >
              Save Product
            </button>
          </div>
        </div>
      ) : (
        <div className="max-h-[60vh] overflow-y-auto space-y-2">
          {productList.length > 0 ? (
            productList.map((item) => (
              <div
                key={item._id}
                onClick={() => handleProductSelect(item)}
                className="flex items-center justify-between px-4 py-2 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  )}
                  <span className="capitalize">{item.name}</span>
                </div>
                <MdKeyboardArrowRight size={20} />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No products found</div>
          )}
          <div
            className="px-4 py-2 border rounded hover:bg-gray-50 cursor-pointer text-center text-blue-600"
            onClick={() => handleProductSelect(null)}
          >
            + Add Custom Product
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProductAdmin;
