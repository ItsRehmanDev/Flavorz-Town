// Popup.jsx
import React from "react";

const Popup = ({
  popupName,
  popupEmail,
  popupAddress,
  setPopupName,
  setPopupEmail,
  setPopupAddress,
  handleConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Details</h2>
        <input
          type="text"
          value={popupName}
          onChange={(e) => setPopupName(e.target.value)}
          placeholder="Enter Name"
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          type="email"
          value={popupEmail}
          onChange={(e) => setPopupEmail(e.target.value)}
          placeholder="Enter Email"
          className="w-full border p-2 rounded mb-4"
          required
        />
        <input
          type="text"
          value={popupAddress}
          onChange={(e) => setPopupAddress(e.target.value)}
          placeholder="Enter Address"
          className="w-full border p-2 rounded mb-4"
          required
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleConfirm}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
