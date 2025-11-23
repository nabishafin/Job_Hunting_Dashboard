import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCreateOrEdit from '../../hooks/useCreateOrEdit';
import { CREATE_QUESTIONNAIRE } from '../../constants';

const DesignInspirations = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [id, setId] = useState(null);
  const { submitData } = useCreateOrEdit();
  const {userId} = useParams()


  const [step1Q1, setStep1Q1] = useState(''); 
  const [step3Q1, setStep3Q1] = useState(''); 

  const [step2Q1, setStep2Q1] = useState(''); 
  const [step1Checkbox, setStep1Checkbox] = useState([]); 
  const [step2Checkbox, setStep2Checkbox] = useState([]); 


  const [step3Checkbox, setStep3Checkbox] = useState([]);   

  
  const [step4Q1, setStep4Q1] = useState(''); 
  const [step4Checkbox, setStep4Checkbox] = useState([]); 

  const handleCheckboxChange = (event, setter, current , maxSelection=1) => {
    const { value, checked } = event.target;

    if (checked && current.length >= maxSelection) {
      return; 
    }

    if (checked) {
      setter([...current, value]);
    } else {
      setter(current.filter((item) => item !== value));
    }
  };

  const fetchAnswers = async () => {
    try {
      const data = {
        _id: "1",
        responses: [
          {
            questionId: "q1",
            answer: "A full length charcoal knit wool dress from Kapital that makes me feel comfortable and fashionable every time I wear it…",
          },
          {
            questionId: "q2",
            answer: ["It’s a natural fit with what I love."],
          },
          {
            questionId: "q3",
            answer: ["I love what this brings to the world - it’s something special."],
          },
          {
            questionId: "q4",
            answer: "This big, colorful rug I found in a tiny market while traveling—it doesn’t match anything, but somehow it pulls the whole space together. Every time I see it, I remember the adventure of finding it…",
          },
          {
            questionId: "q5",
            answer: ["I love the way my space reflects me, but small updates keep it fresh."],
          },
          {
            questionId: "q6",
            answer: "I want it to feel effortless—like people can kick off their shoes, lose track of time, and just be in the moment. Good music, something fun to drink, and space for conversations that go late into the night…",
          },
        ],
      };
      setId(data._id);
      if (data.responses) {
        data.responses.forEach(({ questionId, answer }) => {
            if (questionId === 'q1') setStep1Q1(answer);
            if (questionId === 'q2') setStep1Checkbox(answer);
            if (questionId === 'q3') setStep2Checkbox(answer);
            if (questionId === 'q4') setStep2Q1(answer);
            if (questionId === 'q5') setStep3Checkbox(answer);
            if (questionId === 'q6') setStep3Q1(answer);

        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

   useEffect(() => {
      
  
      fetchAnswers();
    }, []);

  const handleSubmit = async() => {
    const payload = {
      type: "DesignInspirations",
      responses: [
        {
          questionId: "q1",
          question:
            "What is your most cherished fashion find that never fails to lift your mood or make you feel incredible when you wear it? How would you describe it, and what do you love most about it?",
          answer: step1Q1,
        },
        {
          questionId: "q2",
          question:
            "How much does this item feel like a way to amplify the kind of artistic expression you admire?",
          answer: step1Checkbox,
        },
        {
          questionId: "q3",
          question:
            "How strongly do you feel this item reflects the vision of beauty, creativity, or expression you want to support in the world? (1-5 Rating)",
          answer: step2Checkbox,
        },
        {
          questionId: "q4",
          question:
            "What is your favorite piece or detail in your home that always makes you feel happy or inspired when you see it? How would you describe it, and why does it mean so much to you?",
          answer: step2Q1,
        },
        {
          questionId: "q5",
          question:
            "How much do you feel that changing up or updating your home helps you express different sides of yourself? (1-5 Rating)",
          answer: step3Checkbox,
        },
        {
          questionId: "q6",
          question:
            "When hosting others in your home, what kind of atmosphere or mood do you like to create?",
          answer: step3Q1,
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
        } catch (error) {
          console.error("Error submitting data:", error);
          toast.error("Something went wrong!");
        }
      }
  };

  const updateSteps = () => {
    if (step === 4) {
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
            Your Design Inspirations
          </p>
          {step === 1 && (
           
              <>
              <div className="cards_patroness mt-10">
                <p>
                What is your most cherished fashion find that never fails to lift your mood or make you feel incredible when you wear it? How would you describe it, and what do you love most about it?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={step1Q1}
                  onChange={(e) => setStep1Q1(e.target.value)}
                  rows={6}
                  placeholder="A full length charcoal knit wool dress from Kapital that makes me feel comfortable and fashionable every time I wear it…"
                />
              </div>
              <div className="cards_patroness mt-4">
                <p>
                How much does this item feel like a way to amplify the kind of artistic expression you admire?
                </p>
                <div className="checkbox_questions">
                {[
                  "It’s a natural fit with what I love.",
                  "It fits my taste and has details I really appreciate.",
                  "It feels deeply in sync with the kind of creativity I love.",
                  "It brings out everything I find exciting about beauty, art, and expression.",
                  "It completely amplifies and takes everything I love to the next level.",
                ].map((option) => (
                  <label key={option} className="checkbox_label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={step1Checkbox?.includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(e, setStep1Checkbox, step1Checkbox)
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {step1Checkbox.length >= 1 && (
        <p style={{ color: "red" }}>You can select up to 1 options only.</p>
      )}
              </div>
            </>
          )}
          {step === 2 && (
            <>
           
            <div className="cards_patroness mt-4">
              <p>
              How strongly do you feel this item reflects the vision of beauty, creativity, or expression you want to support in the world? (1-5 Rating)
              </p>
              <div className="checkbox_questions">
              {[
                "I love what this brings to the world - it’s something special.",
                "I want to see more of this kind of creativity out there.",
                "This deserves more attention and appreciation.",
                "I’d personally support making more work like this possible.",
                "I fully back this - I want to help bring more of this to life.",
              ].map((option) => (
                <label key={option} className="checkbox_label">
                  <input
                    type="checkbox"
                    value={option}
                    checked={step2Checkbox?.includes(option)}
                    onChange={(e) =>
                      handleCheckboxChange(e, setStep2Checkbox, step2Checkbox)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {step2Checkbox.length >= 1 && (
      <p style={{ color: "red" }}>You can select up to 1 options only.</p>
    )}
            </div>
            <div className="cards_patroness mt-10">
              <p>
              What is your favorite piece or detail in your home that always makes you feel happy or inspired when you see it? How would you describe it, and why does it mean so much to you?
              </p>
              <textarea
                required
                className="input_field_normal"
                value={step2Q1}
                onChange={(e) => setStep2Q1(e.target.value)}
                rows={6}
                placeholder="This big, colorful rug I found in a tiny market while traveling—it doesn’t match anything, but somehow it pulls the whole space together. Every time I see it, I remember the adventure of finding it…"
              />
            </div>
          </>
          )}
          {step === 3 && (
           <>
           
           <div className="cards_patroness mt-4">
             <p>
             How much do you feel that changing up or updating your home helps you express different sides of yourself? (1-5 Rating)
             </p>
             <div className="checkbox_questions">
             {[
               "I love the way my space reflects me, but small updates keep it fresh.",
               "Switching things up lets me explore different moods and styles I enjoy.",
               "Changing my space helps me grow and express new parts of myself.",
               "Updating my home is a creative outlet - it brings energy and inspiration.",
               "It’s everything! My space evolves with me, and I love making it feel like me in new ways.",
             ].map((option) => (
               <label key={option} className="checkbox_label">
                 <input
                   type="checkbox"
                   value={option}
                   checked={step3Checkbox?.includes(option)}
                   onChange={(e) =>
                     handleCheckboxChange(e, setStep3Checkbox, step3Checkbox)
                   }
                 />
                 <span>{option}</span>
               </label>
             ))}
           </div>
           {step3Checkbox.length >= 1 && (
     <p style={{ color: "red" }}>You can select up to 1 options only.</p>
   )}
           </div>
           <div className="cards_patroness mt-10">
             <p>
             When hosting others in your home, what kind of atmosphere or mood do you like to create?
             </p>
             <textarea
               required
               className="input_field_normal"
               value={step3Q1}
               onChange={(e) => setStep3Q1(e.target.value)}
               rows={6}
               placeholder="I want it to feel effortless—like people can kick off their shoes, lose track of time, and just be in the moment. Good music, something fun to drink, and space for conversations that go late into the night…"
             />
           </div>
         </>
          )}
          {step === 4 && (
            <>
              <div className="cards_patroness mt-10">
                <p>
                  What part of yourself do you feel this style helps you express?
                </p>
                <textarea
                  required
                  className="input_field_normal"
                  value={step4Q1}
                  onChange={(e) => setStep4Q1(e.target.value)}
                  rows={6}
                  placeholder="Write your answer here...."
                />
              </div>
              <div className="cards_patroness mt-4">
                <p>
                  What feelings come up when you picture this style reflected in your home environment?
                </p>
                <div className="checkbox_questions">
                {[
                  "Charged with possibility, like my space is fueling bold ideas and dreams",
                  "Serene and grounded, creating a personal oasis where I can truly unwind",
                  "Rejuvenated and open, as though nature’s calm and freshness flows through my space",
                  "Aligned and purposeful, with every element reflecting meaning and intention",
                  "Playful and alive, filling my home with creative spark and joyful energy",
                 
                ].map((option) => (
                  <label key={option} className="checkbox_label">
                    <input
                      type="checkbox"
                      value={option}
                      checked={step4Checkbox.includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(e, setStep4Checkbox, step4Checkbox)
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              </div>
            </>
          )}
          <div className="flex justify-between mt-5 flex-col md:flex-row gap-6 mb-10">
            <div>
              {step !== 1 && (
                <button className="btn_big_white" onClick={() => setStep(step - 1)}>
                  Back
                </button>
              )}
            </div>
            <div>
              {step < 3 ? (
                <button className="btn_black_big" onClick={() => setStep(step + 1)}>
                  Next
                </button>
              ) : (
                <button className="btn_black_big" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
    </>
  );
};

export default DesignInspirations;
