import React from "react";
import { useNavigate } from "react-router-dom";

const WaitingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-10 max-w-md text-center border border-gray-200">

        <div className="text-5xl mb-4">⏳</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Account Pending Approval
        </h1>

        <p className="text-gray-600 mb-6">
          Your account has been created successfully.  
          Our admin team is reviewing your request.
        </p>

        <p className="text-gray-500 text-sm mb-6">
          You will be able to access the system once your account is approved.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default WaitingApproval;