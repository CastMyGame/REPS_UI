import React from 'react'
import { useState,useEffect } from 'react';
import axios from "axios";
import { baseUrl } from '../../../utils/jsonData';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Autocomplete, Box, CircularProgress } from '@mui/material';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
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
    const [infractionDescriptionSelected,setInfractionDescriptionSelected] = useState("");
    const [toast, setToast] = useState({display:false,message:""})
    const [studentNames, setStudentNames] = React.useState([]);
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState({display:false,message:"",buttonType:""})
    const [submitPayload, setSubmitPayload] = useState(null)

  
    useEffect(()=>{
      setTeacherEmailSelected(sessionStorage.getItem('email'))
    },[])
  

    const defaultTheme = createTheme();

    
    const infractionPeriodSelectOptions =[
      {value:"exchange", label:"Class Exchange"},
      {value:"afterSchool", label:"After School"},
      {value:"lunch", label:"Lunch"},
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
          setStudentNames([])
          setInfractionPeriodSelected(null)
          setInfractionTypeSelected(null)
          setInfractionDescriptionSelected("")
          
      
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
        setLoading(true)
        setOpenModal({display:false,message:""})
        const payloadContent = []
        studentNames.map((student)=>{
          console.log(student)
          const studentPayload = {
            firstName:"placeholder",
            lastName:"placeholder",
            studentEmail: student.value,
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
                setLoading(false)
                setToast({display:false,message:""})
              },1000)
               resetForm();
               setInfractionDescriptionSelected("");

               console.log(res)
           })
.catch(function (error){
               console.log(error)
               setToast({display:true,message:"Something Went Wrong"})
               setTimeout(()=>{
                setLoading(false)
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
{openModal.display && <div className="modal-overlay">
  <div className="modal-content">
    <div className='modal-header'>
      <h3>{openModal.message}</h3>
    </div>
    <div className='modal-body'>
    </div>
    <div className='modal-buttons'>

      <button onClick={() => {
        setOpenModal({display:false,message:""})}}>Cancel</button>
      {openModal.buttonType==="submit" && <Button
    disabled={!infractionPeriodSelected || !infractionTypeSelected || !infractionDescriptionSelected || studentNames.length ===0 }
      type="submit"
      onClick={handleSubmit}
      width='50%'
      variant="contained"
      sx={{ height: '100%' }} // Set explicit height
    >
      Submit
    </Button>}

    </div>
  </div>
</div>}


        <div  className="form-referral">
     
          {loading &&  <div style={{
    position: 'absolute',    // Position the div absolutely
    top: '64%',              // Center vertically
    left: '60%',             // Center horizontally
    transform: 'translate(-50%, -50%)', // Adjust to perfectly center the div
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Add background color or opacity
  }}>
    <CircularProgress style={{}}  color="secondary" />
  </div>}
        <ThemeProvider theme={defaultTheme}>
      <Container component="main" >

        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width:"100%",
            height:"100%"
          }}
        >
        
  
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <h4>Submitting Teacher: {teacherEmailSelected}</h4>
          <hr/>
       


<Autocomplete
  multiple
  id="demo-multiple-chip"
  value={studentNames}
  onChange={(event, newValue) => setStudentNames(newValue)}
  options={selectOptions} // Pass the selectOptions array here
  getOptionLabel={(option) => option.label}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Students"
      variant="outlined"
      sx={{ width: '100%' }}
    />
  )}
  renderTags={(value, getTagProps) =>
    value.map((option, index) => (
      <Chip key={option.value} label={option.label} {...getTagProps({ index })} />
    ))
  }
/>




<div style={{height:"5px"}}></div>
<div style={{display:'flex',flexDirection:'row',width:"100%"}}>
<div style={{width:"50%"}}>
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
</div>
<div style={{width:"50%",marginLeft:"10px"}}>
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
</div>
</div>




  {console.log(infractionTypeSelected?.value)}
<div className='question-container-text-area'>
  <label htmlFor="offenseDescription">
    {(infractionTypeSelected?.value === "Failure to Complete Work" ||
    infractionTypeSelected?.value === "Positive Behavior Shout Out!" ||
    infractionTypeSelected?.value === "Behavioral Concern")
      ? getTitle(infractionTypeSelected?.value)
      : "For all offenses other than positive behavior shout out and failure to complete work"} *
  </label>
  <p>
    {(infractionTypeSelected?.value === "Failure to Complete Work" ||
    infractionTypeSelected?.value === "Positive Behavior Shout Out!" ||
    infractionTypeSelected?.value === "Behavioral Concern")
      ? getDescription(infractionTypeSelected?.value)
      : "Description of Behavior/Event. This will be sent directly to the student and guardian so be sure to provide accurate and objective facts."}
  </p>
</div>
   <div>               
   <TextField
  margin="normal"
  required
  fullWidth
  multiline  
  minRows={2}  // Optional: Set minimum number of rows
  onChange={(event) => {
    const enteredValue = event.target.value;
    setInfractionDescriptionSelected(enteredValue);
  }}
  id="offenseDescription"
  placeholder="Please Type Short Description of Infraction"
  name="offenseDescription"
  autoFocus
  value={infractionDescriptionSelected}
  InputLabelProps={{
    sx: { "&.Mui-focused": { color: "white", marginTop: "-10px" } },
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter key
      
      // Get the current cursor position
      const { selectionStart, selectionEnd } = e.target;

      // Get the current value of the input
      const value = e.target.value;

      // Insert a newline character (\n) at the cursor position
      const newValue = value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);

      // Update the input value and set the cursor position after the newline character
      e.target.value = newValue;
      e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;

      // Trigger the change event manually (React doesn't update the value automatically)
      const event = new Event('input', { bubbles: true });
      e.target.dispatchEvent(event);

      // Optionally, you can add your logic here for what should happen after Enter is pressed.
    }
  }}

/>
            </div>
            {/* <br/> */}


            <div style={{ display: 'flex', flexDirection: "row", width: "100%" }} className='button-container'>
  <div style={{ width: "30%" }}>
    <Button
      type="reset"
      fullWidth
      variant="contained"
      onClick={()=>{
        resetForm();
      }}
      sx={{ 
        height: '100%', // Set explicit height
        backgroundColor: 'green', // Set background color to green
        '&:hover': {
          backgroundColor: 'darkgreen' // Darken the color on hover if desired
        }
      }}
    >
      Reset
    </Button>
  </div>
  <div style={{ width: "70%" }}>
    {studentNames.length > 1 ? <Button
        disabled={!infractionPeriodSelected || !infractionTypeSelected || !infractionDescriptionSelected || studentNames.length ===0 }
        onClick={() => {
          setOpenModal({display:true, message:"Warning! You are currently writing up multiple students simultaneously. If this is your intent make sure you have not included any student identifiers including names or pronouns. If you wish to continue press Submit, to go back press cancel.", buttonType:"submit"});
          setSubmitPayload()
        }}
        fullWidth
        variant="contained"
        sx={{ height: '100%' }} // Set explicit height
        >Submit Multiple</Button> :
    <Button
    disabled={!infractionPeriodSelected || !infractionTypeSelected || !infractionDescriptionSelected || studentNames.length ===0 }
      type="submit"
      fullWidth
      variant="contained"
      sx={{ height: '100%' }} // Set explicit height
    >
      Submit
    </Button>}
  </div>
</div>

         
          </Box>
        </Box>
      </Container>
    </ThemeProvider>:
 


     
   </div>

    </>
    )


 
    
  }
  export default CreatePunishmentPanel;

