import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { baseUrl } from './jsonData';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const MultiPageForm = () => {
  const [numOfQuestions, setNumberOfQuestions] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);

  const [payload, setPayload] = useState({
    infractionName: '',
    level: 1,
    questions: [
      {
        question: "",
        type: "",
        title: "",
        body: "",
        references: [""],
        radioAnswers: {},
        textToCompare: "",
        
        
      }
    ]
  });

  const handleChange = (key, value) => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      [key]: value,
    }));
  };

  const handleMappedChange = (key, value, questionIndex) => {
    setPayload((prevPayload) => {
      const newQuestions = [...prevPayload.questions];
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], [key]: value };
      return { ...prevPayload, questions: newQuestions };
    });
  };

  const handleAnswerChange = (key, value, questionIndex, answerIndex) => {
    const newAnswers = { ...payload.questions[questionIndex].radioAnswers };
    if (key === 'label') {
      newAnswers[answerIndex][key] = value;
    } else {
      newAnswers[answerIndex][key] = value === 'true'; // Convert 'true'/'false' to boolean
    }
    handleMappedChange('radioAnswers', newAnswers, questionIndex);
  };

  const addAnswer = (questionIndex) => {
    const newAnswers = { ...payload.questions[questionIndex].radioAnswers };
    const newIndex = Object.keys(newAnswers).length + 1; // Generate a new index
    newAnswers[newIndex] = { label: '', value: false }; // Default value to false
    handleMappedChange('radioAnswers', newAnswers, questionIndex);
  };

  const handleRefChange = (key, value, questionIndex, referenceIndex) => {
    setPayload((prevPayload) => {
      const newQuestions = [...prevPayload.questions];
  
      // Check if the key is 'references'
      if (key === 'references') {
        newQuestions[questionIndex][key][referenceIndex] = value;
      } else {
        // Handle other keys normally
        newQuestions[questionIndex] = { ...newQuestions[questionIndex], [key]: value };
      }
  
      return { ...prevPayload, questions: newQuestions };
    });
  };

  const addReference = (questionIndex) => {
    setPayload((prevPayload) => {
      const newQuestions = [...prevPayload.questions];
      const currentReferences = newQuestions[questionIndex]?.references || [];
      currentReferences.push('');
      newQuestions[questionIndex].references = currentReferences;
      return { ...prevPayload, questions: newQuestions };
    });
  };

  const buildPayload = () => {
    const finalPayload = {
      infractionName: payload.infractionName,
      level: payload.level,
      questions: payload.questions,
    };
    console.log(finalPayload);


    const headers = {
        Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
      };
      

const url =`${baseUrl}/assignments/v1/`
axios.post(url, finalPayload,{headers})
.then(response => {
  console.log(response.data);
  window.alert(`Successfully created assignment ${response.data}`);
})
.catch(error => {
  console.error(error);
});
    // You can use the finalPayload as needed (e.g., send it to an API)
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: 20, margin: '20px 0' }}>
        <Typography variant="h5">Create New Assignment</Typography>
        <form>
          <TextField
            label="Infraction Name"
            fullWidth
            required
            style={{marginBottom:"10px"}}
            value={payload.infractionName}
            onChange={(e) => handleChange('infractionName', e.target.value)}
          />
          <TextField
            label="Level"
            type="number"
            fullWidth
            style={{marginBottom:"10px"}}

            required
            value={payload.level}
            onChange={(e) => handleChange('level', parseInt(e.target.value))}
          />

          {/* Dynamic Questions */}
          {[...Array(numOfQuestions)].map((_, questionIndex) => (
            <Accordion
            style={{marginBottom:"10px"}}
             key={questionIndex}
             expanded={questionIndex === openAccordion}
             onChange={() => setOpenAccordion(questionIndex === openAccordion ? null : questionIndex)}

             >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`question-${questionIndex}-content`}
                id={`question-${questionIndex}-header`}
              >
                <Typography variant="h6">Question {questionIndex + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                 
                 
                   {/* Use Select component for Question Type */}
                   <FormControl fullWidth required>
                   <InputLabel>Question Type</InputLabel>

                    <Select
                                        style={{marginBottom:"10px"}}

                      value={payload.questions[questionIndex]?.type || ''}
                      onChange={(e) => handleMappedChange('type', e.target.value, questionIndex)}
                    >
                      <MenuItem value="reading">Reading</MenuItem>
                      <MenuItem value="retryQuestion">Retry Question</MenuItem>
                      <MenuItem value="exploratory">Exploratory</MenuItem>
                    </Select>
                  </FormControl>
                  {payload.questions[questionIndex]?.type === "reading" && (
                    <>

                    <TextField
                    label={`Question Text`}
                    id="outlined-basic" 
                    variant="outlined"
                    multiline
                    rows={1}
                    fullWidth
                    required
                    style={{marginBottom:"10px"}}
                    value={payload.questions[questionIndex]?.question || ''}
                    onChange={(e) => handleMappedChange('question', e.target.value, questionIndex)}
                  />

                      <TextField
                        label={`Essay Title`}
                        multiline
                        rows={2}
                        fullWidth
                        style={{marginBottom:"10px"}}

                        required
                        value={payload.questions[questionIndex]?.title || ''}
                        onChange={(e) => handleMappedChange('title', e.target.value, questionIndex)}
                      />
                      <TextField
                        label={`Essay Body`}
                        multiline
                        rows={4}
                        fullWidth
                        style={{marginBottom:"10px"}}

                        required
                        value={payload.questions[questionIndex]?.body || ''}
                        onChange={(e) => handleMappedChange('body', e.target.value, questionIndex)}
                      />
                     
                      {payload.questions[questionIndex]?.references?.map((reference, referenceIndex) => (
  <div key={referenceIndex}>
    <TextField
      label={`Reference ${referenceIndex + 1}`}
      multiline
      rows={2}
      fullWidth
      style={{marginBottom:"10px"}}

      required
      value={reference}
      onChange={(e) => {
        console.log('Before Update:', payload);
        handleRefChange('references', e.target.value, questionIndex, referenceIndex);
        console.log('After Update:', payload);
      }}
    />
  </div>
))}
 <Button
                        variant="outlined"
                        onClick={() => addReference(questionIndex)}
                        style={{ margin: '10px 0' }}
                      >
                        Add Reference
                      </Button>
  
                      {Object.keys(payload.questions[questionIndex]?.radioAnswers || {}).map((answerIndex) => (
                        <div style={{display:"flex", marginBottom:"10px"}} key={answerIndex}>
                          <TextField
                            select
                            label={`Answer ${answerIndex}`}
                            style={{width:"50%"}}
                            required
                            value={payload.questions[questionIndex]?.radioAnswers[answerIndex]?.value.toString() || 'false'}
                            onChange={(e) => handleAnswerChange('value', e.target.value, questionIndex, answerIndex)}
                          >
                            <MenuItem value="true">Correct</MenuItem>
                            <MenuItem value="false">Incorrect</MenuItem>
                          </TextField>
                          <TextField
                            label={`Text Answer ${answerIndex}`}
                            multiline
                            rows={1}
                            fullWidth
                            required
                            value={payload.questions[questionIndex]?.radioAnswers[answerIndex]?.label || ''}
                            onChange={(e) => handleAnswerChange('label', e.target.value, questionIndex, answerIndex)}
                          />
                        </div>
                      ))}
                       <Button
                        variant="outlined"
                        onClick={() => addAnswer(questionIndex)}
                        style={{ margin: '10px 0' }}
                      >
                        Add Answer
                      </Button>
                    </>
                  )}
                 
                  
                  {payload.questions[questionIndex]?.type === "retryQuestion" && (
                    <>
                      <TextField
                    label={`Text To Copy`}
                    multiline
                    rows={4}
                    fullWidth
                    required
                    value={payload.questions[questionIndex]?.textToCompare || ''}
                    onChange={(e) => handleMappedChange('textToCompare', e.target.value, questionIndex)}
                  />

                    </>
                  )}

{payload.questions[questionIndex]?.type.includes("exploratory") && (
  <>
    <TextField
      label={`Title`}
      multiline
      rows={1}
      fullWidth
      style={{marginBottom:"10px"}}
      required
      value={payload.questions[questionIndex]?.title || ''}
      onChange={(e) => handleMappedChange('title', e.target.value, questionIndex)}
    />

<TextField
                    label={`Question Text`}
                    id="outlined-basic" 
                    variant="outlined"
                    multiline
                    rows={1}
                    fullWidth
                    required
                    style={{marginBottom:"10px"}}
                    value={payload.questions[questionIndex]?.question || ''}
                    onChange={(e) => handleMappedChange('question', e.target.value, questionIndex)}
                  />
  </>
)}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}

    
        </form>
        <Button variant="outlined" onClick={() => setNumberOfQuestions((prev) => prev + 1)}>
          Add Question
        </Button>
      </Paper>

      <Button variant="contained" color="primary" onClick={buildPayload}>
            Submit Assignment
          </Button>
    </Container>
  );
};

export default MultiPageForm;