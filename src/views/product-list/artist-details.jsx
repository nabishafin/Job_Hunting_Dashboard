import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpRequest from "../../axios";
import { ARTISTS, REVIEWS } from "../../constants";

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch artist details
    const fetchArtist = async () => {
      try {
        const res = await httpRequest.get(`${ARTISTS}/${id}`);
        setArtist(res.data);
      } catch (error) {
        console.error("Error fetching artist:", error);
      }
    };

    // Fetch reviews for the artist
    const fetchReviews = async () => {
      try {
        const res = await httpRequest.get(`${REVIEWS}/review-by-artist/${id}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchArtist();
    fetchReviews();
  }, [id]);

  if (!artist)
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Artist Details Section */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">{artist.name}</h1>
        <p className="text-gray-600">{artist.country || "Unknown Country"}</p>
        <a
          href={artist.portfolioURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-semibold hover:underline mt-2"
        >
          View Portfolio
        </a>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-primary">About the Artist</h2>
        <p className="text-gray-700 mt-2">
          {artist.description || "No description available."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Domain:</p>
            <p className="text-gray-700 font-semibold">
              {artist.domain || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Medium:</p>
            <p className="text-gray-700 font-semibold">
              {artist.medium || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Style:</p>
            <p className="text-gray-700 font-semibold">
              {artist.style || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Artist Visibility Frequency:</p>
            <p className="text-gray-700 font-semibold">
            634
            </p>
          </div>
          <div>
            <p className="text-gray-500">Artist Engagement Rate (%):</p>
            <p className="text-gray-700 font-semibold">
              48
            </p>
          </div>
          <div>
            <p className="text-gray-500">Artist Skip Rate (%):</p>
            <p className="text-gray-700 font-semibold">
              32
            </p>
          </div>
          <div>
            <p className="text-gray-500">AI Match Success Rate (%):</p>
            <p className="text-gray-700 font-semibold">
              14
            </p>
          </div>
          <div>
            <p className="text-gray-500">AI Visibility Rank Over Time:</p>
            <p className="text-gray-700 font-semibold">
              #124 → #65 → #117
            </p>
          </div>

          <div>
            <p className="text-gray-500">Status:</p>
            <p
              className={`font-semibold ${
                artist.status === "Active" ? "text-green-500" : "text-red-500"
              }`}
            >
              {artist.status}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-primary mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-2 px-4 border">Username</th>
                  <th className="py-2 px-4 border">Review</th>
                  <th className="py-2 px-4 border">Stars</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id} className="text-center border">
                    <td className="py-2 px-4 border"> {review.userId?.name}</td>
                    <td className="py-2 px-4 border">{review.review}</td>
                    <td className="py-2 px-4 border">
                      {"⭐".repeat(review.stars)}
                    </td>
                    <td
                      className={`py-2 px-4 border ${
                        review.status === "approved"
                          ? "text-green-500"
                          : review.status === "rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {review.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistDetails;
