import React from "react";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
        <p className="text-gray-600">Oops! You don't have permission to access this page.</p>
      </div>
    </div>
  );
}
