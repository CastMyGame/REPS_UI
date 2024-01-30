import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, TextareaAutosize, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { baseUrl } from '../utils/jsonData';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const ContactUsModal = ({ setContactUsDisplayModal, contactUsDisplayModal }) => {
  const topics = ['General Inquiry', 'Login Issue', 'Billing Issue', 'Student Issue', 'Tool Issue'];

  const [selectedTopic, setSelectedTopic] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [message, setMessage] = useState('');
  const [warningToast, setWarningToast] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState('');

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmailAddress(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    // Regular expression for basic email validation
    const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the entered email is valid
    if (!emailValidationRegex.test(emailAddress)) {
      setEmailValidationMessage('Invalid email address');
      return; // Exit the function if the email is not valid
    }

    // Clear any previous validation message
    setEmailValidationMessage('');

    const payload = {
      email: emailAddress,
      subject: selectedTopic,
      message: message,
    };

    axios
      .post(`${baseUrl}/contact-us`, payload)
      .then((response) => {
        setWarningToast(true);
        setTimeout(() => {
          setWarningToast(false);
          setContactUsDisplayModal(false);
        }, 2000);
      })
      .catch((error) => console.error(error));
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setWarningToast(false);
  };

  return (
    <>
      <Snackbar open={warningToast} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          The Support Team has been Notified
        </Alert>
      </Snackbar>

      {contactUsDisplayModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            height: '600px',
            width: '500px',
            borderRadius: '10px',
            zIndex: 2,
            padding: '20px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className="header" style={{ marginBottom: '20px' }}>
            <Typography variant="h5">Have a Question or Need Help?</Typography>
          </div>

          <FormControl fullWidth variant="outlined" style={{ marginBottom: '20px', zIndex: 9999 }}>
            <InputLabel id="topic-label">Choose Topic</InputLabel>
            <Select labelId="topic-label" id="topic-select" value={selectedTopic} onChange={handleTopicChange} label="Choose Topic">
              {topics.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={emailAddress}
            onChange={handleEmailChange}
            error={Boolean(emailValidationMessage)}
            helperText={emailValidationMessage}
            style={{ marginBottom: '20px' }}
          />

          <TextareaAutosize
            minRows={4}
            placeholder="Enter your message..."
            value={message}
            onChange={handleMessageChange}
            style={{ width: '100%', marginBottom: '20px', padding: '10px', borderRadius: '5px', resize: 'vertical' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button disabled={!selectedTopic || !emailAddress || !message || Boolean(emailValidationMessage)} variant="contained" color="primary" onClick={handleSendMessage}>
              Send Message
            </Button>

            <Button variant="contained" color="success" onClick={() => setContactUsDisplayModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
};