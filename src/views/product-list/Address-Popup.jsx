import { useRef, useState } from "react";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";
import { MAPS_API_KEY } from "../../constants";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import toast from "react-hot-toast";

const libraries = ["places"];

const parseAddressComponents = (place, addressType, address) => {
  const components = place.address_components || [];
  const get = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || "-";

  // Both transport and contact use the same address structure
  return {
    streetAddress: place.formatted_address || "-",
    cityOrState: get("locality") || get("sublocality") || get("administrative_area_level_2"),
    country: get("country"),
    zipCode: get("postal_code"),
    description: address?.description || "",
    lat: place.geometry?.location?.lat() || 0,
    lng: place.geometry?.location?.lng() || 0,
  };
}


const AddressPopup = ({ fromAddress, toAddress, onClose, onSave, jobId, getJobDetails, addressType, pickupContact, deliveryContact }) => {
  // Use fromAddress and toAddress for both transport and contact types
  const [fromData, setFromData] = useState(fromAddress || {});
  const [toData, setToData] = useState(toAddress || {});
  const { submitData } = useCreateOrEdit()

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: MAPS_API_KEY,
    libraries,
  });

  const handleFromChange = () => {
    const place = fromRef.current?.getPlaces?.()[0];
    if (place) {
      setFromData(parseAddressComponents(place, addressType, fromData));
    }
  };

  const handleToChange = () => {
    const place = toRef.current?.getPlaces?.()[0];
    if (place) {
      setToData(parseAddressComponents(place, addressType, toData));
    }
  };

  const handleSave = () => {
    onSave(fromData, toData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h3 className="text-lg font-bold mb-4">Edit Address</h3>

        {isLoaded ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">From Address</label>
              <StandaloneSearchBox
                onLoad={(ref) => (fromRef.current = ref)}
                onPlacesChanged={handleFromChange}
              >
                <input
                  type="text"
                  value={fromData.streetAddress || ""}
                  onChange={(e) =>
                    setFromData({ ...fromData, streetAddress: e.target.value })
                  }
                  placeholder="Enter from address"
                  className="w-full p-2 border rounded"
                />
              </StandaloneSearchBox>
              {/* <div className="text-sm text-gray-600 mt-1">
                <p>City: {fromData.city}</p>
                <p>Region: {fromData.region}</p>
                <p>Country: {fromData.country}</p>
                <p>Postal Code: {fromData.postalCode}</p>
              </div> */}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">To Address</label>
              <StandaloneSearchBox
                onLoad={(ref) => (toRef.current = ref)}
                onPlacesChanged={handleToChange}
              >
                <input
                  type="text"
                  value={toData.streetAddress || ""}
                  onChange={(e) =>
                    setToData({ ...toData, streetAddress: e.target.value })
                  }
                  placeholder="Enter to address"
                  className="w-full p-2 border rounded"
                />
              </StandaloneSearchBox>
              {/* <div className="text-sm text-gray-600 mt-1">
                <p>City: {toData.city}</p>
                <p>Region: {toData.region}</p>
                <p>Country: {toData.country}</p>
                <p>Postal Code: {toData.postalCode}</p>
              </div> */}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <p>Loading Google Maps API...</p>
        )}
      </div>
    </div>
  );
};

export default AddressPopup;
