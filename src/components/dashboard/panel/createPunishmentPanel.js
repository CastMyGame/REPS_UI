import React from 'react'
import { useState,useEffect } from 'react';
import Typography from '@mui/material/Typography';
import axios from "axios";
// import Select from "react-select";
import { baseUrl } from '../../../utils/jsonData';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, studentNames, theme) {
  return {
    fontWeight:
      studentNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}


const CreatePunishmentPanel = () => {

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  
    const [listOfStudents, setListOfStudents] = useState([]);
    const [studentSelected, setStudentSelect] = useState();
    const [infractionTypeSelected, setInfractionTypeSelected] = useState("");
    const [infractionPeriodSelected, setInfractionPeriodSelected] = useState("");
    const [teacherEmailSelected, setTeacherEmailSelected] = useState();
    const [infractionDescriptionSelected,setInfractionDescriptionSelected] = useState();
    const [toast, setToast] = useState({display:false,message:""})
    const [studentNames, setStudentNames] = React.useState([]);

  
    useEffect(()=>{
      setTeacherEmailSelected(sessionStorage.getItem('email'))
    },[])
  

    const defaultTheme = createTheme();

    
    const infractionPeriodSelectOptions =[
      {value:"block1", label:"Block 1"},
      {value:"block2", label:"Block 2"},
      {value:"block3", label:"Block 3"},
      {value:"block4", label:"Block 4"},
      {value:"period1", label:"Period 1"},
      {value:"period2", label:"Period 2"},
      {value:"period3", label:"Period 3"},
      {value:"period4", label:"Period 4"},
      {value:"period5", label:"Period 5"},
      {value:"period6", label:"Period 6"},
      {value:"period7", label:"Period 7"},
      {value:"period8", label:"Period 8"},
      {value:"period9", label:"Period 9"},


    ]

    const infractionSelectOptions =[
      {value:"Tardy", label:"Tardy"},
      {value:"Unauthorized Device/Cell Phone", label:"Unauthorized Device/Cell Phone"},
      {value:"Disruptive Behavior", label:"Disruptive Behavior"},
      {value:"Horseplay", label:"Horseplay"},
      {value:"Dress Code", label:"Dress Code"},
      {value:"Positive Behavior Shout Out!", label:"Positive Behavior Shout Out!"},
      {value:"Behavioral Concern", label:"Behavioral Concern"},
      {value:"Failure to Complete Work", label:"Failure to Complete Work"},
      
    ]
  
  
  
    const descriptions = {
      "Failure to Complete Work": "Please write a description of the missing assignment, when it was due, and a link to the assignment if one is available. Please also explain how the missing assignment is effecting the student's grade and how many points they can earn upon completion.",
      "Positive Behavior Shout Out!": "Thank you for choosing to shout out a successful student! Please write a description of the action that earned a shout out along with the student's name and anyone else who was involved.",
    };
  
    const titles = {
      "Failure to Complete Work": "Failure to Complete Work",
      "Positive Behavior Shout Out!": "Positive Behavior Shout Out! ",
    };
  

  
    const getDescription = (selectedOption) =>{
      return descriptions[selectedOption] ||  "Description of Behavior/Event. This will be sent directly to the student and guardian so be sure to provide accurate and objective facts."
  
    }
  
    const getTitle = (selectedOption) =>{
      return titles[selectedOption] ||  "For all offenses other than positive behavior shout out and failure to complete work."
    }
  
    const headers = {
      Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
    };
    
    const url = `${baseUrl}/student/v1/allStudents`; // Replace with your actual API endpoint
    
    useEffect(() => {
      axios
        .get(url, { headers }) // Pass the headers option with the JWT token
        .then(function (response) {
          setListOfStudents(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, []);
  
      const selectOptions = listOfStudents.map(student => ({
          value: student.studentEmail, // Use a unique value for each option
          label: `${student.firstName} ${student.lastName} - ${student.studentEmail}`, // Display student's full name as the label
    
          
        }));
      


  
        const resetForm = ()=>{
          setStudentSelect(null)
          setInfractionPeriodSelected(null)
          setInfractionTypeSelected(null)
          setInfractionDescriptionSelected(null)
      
      }
      

      const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setStudentNames(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };


      //Mapping selected students pushing indivdual payloads to post
      const handleSubmit = (event) => {
        event.preventDefault();
        const payloadContent = []
        studentNames.map((student)=>{
          const studentPayload = {
            firstName:"placeholder",
            lastName:"placeholder",
            studentEmail: student,
            teacherEmail: teacherEmailSelected,
            infractionPeriod: infractionPeriodSelected,
            infractionName: infractionTypeSelected,
            infractionDescription: infractionDescriptionSelected,

          }
          payloadContent.push(studentPayload)
        })

        const payload =payloadContent

console.log(payload)

             axios.post(`${baseUrl}/punish/v1/startPunish/formList`,payload,
               {headers: headers})
              .then(function (res) {
               setToast({display:true,message:"Referral Succesfuly Created"})
               setTimeout(()=>{
                setToast({display:false,message:""})
              },1000)
               resetForm();
               console.log(res)
           })
.catch(function (error){
               console.log(error)
               setToast({display:true,message:"Something Went Wrong"})
               setTimeout(()=>{
                setToast({display:false,message:""})
              },2000)
           });
    
      
  
      
    }


    const handleInfractionPeriodChange = (event) => {
        setInfractionPeriodSelected(event.target.value);

      }

    const handleInfractionTypeChange = (event) => {
        setInfractionTypeSelected(event.target.value);

      }
    

    
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setToast({display:false,message:""});
    };
  

    return (
        <>
          { toast.display===true &&   <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={toast} autoHideDuration={6000} onClose={handleClose}>
  <Alert Close={handleClose} severity="success" sx={{ width: '100%' }}>
  {toast.message}
  </Alert>
</Snackbar>}


        <div className="form-container">
            <div className="form-title">REPS Teacher Managed Referral</div>
             <h5> This form will be used to provide automated assignments based on the behavior described in this form. The offense number will be looked up automatically and will include offenses from other class. A list of the offenses and their assignments can be viewed{' '}
 After completing this form, the student and their guardian will be informed of the incident and given a restorative assignment to complete to gain insight on the negative effects of the behavior. REPS Discipline Management System will also send follow-up emails if additional steps are needed. These emails are designed to be copied and pasted directly into Review 360 when necessary. </h5>
   
            <div  aria-hidden="true" dir="auto">
              * Indicates required question
            </div>
      
            <ThemeProvider theme={defaultTheme}>
      <Container component="main" >

        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width:"100%",
            height:"100%"
          }}
        >
        
          <Typography component="h1" variant="h5">
           Create New Punishment
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <h4>Submitting Teacher: {teacherEmailSelected}</h4>
          <hr/>
       

          <InputLabel id="demo-multiple-chip-label">Select Students</InputLabel>
        <Select
        sx={{ width: '100%'}}
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={studentNames}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {selectOptions.map((name) => (
            <MenuItem
              key={name.value}
              value={name.value}
              style={getStyles(name, studentNames, defaultTheme)}
            >
              {name.label}
            </MenuItem>
          ))}
        </Select>

       <div style={{height:"10px"}}></div>
       <InputLabel id="infractionPeriod">Infraction Period</InputLabel>
   
       <Select
      sx={{ width: '100%'}}

  labelId="infractionPeriod"
  value={infractionPeriodSelected}
  onChange={handleInfractionPeriodChange}
  renderValue={(selected) => {
    // Check if selected is an array, if not, wrap it in an array
    const selectedArray = Array.isArray(selected) ? selected : [selected];
  
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedArray.map((value) => (
          <Chip key={value} label={value} />
        ))}
      </Box>
    );
  }}
  MenuProps={MenuProps}
>
  {infractionPeriodSelectOptions.map((name) => (
    <MenuItem
      key={name.value}
      value={name.value}
      style={getStyles(name, studentNames, defaultTheme)}
    >
      {name.label}
    </MenuItem>
  ))}

</Select>

<div style={{height:"10px"}}></div>
       <InputLabel id="infractionType">Infraction Type</InputLabel>
   
       <Select
      sx={{ width: '100%'}}

  labelId="infractionType"
  value={infractionTypeSelected}
  onChange={handleInfractionTypeChange}
  renderValue={(selected) => {
    // Check if selected is an array, if not, wrap it in an array
    const selectedArray = Array.isArray(selected) ? selected : [selected];
  
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selectedArray.map((value) => (
          <Chip key={value} label={value} />
        ))}
      </Box>
    );
  }}
  MenuProps={MenuProps}
