import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Lucide } from "../../base-components";
import httpRequest from "../../axios";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../../stores/userSlice";
import { TERMS_CONDITION } from "../../constants";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";

const TermsCondition = () => {
  const [content, setContent] = useState(`<h1>Terms and Conditions</h1>
<p><strong>Last Updated: October 8, 2025</strong></p>

<h2>1. Acceptance of Terms</h2>
<p>By accessing and using our courier delivery service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>

<h2>2. Service Description</h2>
<p>Our platform provides courier and delivery services connecting customers with independent courier partners. We facilitate the delivery of packages, documents, and other items within specified service areas.</p>

<h2>3. User Responsibilities</h2>
<ul>
  <li>You must provide accurate and complete information when placing orders</li>
  <li>You are responsible for the accuracy of delivery addresses</li>
  <li>You must ensure packages comply with our prohibited items list</li>
  <li>You agree to pay all applicable fees and charges</li>
</ul>

<h2>4. Prohibited Items</h2>
<p>The following items are strictly prohibited from delivery:</p>
<ul>
  <li>Illegal substances and contraband</li>
  <li>Hazardous materials and explosives</li>
  <li>Live animals (except as permitted by law)</li>
  <li>Perishable items without proper packaging</li>
  <li>Weapons and ammunition</li>
  <li>Items exceeding weight or size limitations</li>
</ul>

<h2>5. Pricing and Payment</h2>
<p>All prices are displayed in USD and are subject to change. Payment is required at the time of booking unless otherwise specified. We accept major credit cards, debit cards, and digital payment methods.</p>

<h2>6. Delivery Times</h2>
<p>Estimated delivery times are approximate and not guaranteed. We are not liable for delays caused by weather, traffic, or other circumstances beyond our control.</p>

<h2>7. Liability and Insurance</h2>
<p>We provide basic insurance coverage for all deliveries. Additional insurance can be purchased for high-value items. Our liability is limited to the declared value of the package, up to a maximum of $1,000 unless additional insurance is purchased.</p>

<h2>8. Cancellation and Refunds</h2>
<p>Cancellations made before courier pickup are eligible for a full refund. Cancellations after pickup may incur fees. Refunds are processed within 5-7 business days.</p>

<h2>9. Privacy and Data Protection</h2>
<p>We collect and process personal data in accordance with our Privacy Policy. By using our service, you consent to such processing and warrant that all data provided is accurate.</p>

<h2>10. Intellectual Property</h2>
<p>All content, trademarks, and data on this platform are the property of our company or our licensors. Unauthorized use is prohibited.</p>

<h2>11. Dispute Resolution</h2>
<p>Any disputes arising from these terms shall be resolved through binding arbitration in accordance with applicable laws.</p>

<h2>12. Changes to Terms</h2>
<p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>

<h2>13. Contact Information</h2>
<p>For questions about these Terms and Conditions, please contact us at:</p>
<p>Email: legal@example.com<br>
Phone: +1 (415) 555-0100<br>
Address: 500 Market St, San Francisco, CA 94105</p>`); 
  const [loading, setLoading] = useState(false); 
  const [pageLoading, setPageLoading] = useState(false); 
  const accessToken = useSelector(selectAccessToken);
  const handleUnAuthenticate = useUnauthenticate();

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  // Comment out API calls for dummy data
  // const getPrivacyPolicy = async () => {
  //   try {
  //     const response = await httpRequest.get(TERMS_CONDITION, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     if (response.status === 200 || response.status === 201) {
  //       setContent(response.data.content);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     if (error?.response?.status === 401) {
  //       handleUnAuthenticate();
  //     }
  //   }finally{
  //     setPageLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getPrivacyPolicy();
  // }, []);


  const savePrivacyPolicy = async () => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Terms and Conditions saved successfully");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIcon
          icon="tail-spin"
          className=""
          style={{ width: "100px", height: "100px" }} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="pb-6">
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => window.history.back()}
          aria-label="Go Back"
        >
          <Lucide icon="ArrowLeft" />
          Back
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Terms and Conditions</h1>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        style={{ height: "400px", marginBottom: "1rem" }}
      />

      <div className="pt-10 flex justify-end">
        <button className="btn btn-primary" 
        onClick={savePrivacyPolicy}
        > {
            loading ? (
            <LoadingIcon
              icon="tail-spin"
              color="white"
              // className="w-4 h-2 ml-2"
            />
          ) : 
            "Save"

        }</button>
      </div>
    </div>
  );
};

export default TermsCondition;
