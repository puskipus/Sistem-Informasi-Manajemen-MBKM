import React from "react";

export function InternalServerError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          500 Internal Server Error
        </h1>
        <p className="text-gray-600">
          Oops! Something went wrong on our server. Please try again later.
        </p>
      </div>
    </div>
  );
}
