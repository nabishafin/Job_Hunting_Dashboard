import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import useFetch from "../../hooks/useFetch";

import { CREATE_QUESTIONNAIRE } from "../../constants";

const TravelReflections = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [id, setId] = useState(null);
  const { submitData } = useCreateOrEdit();
  const { fetchData } = useFetch();
  const {userId } = useParams()

  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");

  const [q1Multi, setQ1Multi] = useState([]);

   const fetchAnswers = async () => {
      try {
        const response = await fetchData(
          `${CREATE_QUESTIONNAIRE}/TravelReflections/${userId}`
        );
        setId(response?.data?._id);
        const data = response?.data?.responses;
        if (data) {
          data?.forEach(({ questionId, answer }) => {
            if (questionId === "q1") setQ1(answer);
            if (questionId === "q2") setQ2(answer);
            if (questionId === "q3") setQ3(answer);
            if (questionId === "q4") setQ4(answer);
            if (questionId === "q5") setQ5(answer);
            if (questionId === "q6") setQ6(answer);
            if (questionId === "q1Multi") setQ1Multi(answer);
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

  useEffect(() => {
   

    fetchAnswers();
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked && q1Multi.length >= 3) {
      return; 
    }

    setQ1Multi((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleSubmit = async () => {
    const payload = {
      type: "TravelReflections",
      responses: [
        {
          questionId: "q1Multi",
          question:
            "If you had to describe your travel style using three words what would they be?",
          answer: q1Multi,
        },
        {
          questionId: "q1",
          question:
            "As someone who’s explored many corners of the globe,which destinations truly stand out to you? Share as many as come to mind?",
          answer: q1,
        },
       
        {
          questionId: "q2",
          question: "As someone who’s explored many corners of the globe,which destinations truly stand out to you? Share as many as come to mind?",
          answer: q2,
        },
        {
          questionId: "q3",
          question:
            "When you return home from traveling, what do you bring home with you? Is it something physical, like art or keepsakes, or more about how it changes your space or style?",
          answer: q3,
        },
        {
          questionId: "q4",
          question:
            "What's the story behind one of the things you brought home with you?",
          answer: q4,
        },
        {
          questionId: "q5",
          question:
            "Which places in the world feel like home to you - whether you've lived there, visited often, or even just passed through briefly?",
          answer: q5,
        },
        {
          questionId: "q6",
          question:
            "What is it about those places that makes you feel so connected to them?",
          answer: q6,
        },
      ],
    };

    console.log("payload", payload);

    if (id) {
      try {
        const response = await submitData(
          `${CREATE_QUESTIONNAIRE}/${id}`,
          payload,
          "PUT"
        );
        toast.success(
          response?.data?.message || "Questionnaire updated successfully!"
        );
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Something went wrong!");
      }
    } else {
      try {
        const response = await submitData(
          `${CREATE_QUESTIONNAIRE}/${userId}`,
          payload,
          "POST"
        );

        fetchAnswers()

        toast.success(
          response?.data?.message || "Questionnaire saved successfully!"
        );
        // navigate('/your-design-inspirations');
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    // <DashboardLayout>
      <div className="w-full m-auto mt-6">
        <h2 className="heading_main_dashboard">Personalized Style Profile</h2>
        <p className="text-xs text-center w-full md:w-[40%] m-auto">
          Your Travel Reflections
        </p>

        {step === 1 && (
          <>
            <div className="cards_patroness mt-10">
      <p>
        If you had to describe your travel style using three words, what would
        they be?
      </p>
      <div className="checkbox_questions">
        {[
          "Spontaneous",
          "Intentional",
          "Playful",
          "Organized",
          "Curious",
          "Efficient",
          "Adventurous",
          "Practical",
          "Easygoing",
          "Focused",
          "Energetic",
          "Determined",
          "Wanderlust",
          "Reliable",
          "Exploratory",
          "Steady",
          "Unpredictable",
          "Thoughtful",
          "Lively",
          "Driven",
          "Open-minded",
          "Grounded",
          "Carefree",
          "Purposeful",
          "Flexible",
          "Smart",
          "Lighthearted",
          "Clear-headed",
          "Joyful",
          "Capable",
        ].map((option) => (
          <label key={option} className="checkbox_label">
            <input
              type="checkbox"
              value={option}
              checked={q1Multi.includes(option)}
              onChange={handleCheckboxChange}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {q1Multi.length >= 3 && (
        <p style={{ color: "red" }}>You can select up to 3 options only.</p>
      )}
    </div>
            <div className="cards_patroness mt-4">
              <p>
                As someone who’s explored many corners of the globe,which
                destinations truly stand out to you? Share as many as come to
                mind?
              </p>
              <textarea
                className="input_field_normal"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                rows={6}
                placeholder="Write your answer here...."
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
             <div className="cards_patroness mt-4">
              <p>
                As someone who’s explored many corners of the globe,which
                destinations truly stand out to you? Share as many as come to
                mind?
              </p>
              <textarea
                className="input_field_normal"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                rows={6}
                placeholder="It’s the mix of it all - Tokyo’s fashion, the energy, the way tradition and the future exist side by side like it’s the most natural thing in the world…
"
              />
            </div>
            <div className="cards_patroness mt-4">
              <p>
              When you return home from traveling, what do you bring home with you? Is it something physical, like art or keepsakes, or more about how it changes your space or style?
              </p>
              <textarea
                className="input_field_normal"
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                rows={6}
                placeholder="A little of everything, but I always end up bringing back cookbooks from places that really left a mark on me…
"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="cards_patroness mt-10">
              <p>
              What's the story behind one of the things you brought home with you?
              </p>
              <textarea
                className="input_field_normal"
                value={q4}
                onChange={(e) => setQ4(e.target.value)}
                rows={6}
                placeholder="A version of this print hung on the wall of our favorite spot in Melbourne—every time I see it, it pulls me right back into all the adventures we lived there…
"
              />
            </div>
            <div className="cards_patroness mt-4">
              <p>
              Which places in the world feel like home to you - whether you've lived there, visited often, or even just passed through briefly?
              </p>
              <textarea
                className="input_field_normal"
                value={q5}
                onChange={(e) => setQ5(e.target.value)}
                rows={6}
                placeholder="Tokyo—it feels like stepping into another world, where everything is unfamiliar in the best way—surreal, electric, and endlessly exciting. I love it so much…"
              />
            </div>
            <div className="cards_patroness mt-4">
              <p>
              What is it about those places that makes you feel so connected to them?
              </p>
              <textarea
                className="input_field_normal"
                value={q6}
                onChange={(e) => setQ6(e.target.value)}
                rows={6}
                placeholder="The energy and the contradictions…"
                             />
            </div>
          </>
        )}

        <div className="flex justify-between mt-5 flex-col md:flex-row gap-6 mb-10">
          <div>
            {step !== 1 && (
              <button
                className="btn_big_white"
                onClick={() => setStep(step - 1)}
              >
                Back
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <button
                className="btn_black_big"
                onClick={() => setStep(step + 1)}
              >
                Next
              </button>
            ) : (
              <button className="btn_black_big" onClick={handleSubmit}>
                Submit
              </button>
            )}
            {/* <button className="btn_black_big" onClick={updateSteps}>{step === 3 ? "Submit" : "Next"}</button> */}
          </div>
        </div>
      </div>
    // </DashboardLayout>
  );
};

export default TravelReflections;
