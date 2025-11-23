import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CREATE_QUESTIONNAIRE } from "../../constants";
import useCreateOrEdit from "../../hooks/useCreateOrEdit";


const DistinctStyle = () => {
  const navigate = useNavigate();
  const [showhide, setShowhide] = useState(true);
  const [id, setId] = useState(null);
  const { submitData } = useCreateOrEdit();
const {userId} = useParams()
  const [step, setStep] = useState(1);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [q4, setQ4] = useState("");
  const [q5, setQ5] = useState("");
  const [q6, setQ6] = useState("");
  const [q7, setQ7] = useState("");

  // New state variables for checkbox groups:
  const [step4Checkbox1, setStep4Checkbox1] = useState([]); // For: "When you think about embracing your unique style, which word best describes how it makes you feel? (Select up to 2)"
  const [step4Checkbox2, setStep4Checkbox2] = useState([]); // For: "My personal style has helped me appreciate the beauty in things that might not appeal to everyone."
  const [step4Checkbox3, setStep4Checkbox3] = useState([]); // For: "I feel most fulfilled when I can fully express the unique qualities I value in myself."
  const [step4Checkbox4, setStep4Checkbox4] = useState([]); // For: "I trust my instincts when something resonates with me, even if I can’t fully explain it."

  // Generic handler for checkbox changes with optional limit enforcement.
  const handleCheckboxChange = (event, state, setState, limit = null) => {
    const { value, checked } = event.target;
    if (checked) {
      if (limit && state.length >= limit) return;
      setState([...state, value]);
    } else {
      setState(state.filter((item) => item !== value));
    }
  };

  const fetchAnswers = async () => {
    try {
      const data = {
        _id: "1",
        responses: [
          {
            questionId: "q1",
            answer: "Answer 1",
          },
          {
            questionId: "q2",
            answer: ["Yes - there was a moment when I fully embraced what makes me unique, and it changed everything."],
          },
          {
            questionId: "q3",
            answer: "Answer 3",
          },
          {
            questionId: "q4",
            answer: "Answer 4",
          },
          {
            questionId: "q5",
            answer: "Answer 5",
          },
          {
            questionId: "q6",
            answer: "Answer 6",
          },
          {
            questionId: "q7",
            answer: "Answer 7",
          },
          {
            questionId: "q8",
            answer: ["Not really - my style is more about what feels right for me."],
          },
          {
            questionId: "q9",
            answer: ["Not really - I usually need a clear reason before I trust my gut."],
          },
          {
            questionId: "q10",
            answer: "Answer 10",
          },
        ],
      };
      setId(data._id);
      const resonses = data.responses;
      if (resonses) {
        resonses.forEach(({ questionId, answer }) => {
          if (questionId === "q1") setQ1(answer);
          if (questionId === "q2") setStep4Checkbox1(answer);
          if (questionId === "q3") setQ2(answer);
          if (questionId === "q4") setQ3(answer);
          if (questionId === "q5") setQ4(answer);
          if (questionId === "q6") setQ5(answer);
          if (questionId === "q7") setQ6(answer);
          if (questionId === "q8") setStep4Checkbox2(answer);
          if (questionId === "q9") setStep4Checkbox3(answer);
          if (questionId === "q10") setQ7(answer);
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
   

    fetchAnswers();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      type: "DistinctiveStyle",
      responses: [
        {
          questionId: "q1",
          question:
            "We've all had that moment of buying something a little wild - art, fashion, otherwise - that feels like a leap of faith. What's yours? And when did you realize it wasn't wild - it was genius?",
          answer: q1,
        },
        {
          questionId: "q2",
          question:
            "Was there a moment or experience where you realized that owning what makes you different felt more empowering than trying to fit in? (Multiple choice)",
          answer: step4Checkbox1,
        },
        {
          questionId: "q3",
          question:
            "Imagine someone is still figuring out how to embrace their uniqueness - what advice would you give them?",
          answer: q2,
        },
        {
          questionId: "q4",
          question:
            "If your closest friend were to describe the most amazing thing about you, what do you think they'd say?",
          answer: q3,
        },
        {
          questionId: "q5",
          question:
            "When you think about creating a space that feels like 'you', what's the one story or feeling you'd love it to share through the art you choose?",
          answer: q4,
        },
        {
          questionId: "q6",
          question:
            "Looking back, what's one part of your style or the way you express yourself that you're proud to have fully embraced, and wish you'd done sooner?",
          answer: q5,
        },
        {
          questionId: "q7",
          question:
            "If you could hop in a time machine, what advice would you give your past self to speed things up?",
          answer: q6,
        },
        {
          questionId: "q8",
          question:
            "My personal style has helped me appreciate the beauty in things that might not appeal to everyone. (1-5 Rating)",
          answer: step4Checkbox2,
        },
        {
          questionId: "q9",
          question:
            "I trust my instincts when something resonates with me, even if I can't fully explain it.",
          answer: step4Checkbox3,
        },
        {
          questionId: "q10",
          question:
            "If your art could tell a story about your life today, what would future you love most about that story? Would it feel adventurous, elegant, or maybe even a little mysterious?",
          answer: q7,
        },
      ],
    };

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
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Something went wrong!");
      }
    }
  };

  const updateSteps = () => {
    if (step === 5) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <>
        <div className="w-full m-auto mt-6">
          <h2 className="heading_main_dashboard">Personalized Style Profile</h2>
          <p className="text-xs text-center w-full md:w-[40%] m-auto">
            Owning Your Distinctive Style
          </p>
          {step == 1 && (
            <>
            <div className="cards_patroness mt-4">
                <p>
                We've all had that moment of buying something a little wild - art, fashion, otherwise - that feels like a leap of faith. What's yours? And when did you realize it wasn't wild - it was genius?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  rows={6}
                  placeholder="Write your answer here...."
                />
              </div>
              <div className="cards_patroness mt-10">
                <p>
                Was there a moment or experience where you realized that owning what makes you different felt more empowering than trying to fit in? (Multiple choice)
                </p>
                <div className="checkbox_questions">
                  {[
                    "Yes - there was a moment when I fully embraced what makes me unique, and it changed everything.",
                    "Kind of - it’s been a journey, but I’ve had moments where I’ve felt the power of being fully myself.",
                    "Not really - it’s something I’m still figuring out, but I love the idea of getting there.",
             
                  ].map((option) => (
                    <label key={option} className="checkbox_label">
                      <input
                        type="checkbox"
                        name="vehicle1"
                        value={option}
                        checked={step4Checkbox1?.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            step4Checkbox1,
                            setStep4Checkbox1,
                            1
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {step4Checkbox1.length >= 1 && (
      <p style={{ color: "red" }}>You can select up to 1 options only.</p>
    )}
              </div>
              
            </>
          )}
          {step == 2 && (
            <>
            <div className="cards_patroness mt-4">
              <p>
              Imagine someone is still figuring out how to embrace their uniqueness - what advice would you give them?
              </p>
              <textarea
                required
                className="input_field_normal"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                rows={6}
                placeholder="Write your answer here...."
              />
            </div>

            <div className="cards_patroness mt-4">
              <p>
              If your closest friend were to describe the most amazing thing about you, what do you think they'd say?
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

          {step == 3 && (
            <>
              <div className="cards_patroness mt-4">
                <p>
                When you think about creating a space that feels like 'you', what's the one story or feeling you'd love it to share through the art you choose?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={q4}
                  onChange={(e) => setQ4(e.target.value)}
                  rows={6}
                  placeholder="Write your answer here...."
                />
              </div>

              <div className="cards_patroness mt-4">
                <p>
                Looking back, what's one part of your style or the way you express yourself that you're proud to have fully embraced, and wish you'd done sooner?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={q5}
                  onChange={(e) => setQ5(e.target.value)}
                  rows={6}
                  placeholder="Write your answer here...."
                />
              </div>
            </>
          )}

          {step == 4 && (
            <>
              <div className="cards_patroness mt-4">
                <p>
                If you could hop in a time machine, what advice would you give your past self to speed things up?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={q6}
                  onChange={(e) => setQ6(e.target.value)}
                  rows={6}
                  placeholder="To the version of me who felt restless but didn’t know where to go next.…"
                />
              </div>
              <div className="cards_patroness mt-4">
                <p>
                My personal style has helped me appreciate the beauty in things that might not appeal to everyone. (1-5 Rating)
                </p>
                <div className="checkbox_questions">
                  {[
                    "Not really - my style is more about what feels right for me.",
                    "A little - I notice unique things, but I don’t always connect with them.",
                    "Yes, I see beauty in things that aren’t always obvious at first.",
                    "Definitely - my style has expanded how I see and appreciate creativity.",
                    "Absolutely - it’s made me love things that feel rare, unexpected, and personal.",
                  ].map((option) => (
                    <label key={option} className="checkbox_label">
                      <input
                        type="checkbox"
                        // name="vehicle1"
                        value={option}
                        checked={step4Checkbox2?.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            step4Checkbox2,
                            setStep4Checkbox2,
                            1
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {step4Checkbox2.length >= 1 && (
      <p style={{ color: "red" }}>You can select up to 1 options only.</p>
    )}
              </div>
            </>
          )}

          {step == 5 && (
            <>
             
              <div className="cards_patroness mt-4">
                <p>
                I trust my instincts when something resonates with me, even if I can't fully explain it. 
                </p>
                <div className="checkbox_questions">
                  {[
                    "Not really - I usually need a clear reason before I trust my gut.",
                    "Sometimes - I go with my instincts, but I still like to think things through.",
                    "Yes, if something clicks, I don’t overthink it too much.",
                    "Definitely - I know when something feels right, and I trust that feeling.",
                    "Always - if something speaks to me, that’s all the reason I need.",
                  ].map((option) => (
                    <label key={option} className="checkbox_label">
                      <input
                        type="checkbox"
                        // name="vehicle1"
                        value={option}
                        checked={step4Checkbox3?.includes(option)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            step4Checkbox3,
                            setStep4Checkbox3,
                            1
                          )
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {step4Checkbox3.length >= 1 && (
      <p style={{ color: "red" }}>You can select up to 1 options only.</p>
    )}
              </div>
              <div className="cards_patroness mt-4">
                <p>
                If your art could tell a story about your life today, what would future you love most about that story? Would it feel adventurous, elegant, or maybe even a little mysterious?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={q7}
                  onChange={(e) => setQ7(e.target.value)}
                  rows={6}
                  placeholder="To the version of me who felt restless but didn’t know where to go next.…"
                />
              </div>

            </>
          )}

          <div className="flex justify-between mt-5 flex-col md:flex-row gap-6 mb-10">
            <div>
              {step != 1 && (
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
                {step == 5 ? "Submit" : "Next"}{" "}
              </button>
            </div>
          </div>
        </div>
    </>
  );
};
export default DistinctStyle;
