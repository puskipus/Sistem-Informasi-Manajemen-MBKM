import React from "react";

const ConfirmAlert = ({ title, message, onCancel, onConfirm }) => {
  return (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-300 rounded mr-2 hover:bg-gray-400" onClick={onCancel}>
            Tidak
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={onConfirm}>
            Ya
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAlert;
