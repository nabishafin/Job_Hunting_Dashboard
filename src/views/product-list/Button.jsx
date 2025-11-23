// src/components/ui/Button.jsx
import React from "react";

export const Button = ({ children, onClick, variant = "default", className = "", ...props }) => {
  const base = "px-4 py-2 rounded font-medium text-sm transition duration-150";
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
