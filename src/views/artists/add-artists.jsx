import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LoadingIcon } from "../../base-components";
import { ARTISTS } from "../../constants";
import httpRequest from "../../axios";
import { selectAccessToken } from "../../stores/userSlice";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useUnauthenticate from "../../hooks/handle-unauthenticated";
import { Lucide } from "../../base-components";

const AddArtist = () => {
  const handleUnAuthenticate = useUnauthenticate();
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const artistData = location.state?.data;
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (artistData) {
      setIsEdit(true);
    }
  }, [artistData]);

  const initialValues = {
    name: artistData?.name || "",
    portfolioURL: artistData?.portfolioURL || "",
    country: artistData?.country || "",
    description: artistData?.description || "",
    domain: artistData?.domain || "",
    medium: artistData?.medium || "",
    style: artistData?.style || "",
    artist_id: artistData?.artist_id || "",
    metaphorical_themes: artistData?.metaphorical_themes || "",
    place_emotions: artistData?.place_emotions || "",
    place_mood: artistData?.place_mood || "",
    cultural_influence: artistData?.cultural_influence || "",
    best_self_themes: artistData?.best_self_themes || "",
    emotional_impact: artistData?.emotional_impact || "",
    enneagram_type: artistData?.enneagram_type || "",
    imagined_world: artistData?.imagined_world || "",
    creator_archetype: artistData?.creator_archetype || "",
    identify_aura: artistData?.identify_aura || "",
    emergent_self_themes: artistData?.emergent_self_themes || "",
    patroness_mode: artistData?.patroness_mode || "",
    artist_narrative_template_segments: artistData?.artist_narrative_template_segments || "",
    status: artistData?.status || "Active",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Artist name is required"),
    portfolioURL: Yup.string()
      .url("Please enter a valid URL"),
    country: Yup.string(),
    description: Yup.string(),
    domain: Yup.string(),
    medium: Yup.string(),
    style: Yup.string(),
    metaphorical_themes: Yup.string(),
    place_emotions: Yup.string(),
    place_mood: Yup.string(),
    cultural_influence: Yup.string(),
    best_self_themes: Yup.string(),
    emotional_impact: Yup.string(),
    enneagram_type: Yup.string(),
    imagined_world: Yup.string(),
    creator_archetype: Yup.string(),
    identify_aura: Yup.string(),
    emergent_self_themes: Yup.string(),
    patroness_mode: Yup.string(),
    artist_narrative_template_segments: Yup.string(),
    status: Yup.string().required("Status is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('values', values);
    try {
      const url = isEdit ? `${ARTISTS}/${artistData._id}` : ARTISTS;
      const method = isEdit ? httpRequest.put : httpRequest.post;

      const response = await method(url, values, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response?.data?.message || "Artist details saved successfully."
        );
        // navigate("/artists");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An unknown error occurred."
      );
      if (error?.response?.status === 401) {
        handleUnAuthenticate();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 flex-1 rounded-lg overflow-hidden">
      <div className="intro-y flex flex-col sm:flex-row items-center mt-2 mb-4 justify-between">
        <p className="text-lg font-semibold">
          {isEdit ? "Edit Artist" : "Add New Artist"}
        </p>
        <button
          className="text-gray-700 flex items-center gap-2"
          onClick={() => window.history.back(-1)}
          aria-label="Go Back"
        >
          <Lucide icon="ArrowLeft" />
          Back
        </button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="border-2 border-gray-200 bg-white dark:bg-transparent rounded-lg p-6">
              <div className="flex gap-4">
                <div className="w-full">
                  <p>Name*</p>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Portfolio URL</p>
                  <Field
                    type="text"
                    name="portfolioURL"
                    placeholder="Portfolio URL"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="portfolioURL"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Artist ID</p>
                  <Field
                    type="text"
                    name="artist_id"
                    placeholder="Artist ID"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="artist_id"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Country</p>
                  <Field
                    type="text"
                    name="country"
                    placeholder="Country"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Domain</p>
                  <Field
                    type="text"
                    name="domain"
                    placeholder="Domain"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="domain"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Medium</p>
                  <Field
                    type="text"
                    name="medium"
                    placeholder="Medium"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="medium"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Style</p>
                  <Field
                    type="text"
                    name="style"
                    placeholder="Style"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="style"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* New Fields Section 1 */}
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Metaphorical Themes</p>
                  <Field
                    type="text"
                    name="metaphorical_themes"
                    placeholder="Metaphorical Themes"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="metaphorical_themes"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Place Emotions</p>
                  <Field
                    type="text"
                    name="place_emotions"
                    placeholder="Place Emotions"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="place_emotions"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* New Fields Section 2 */}
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Place Mood</p>
                  <Field
                    type="text"
                    name="place_mood"
                    placeholder="Place Mood"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="place_mood"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Cultural Influence</p>
                  <Field
                    type="text"
                    name="cultural_influence"
                    placeholder="Cultural Influence"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="cultural_influence"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* New Fields Section 3 */}
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Best Self Themes</p>
                  <Field
                    type="text"
                    name="best_self_themes"
                    placeholder="Best Self Themes"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="best_self_themes"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Emotional Impact</p>
                  <Field
                    type="text"
                    name="emotional_impact"
                    placeholder="Emotional Impact"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="emotional_impact"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* New Fields Section 4 */}
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Enneagram Type</p>
                  <Field
                    type="text"
                    name="enneagram_type"
                    placeholder="Enneagram Type"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="enneagram_type"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Imagined World</p>
                  <Field
                    type="text"
                    name="imagined_world"
                    placeholder="Imagined World"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="imagined_world"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* New Fields Section 5 */}
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Creator Archetype</p>
                  <Field
                    type="text"
                    name="creator_archetype"
                    placeholder="Creator Archetype"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="creator_archetype"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Identify Aura</p>
                  <Field
                    type="text"
                    name="identify_aura"
                    placeholder="Identify Aura"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="identify_aura"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              {/* New Fields Section 6 */}
              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Emergent Self Themes</p>
                  <Field
                    type="text"
                    name="emergent_self_themes"
                    placeholder="Emergent Self Themes"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="emergent_self_themes"
                    component="div"
                    className="text-red-600"
                  />
                </div>
                <div className="w-full">
                  <p>Patroness Mode</p>
                  <Field
                    type="text"
                    name="patroness_mode"
                    placeholder="Patroness Mode"
                    className="w-full p-2 mt-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="patroness_mode"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p>Description</p>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Description"
                  className="w-full p-2 mt-2 border rounded-md"
                  rows="4"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Artist Narrative Template Segments</p>
                  <Field
                    as="textarea"
                    name="artist_narrative_template_segments"
                    placeholder="Artist Narrative Template Segments"
                    className="w-full p-2 mt-2 border rounded-md"
                    rows="4"
                  />
                  <ErrorMessage
                    name="artist_narrative_template_segments"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="w-full">
                  <p>Status*</p>
                  <Field
                    as="select"
                    name="status"
                    className="w-full p-2 mt-2 border rounded-md"
                  >
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary p-2 mt-6 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingIcon
                  icon="tail-spin"
                  color="white"
                  className="w-8 h-6 ml-2"
                />
              ) : (
                "Save Artist"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddArtist;