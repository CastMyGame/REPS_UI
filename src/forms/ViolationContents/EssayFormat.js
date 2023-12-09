import React, {useState,useEffect} from "react";

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

  function EssayFactory({essay, handleRadioChange,sectionName,saveAnswerAndProgress}) {
    const essayStyles = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        lineHeight: '1.6', // Increase line height for more space between lines
        color: '#333',
        textAlign: 'left', // Align text to the left',
      /* Add more CSS styles as needed */
    };


    const [shuffledKeys, setShuffledKeys] = useState([]);

    // Effect to shuffle keys on component mount
    useEffect(() => {
      setShuffledKeys(shuffleArray(Object.keys(essay.radioAnswers)));
    }, [essay]);
  
  
    return (
      <>
        <div className="essay-container">
          <div className="section-header">{sectionName}
            <h4 className="question-header">{essay.question}</h4>
          </div>
          <h1>{essay.title}</h1>
          <p>{essay.body}</p>
          <h2 className="references">References</h2>
        </div>
        <div className="required-question" aria-hidden="true" dir="auto">
          * Indicates required question
        </div>
        <hr />
        <div className="question-container">
          <h4  className="question-header">{essay.question}</h4>
          <div>
            {shuffledKeys.map((key) => (
              <label style={{color:"black"}}  key={key} className="radio-label">
                <input
                  type="radio"
                  id={key}
                  name="radioAnswer"
                  value={essay.radioAnswers[key].value}
                  onChange={handleRadioChange}
                />
                {essay.radioAnswers[key].label}
              </label>
            ))}
          </div>
        </div>
        <button type='button' onClick={() => saveAnswerAndProgress()}>Next</button>
      </>
    );
  }
  
  
  export default EssayFactory;