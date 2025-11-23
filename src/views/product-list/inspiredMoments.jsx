import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";
import { CREATE_QUESTIONNAIRE } from "../../constants";

const InspiredMoments = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [id, setId] = useState(null);
  const { submitData } = useCreateOrEdit();
  const { userId } = useParams();

  const [step1Checkbox, setStep1Checkbox] = useState([]);
  const [q2, setQ2] = useState("");

  // Step 2 (Part 2)
  const [step2Checkbox, setStep2Checkbox] = useState([]);
  const [step2Checkbox2, setStep2Checkbox2] = useState([]);

  // Step 3 (Part 3)
  const [q3, setQ3] = useState([]);
  // const [step3Checkbox2, setStep3Checkbox2] = useState([]);

  // // Step 4 (Part 4)
  // const [step4Checkbox, setStep4Checkbox] = useState([]);
  // const [step4Text, setStep4Text] = useState("");
  // const [step4Checkbox2, setStep4Checkbox2] = useState([]);
  const fetchAnswers = async () => {
    try {
      const data = {
        _id: "1",
        responses: [
          {
            questionId: "q1",
            answer: [
              "Bringing a creative vision to life and seeing it actually work",
            ],
          },
          {
            questionId: "q2",
            answer:
              "San Juan—the vibrant colors, the music, the food—everything feels festive and full of life, the kind of place that makes every moment feel like a celebration…",
          },
          {
            questionId: "q3",
            answer: [
              "I enjoy it when it happens naturally, but I don’t go out of my way to do it.",
            ],
          },
          {
            questionId: "q4",
            answer: ["Excited, like I’m about to discover something amazing"],
          },
          {
            questionId: "q5",
            answer:
              "What’s a small shift or change you’ve made in your life that’s brought more joy, beauty, or ease into your everyday routine? Was there a moment or experience that inspired you to make it?",
          },
        ],
      };
      setId(data._id);
      const responses = data.responses;
      if (responses) {
        responses.forEach(({ questionId, answer }) => {
          if (questionId === "q1") setStep1Checkbox(answer);
          if (questionId === "q2") setQ2(answer);
          if (questionId === "q3") setStep2Checkbox(answer);
          if (questionId === "q4") setStep2Checkbox2(answer);
          if (questionId === "q5") setQ3(answer);
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  // Options arrays for checkboxes
  const step1Options = [
    "Bringing a creative vision to life and seeing it actually work",
    "Exploring a new space, exhibit, or city and feeling creatively recharged",
    "Making something just for fun - designing, painting, styling, or experimenting",
    "Experiencing movement as creativity - where it’s dance, fashion, or flow",
    "Saying yes to spontaneous creative projects or unexpected sources of inspiration",
    "Finishing a design, project, or piece of art and feel that rush of pride",
    "Pushing my creative skills further and seeing real progress",
    "Leading a creative project or collaboration that makes an impact",
    "Being surrounded by inspiring artists, designers, and good energy",
    "Experiencing and artwork, space, or performance that completely shifts my perspective",
    "Shaping my space, wardrobe, or aesthetic so it feels like me",
    "Having a conversation about art, design, or creativity that shifts my perspective",
  ];

  const step2Options = [
    "It sparked a new sense of boldness in you, making every challenge feel like an exciting possibility.",
    "It taught you to find wonder in the everyday, making even the smallest moments feel extraordinary.",
    "It brought a crystal-clear sense of purpose that shapes everything you do.",
    "It shifted your perspective, helping you see beauty and opportunity where you hadn’t noticed it before.",
    "It deepened your connection with the people and places that feel like home to your spirit.",
  ];

  const step2Options1 = [
    "I enjoy it when it happens naturally, but I don’t go out of my way to do it.",
    "I like incorporating small touches, but it’s not a huge focus for me.",
    "I bring in flavors or habits I love when they really inspire me.",
    "I actively look for ways to recreate the tastes and experiences I’ve enjoyed.",
    "I love it - it’s one of my favorite ways to bring travel and culture into my everyday life",
  ];

  const step2Options2 = [
    "Excited, like I’m about to discover something amazing",
    "Excited to push myself and see what I can do",
    "Like I’m growing into an even better version of myself",
    "Totally in the moment and ready to dive in",
    "Motivated to turn inspiration into something real",
    "Free - like there are no limits to what I can explore",
    "Playful - I love experimenting and seeing where it leads",
    "Energized by the challenge of figuring it out",
    "Focused - I love learning something new and getting good at it",
    "Inspired to share the experience with others",
    "Like life just a little more interesting",
    "Like I’m adding another layer to my creativity or personal style",
  ];

  const step4Options1 = [
    "Stumbling upon something rare and special that feels uniquely mine",
    "Being surrounded by a setting that feels vast, captivating, and filled with energy",
    "Feeling a rush of energy and confidence that makes me want to conquer anything",
    "Connecting deeply with someone who opens my mind to new perspectives and fresh ideas",
  ];

  const step4Options2 = [
    "The thrill of discovering something new and unexplored",
    "Moments of deep calm that let me fully unwind",
    "A surge of energy that fuels my drive to go after big dreams",
    "The freedom to follow my impulses and be playfully spontaneous",
    "A sense of connection to nature that keeps me grounded and refreshed",
    "The confidence to face new challenges head-on, feeling unstoppable",
    "Creative freedom to express myself in ways that feel truly authentic",
    "Genuine connections that remind me of what truly matters",
    "Moments of growth that push me to become a better version of myself",
    "Pure joy in savoring life’s simple, beautiful moments",
  ];

  // Generic checkbox change handler (with optional limit)
  const handleCheckboxChange = (event, state, setState, limit = null) => {
    const { value, checked } = event.target;
    if (checked) {
      if (limit && state.length >= limit) return; // enforce limit if provided
      setState([...state, value]);
    } else {
      setState(state.filter((item) => item !== value));
    }
  };

  const updateSteps = async () => {
    if (step === 3) {
      const payload = {
        type: "InspireMoments",
        responses: [
          {
            questionId: "q1",
            question:
              "Which of these moments make you feel the most alive and in your element? (Multiple choice)",
            answer: step1Checkbox,
          },
          {
            questionId: "q2",
            question:
              "Have you been somewhere that made you fall in love with the everyday things—like the colors, the vibe, or the traditions? What would you tell someone about that place that made it so memorable for you?",
            answer: q2,
          },
          {
            questionId: "q3",
            question:
              "I love bringing flavors, recipes, or dining habits from places I’ve visited into my own kitchen. (1-5 Rating)",
            answer: step2Checkbox,
          },
          {
            questionId: "q4",
            question:
              "When something inspires me to try something new, it makes",
            answer: step2Checkbox2,
          },
          {
            questionId: "q5",
            question:
              "What’s a small shift or change you’ve made in your life that’",
            answer: q3,
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
          fetchAnswers();
          toast.success(
            response?.data?.message || "Questionnaire saved successfully!"
          );
        } catch (error) {
          console.error("Error submitting data:", error);
          toast.error("Something went wrong!");
        }
      }
      //   navigate("/owning-your-distinctive-style");
    } else {
      setStep(step + 1);
    }
  };

  return (
    <>
      <div className="w-full m-auto mt-6">
        <h2 className="heading_main_dashboard">Personalized Style Profile</h2>
        <p className="text-xs text-center w-full md:w-[40%] m-auto">
          Moments That Inspire You
        </p>
        {step === 1 && (
          <>
            <div className="cards_patroness mt-10">
              <p>
                Which of these moments make you feel the most alive and in your
                element? (Multiple choice)
              </p>
              <div className="checkbox_questions">
                {step1Options.map((option) => (
                  <label key={option} className="checkbox_label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={step1Checkbox?.includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          step1Checkbox,
                          setStep1Checkbox,
                          3
                        )
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {step1Checkbox.length >= 3 && (
                <p style={{ color: "red" }}>
                  You can select up to 1 options only.
                </p>
              )}
            </div>
            <div className="cards_patroness mt-4">
              <p>
                Have you been somewhere that made you fall in love with the
                everyday things—like the colors, the vibe, or the traditions?
                What would you tell someone about that place that made it so
                memorable for you?
              </p>
              <textarea
                required
                className="input_field_normal"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                rows={6}
                placeholder="San Juan—the vibrant colors, the music, the food—everything feels festive and full of life, the kind of place that makes every moment feel like a celebration…"
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="cards_patroness mt-4">
              <p>
                I love bringing flavors, recipes, or dining habits from places
                I’ve visited into my own kitchen. (1-5 Rating)
              </p>
              <div className="checkbox_questions">
                {step2Options1.map((option) => (
                  <label key={option} className="checkbox_label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={step2Checkbox?.includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          step2Checkbox,
                          setStep2Checkbox,
                          1
                        )
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {step2Checkbox.length >= 1 && (
                <p style={{ color: "red" }}>
                  You can select up to 1 options only.
                </p>
              )}
            </div>
            <div className="cards_patroness mt-4">
              <p>
                When something inspires me to try something new, it makes me
                feel…(Multiple choice)
              </p>
              <div className="checkbox_questions">
                {step2Options2.map((option) => (
                  <label key={option} className="checkbox_label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={step2Checkbox2?.includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          step2Checkbox2,
                          setStep2Checkbox2,
                          3
                        )
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {step2Checkbox2.length >= 3 && (
                <p style={{ color: "red" }}>
                  You can select up to 3 options only.
                </p>
              )}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="cards_patroness mt-10">
              <p>
                What’s a small shift or change you’ve made in your life that’s
                brought more joy, beauty, or ease into your everyday routine?
                Was there a moment or experience that inspired you to make it?
              </p>
              <textarea
                required
                className="input_field_normal"
                value={q3}
                onChange={(e) => setQ3(e.target.value)}
                rows={6}
                placeholder="Write your answer here...."
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
            <button className="btn_black_big" onClick={() => updateSteps()}>
              {step === 3 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InspiredMoments;
