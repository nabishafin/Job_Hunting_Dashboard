// src/components/ui/Tabs.jsx
import React from "react";

export const Tabs = ({ tabs, active, onTabChange }) => {
  return (
    <div className="flex border-b mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-300 ${
            active === tab
              ? "border-purple-600 text-purple-600"
              : "border-transparent text-gray-500 hover:text-purple-600"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};