>
  {infractionSelectOptions.map((name) => (
    <MenuItem
      key={name.value}
      value={name.value}
      style={getStyles(name, studentNames, defaultTheme)}
    >
      {name.label}
    </MenuItem>
  ))}

</Select>


<div style={{ height: "10px" }}></div>




  {console.log(infractionTypeSelected?.value)}
<div className='question-container-text-area'>
  <label htmlFor="offenseDescription">
    {(infractionTypeSelected?.value === "Failure to Complete Work" ||
    infractionTypeSelected?.value === "Positive Behavior Shout Out!" ||
    infractionTypeSelected?.value === "Behavioral Concern")
      ? getTitle(infractionTypeSelected?.value)
      : "For all offenses other than positive behavior shout out and failure to complete work"} *
  </label>
  <h5>
    {(infractionTypeSelected?.value === "Failure to Complete Work" ||
    infractionTypeSelected?.value === "Positive Behavior Shout Out!" ||
    infractionTypeSelected?.value === "Behavioral Concern")
      ? getDescription(infractionTypeSelected?.value)
      : "Description of Behavior/Event. This will be sent directly to the student and guardian so be sure to provide accurate and objective facts."}
  </h5>
</div>
   <div>               
<TextField
              margin="normal"
              required
              fullWidth
              onChange={(event) => {
                const enteredValue = event.target.value;
                setInfractionDescriptionSelected(enteredValue);
              }}               id="offenseDescription"
               placeholder="Please Type Short Description of Infraction"
              name="offenseDescription"
              autoFocus
              InputLabelProps={{
                sx: {  "&.Mui-focused": { color: "white", marginTop:"-10px" } },
              }}
    
            />
            </div>

      
            <br/>



          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
           Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
   </div>
  
    </>
    )
    
  }
  export default CreatePunishmentPanel;

