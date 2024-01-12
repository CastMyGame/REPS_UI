import  {useEffect,useState} from 'react'
import * as React from 'react';

import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, TextField, Select, Box, Chip, MenuItem, createTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios"
import { baseUrl } from '../../../utils/jsonData'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckBoxIcon from '@mui/icons-material/CheckBox';




    const LevelThreePanel = ({roleType}) => {
      const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });

      const [listOfPunishments, setListOfPunishments]= useState([])
      const [sort,setSort] = useState("");
      const [loadingPunihsmentId, setLoadingPunishmentId] = useState({id:null,buttonType:""});
      const [toast,setToast] = useState({visible:false,message:""})
      const [openModal, setOpenModal] = useState({display:false,message:"",buttonType:"",data:null})
      const [deletePayload, setDeletePayload] = useState(null)
      const [textareaValue, setTextareaValue] = useState("");
const [filter, setFilter] = useState("OPEN");

const defaultTheme = createTheme();

  
      const headers = {
        Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
      };
      
      const url = `${baseUrl}/punish/v1/punishments`;
      

  
  useEffect(()=>{
      setSort(filter)
      
  },[filter])
  
      useEffect(() => {
        axios
          .get(url, { headers }) // Pass the headers option with the JWT token
          .then(function (response) {
            const sortedData = response.data.sort((a, b) => new Date(a.timeCreated) - new Date(b.timeCreated));
            if(roleType==="teacher"){
              const sortedByRole = sortedData.filter(x=>x.teacherEmail === sessionStorage.getItem("email"))
              setListOfPunishments(sortedByRole);   
            
            }
            else{
              const sortedByRole = sortedData;
              setListOfPunishments(sortedByRole);        

            }
      })
          .catch(function (error) {
            console.log(error);
          });
      }, [ toast.visible]);


      let data = (sort === "ALL")? listOfPunishments: listOfPunishments.filter((x)=> x.status === sort);
  console.log(data)
      data = data.filter((record) => record.infraction.infractionLevel=== "3");      
      console.log(data)

      const hasScroll = data.length > 10;
  
      const calculateDaysSince = (dateCreated) => {
        const currentDate = new Date();
        const createdDate = new Date(dateCreated);
      
        // Set both dates to UTC
        currentDate.setUTCHours(0, 0, 0, 0);
        createdDate.setUTCHours(0, 0, 0, 0);
      
        const timeDifference = currentDate - createdDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return daysDifference;
      };


      const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
      };


      const handleFilterChange = (event) =>{
        setFilter(event.target.value)
      }
    
      const filterOptions = [
        {value:"ALL", label:"All"},
        {value:"OPEN", label:"Open"},
        {value:"CLOSED", label:"Closed"},
        {value:"CFR", label:"CFR"},
      ]

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setToast({visible:false,message:""});
      };

      const handleClosePunishment = (obj) =>{
        setLoadingPunishmentId({id:obj.punishmentId,buttonType:"close"})
        const url = `${baseUrl}/punish/v1/close/${obj.punishmentId}`;
        axios
        .post(url,[textareaValue], { headers }) // Pass the headers option with the JWT token
        .then(function (response) {
          console.log(response)
          setToast({visible:true,message:"Your Referral was closed"})

        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(()=>{
          setOpenModal({display:false,message:""})
          setTimeout(()=>{
            setToast({visible:false,message:""})
            setLoadingPunishmentId({id:null,buttonType:""})

          },1000)
        }

        );
    };



  

  

      return (
          <>



    {openModal.display && <div className="modal-overlay">
    <div className="modal-content">
      <div className='modal-header'>
        <h3>{openModal.message}</h3>
        <div className='answer-container'>
        {openModal.data.infraction.infractionDescription.map((item, index) =>{ 
          if(index > 1){
            const record = item.split(",")
            const question = record[0].replace("StudentAnswer(question=","");
            const answer = record[1].replace("answer=","").replace(")","");
            return (
              <div key={index} style={{display:"flex", flexDirection:"row",border:"1px solid black"}}>
                <div style={{backgroundColor:"grey",minHeight:"15px", width:"30%"}}>
                  <strong>Question:</strong> {question}
                </div>
                <div style={{color:"black",backgroundColor:"lightBlue",minHeight:"50px",width:"70%",textAlign:"left", paddingLeft:"10px"}}>
                  <strong>Answer:</strong> {answer}
                </div>
              </div>
            );

          }

    })}
    </div>
            </div>
      <div className='modal-body'>
      {/* <textarea 
          value={textareaValue}       // Set the value of the textarea to the state variable
          onChange={handleTextareaChange} // Handle changes to the textarea
      className="multi-line-input" 
      placeholder="Enter additional comments"
      rows={4} // This sets the initial height to show 4 rows
    ></textarea> */}
      </div>
      <div className='modal-buttons'>
  
        <button onClick={() => {
          setOpenModal({display:false,message:""})
          setTextareaValue("")}}>Cancel</button>
       <button disabled={textareaValue.length===""} style={{backgroundColor:textareaValue===""?"grey":"orange"}} onClick={() => handleClosePunishment(deletePayload)}>Close</button>
  
      </div>
    </div>
  </div>}

  



          
          <Select
      sx={{ width: '100%',backgroundColor:"white"}}

  labelId="filterSelected"
  value={filter}
  onChange={handleFilterChange}
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
  MenuProps={"MenuProps"}
>
  {filterOptions.map((name) => (
    <MenuItem
      key={name.value}
      value={name.value}
    >
      {name.label}
    </MenuItem>
  ))}

</Select>

          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={toast.visible} autoHideDuration={6000} onClose={handleClose}>
  <Alert Close={handleClose} severity="success" sx={{ width: '100%' }}>
    {toast.message}
  </Alert>
</Snackbar>
          <TableContainer component={Paper} style={{ maxHeight: hasScroll ? '75vh' : 'auto', overflowY: hasScroll ? 'scroll' : 'visible' }}>
          <Table>
          <TableHead>
          <TableRow>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
              Name
            </TableCell>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
             Referral Type
            </TableCell>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
              Description
            </TableCell>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
              Level
            </TableCell>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
             Status
            </TableCell>
          
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
             Action
            </TableCell>
   
          </TableRow>
        </TableHead>
            <TableBody>
              {data.length > 0 ? (
                data.map((x, key) => {
                  const days = calculateDaysSince(x.timeCreated);
  
                  return (
                    <TableRow
  
                      key={key}
                    >
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <AccountCircleIcon
                            style={{
                              fontSize: '2rem',  // Adjust the size as needed
                              color: 'rgb(25, 118, 210)', // Change the color to blue
                            }}
                          />
                          <span>{x.student.firstName} {x.student.lastName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{x.infraction.infractionName}</TableCell>
                      <TableCell style={{width:"75px"}}>{x.infraction.infractionDescription[1]}</TableCell>
                      <TableCell>{x.infraction.infractionLevel}</TableCell>
                      <TableCell>
  <div 
  className={`status-tag ${days >= 4 ? "tag-critical" : days >= 3 ? "tag-danger" : days >= 2 ? "tag-warning" : "tag-good"}`}
  >
    {x.status}
  </div>
</TableCell>

                      <TableCell>
                        <div className='level-three-button-container'>
                     
  {x.status == "OPEN" ?  <><button className='level-three-buttons' onClick={() => {  setOpenModal({display:true,message:"Please Review Student Answers",buttonType:"close",data: x})
  setDeletePayload(x)  }}>
    {(loadingPunihsmentId.id === x.punishmentId && loadingPunihsmentId.buttonType==="close") ? (
      <CircularProgress style={{height:"20px", width:"20px"}} color="secondary" />
    ) : (
     <div>Review</div>
    )}
  </button>

  <button className='level-three-buttons' style={{backgroundColor:"red"}} onClick={() => {   setOpenModal({display:true,message:"Please provide brief explaination of why you will delete the record",buttonType:"delete"})
  setDeletePayload(x) }}>
    {(loadingPunihsmentId.id === x.punishmentId && loadingPunihsmentId.buttonType==="delete") ? (
      <CircularProgress style={{height:"20px", width:"20px"}} color="secondary" />
    ) : (
      <DeleteForeverIcon/>
    )}
  </button></> : <> <button style={{height:"45px", width:"90px",backgroundColor:"red"}} onClick={() => {   setOpenModal({display:true,message:"Please provide brief explaination of why you will delete the record",buttonType:"delete"})
  setDeletePayload(x) }}>
    {(loadingPunihsmentId.id === x.punishmentId && loadingPunihsmentId.buttonType==="delete") ? (
      <CircularProgress style={{height:"20px", width:"20px"}} color="secondary" />
    ) : (
      <DeleteForeverIcon/>
    )}
  </button></>}  
  </div>                    
 

</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan="5">No open assignments found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

export default LevelThreePanel;