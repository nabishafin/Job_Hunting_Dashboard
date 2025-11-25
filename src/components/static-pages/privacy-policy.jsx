import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Lucide, LoadingIcon } from "../../base-components";
import toast from "react-hot-toast";
import { usePostPrivacyPolicyMutation } from "../../redux/features/termsandprivacy/termsandprivacyApi";

const PrivacyPolicy = () => {
  const [content, setContent] = useState(`<h1>Privacy Policy</h1>
<p><strong>Effective Date: October 8, 2025</strong></p>

<h2>1. Introduction</h2>
<p>We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our courier delivery service.</p>

<h2>2. Information We Collect</h2>
<p>We collect the following types of information:</p>
<ul>
  <li><strong>Personal Information:</strong> Name, email address, phone number, delivery addresses</li>
  <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through third-party payment processors)</li>
  <li><strong>Location Data:</strong> GPS coordinates for delivery tracking and route optimization</li>
  <li><strong>Usage Data:</strong> App usage patterns, preferences, and interaction history</li>
  <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
</ul>

<h2>3. How We Use Your Information</h2>
<p>We use your information for the following purposes:</p>
<ul>
  <li>To process and fulfill delivery orders</li>
  <li>To communicate with you about your deliveries</li>
  <li>To improve our services and user experience</li>
  <li>To prevent fraud and ensure platform security</li>
  <li>To send promotional offers (with your consent)</li>
  <li>To comply with legal obligations</li>
</ul>

<h2>4. Data Sharing and Disclosure</h2>
<p>We may share your information with:</p>
<ul>
  <li><strong>Courier Partners:</strong> To facilitate deliveries</li>
  <li><strong>Payment Processors:</strong> To process transactions securely</li>
  <li><strong>Service Providers:</strong> For analytics, customer support, and marketing</li>
  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
</ul>
<p>We do not sell your personal information to third parties.</p>

<h2>5. Data Security</h2>
<p>We implement industry-standard security measures to protect your data, including:</p>
<ul>
  <li>Encryption of data in transit and at rest</li>
  <li>Regular security audits and vulnerability assessments</li>
  <li>Access controls and authentication mechanisms</li>
  <li>Secure data storage and backup procedures</li>
</ul>

<h2>6. Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li>Access your personal data</li>
  <li>Correct inaccurate information</li>
  <li>Request deletion of your data</li>
  <li>Opt-out of marketing communications</li>
  <li>Export your data in a portable format</li>
  <li>Withdraw consent for data processing</li>
</ul>

<h2>7. Cookies and Tracking</h2>
<p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage cookie preferences through your browser settings.</p>

<h2>8. Data Retention</h2>
<p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Inactive accounts may be deleted after 3 years of inactivity.</p>

<h2>9. Children's Privacy</h2>
<p>Our service is not intended for users under 18 years of age. We do not knowingly collect data from children.</p>

<h2>10. International Data Transfers</h2>
<p>Your data may be transferred to and processed in countries outside your jurisdiction. We ensure appropriate safeguards are in place for such transfers.</p>

<h2>11. Changes to This Policy</h2>
<p>We may update this privacy policy periodically. We will notify you of significant changes via email or app notification.</p>

<h2>12. Contact Us</h2>
<p>For privacy-related questions or requests, contact us at:</p>
<p>Email: privacy@example.com<br>
Phone: +1 (415) 555-0100<br>
Address: 500 Market St, San Francisco, CA 94105</p>`);

  const [postPrivacy, { isLoading }] = usePostPrivacyPolicyMutation();

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

  const savePrivacyPolicy = async () => {
    if (!content || content.trim() === '') {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      await postPrivacy({ description: content }).unwrap();
      toast.success("Privacy Policy saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to save Privacy Policy");
    }
  };

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

      <h1 className="text-2xl font-semibold mb-6">Privacy Policy</h1>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        style={{ height: "400px", marginBottom: "1rem" }}
      />

      <div className="pt-10 flex justify-end">
        <button
          className="btn btn-primary"
          onClick={savePrivacyPolicy}
          disabled={isLoading}
        >
          {isLoading ? (
            <LoadingIcon
              icon="tail-spin"
              color="white"
            />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
