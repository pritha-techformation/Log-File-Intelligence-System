import React, { useState, useEffect } from "react";

const StatCard = ({ title, value, color }) => {


  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} opacity-80`} />
    </div>
  );
};

export default StatCard;
