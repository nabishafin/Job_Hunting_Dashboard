import React, { useState, useRef } from 'react';
import { Lucide } from "@/base-components";
import toast from "react-hot-toast";

export default function Profile() {
  const fileInputRef = useRef(null);
  
  // Sample data for display purposes
  const profileData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apartment 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    bio: "Passionate about technology and innovation. Always looking for new challenges and opportunities to grow.",
    joinDate: "January 2024",
  };

  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop");

  // Handle profile picture change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
      console.log("Profile picture updated:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: new Date().toISOString()
      });
      toast.success("Profile picture updated successfully!");
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handle confirmation button click
  const handleConfirmation = () => {
    console.log("Profile Data Confirmed:", {
      ...profileData,
      profileImage: profileImage.substring(0, 50) + "..." // Log truncated base64
    });
    console.log("Confirmation timestamp:", new Date().toISOString());
    toast.success("Profile information confirmed successfully!");
  };

  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="intro-y box px-5 pt-5 mt-5">
        {/* Profile Header Section */}
        <div className="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
          {/* Profile Image and Name */}
          <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-none image-fit relative">
              <img
                alt="Profile"
                className="rounded-full object-cover w-full h-full border-4 border-slate-200 dark:border-darkmode-400"
                src={profileImage}
              />
              <div 
                onClick={handleImageClick}
                className="absolute mb-1 mr-1 flex items-center justify-center bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer hover:bg-primary/80 transition-colors"
                title="Change profile picture"
              >
                <Lucide icon="Camera" className="w-4 h-4 text-white" />
              </div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="ml-5">
              <div className="w-full sm:w-40 truncate sm:whitespace-normal font-medium text-xl">
                {profileData.name}
              </div>
              <div className="text-slate-500 mt-1">Member since {profileData.joinDate}</div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
            <div className="font-medium text-center lg:text-left lg:mt-3 text-base">
              Contact Details
            </div>
            <div className="flex flex-col justify-center items-center lg:items-start mt-4 space-y-3">
              <div className="flex items-center w-full">
                <Lucide icon="Mail" className="w-4 h-4 mr-3 text-slate-500" />
                <span className="truncate">{profileData.email}</span>
              </div>
              <div className="flex items-center w-full">
                <Lucide icon="Phone" className="w-4 h-4 mr-3 text-slate-500" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center w-full">
                <Lucide icon="MapPin" className="w-4 h-4 mr-3 text-slate-500" />
                <span className="truncate">{profileData.city}, {profileData.state}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 lg:mt-0 flex-1 px-5 border-t lg:border-0 border-slate-200/60 dark:border-darkmode-400 pt-5 lg:pt-0">
            <div className="font-medium text-center lg:text-left lg:mt-3 text-base">
              Account Status
            </div>
            <div className="flex flex-col justify-center items-center lg:items-start mt-4 space-y-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-500">Status:</span>
                <span className="ml-3 px-2 py-1 bg-success text-white rounded text-xs font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-500">Verified:</span>
                <span className="ml-3 text-success font-medium">Yes</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-500">Profile:</span>
                <span className="ml-3 font-medium">100% Complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-medium text-base mb-4 flex items-center">
                <Lucide icon="User" className="w-5 h-5 mr-2" />
                Personal Information
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                  {profileData.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                  {profileData.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                  {profileData.phone}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Country</label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                  {profileData.country}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">State</label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                  {profileData.state}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Zip Code</label>
                <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                  {profileData.zipCode}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="font-medium text-base mb-4 flex items-center">
                <Lucide icon="MapPin" className="w-5 h-5 mr-2" />
                Address Information
              </h3>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-1">Street Address</label>
              <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                {profileData.address}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-slate-500 mb-1">City</label>
              <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                {profileData.city}
              </div>
            </div>

            {/* Bio Section */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <h3 className="font-medium text-base mb-4 flex items-center">
                <Lucide icon="FileText" className="w-5 h-5 mr-2" />
                About
              </h3>
            </div>

            <div className="col-span-1 md:col-span-2">
              <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 rounded-md">
                {profileData.bio}
              </div>
            </div>
          </div>

          {/* Confirmation Button */}
          <div className="flex justify-end mt-6 pt-5 border-t border-slate-200/60 dark:border-darkmode-400">
            <button
              onClick={handleConfirmation}
              className="btn btn-primary w-full sm:w-auto flex items-center justify-center"
            >
              <Lucide icon="CheckCircle" className="w-4 h-4 mr-2" />
              Confirm Profile Information
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
