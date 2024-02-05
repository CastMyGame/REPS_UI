import react, {useState,useEffect,useRef} from 'react'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper,Card } from '@mui/material';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios"
import { baseUrl } from '../../../utils/jsonData'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IncidentByStudentPieChart } from './widget/incident-by-student-pie-chart';

   const AdminTeacherPanel = () => {
	const [data, setData]= useState([])
  const [teacherProfileModal,setTeacherProfileModal] = useState(false)
  const [teacherProfileData, setTeacherProfileData] = useState([])
  const [activeTeacher, setActiveTeacher] = useState();


    const headers = {
      Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
    };
    
    const url = `${baseUrl}/employees/v1/employees/TEACHER`;
    

    useEffect(() => {
      axios
        .get(url, { headers }) // Pass the headers option with the JWT token
        .then(function (response) {
          setData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, []);




//Fetch Teacher Data 

const fetchTeacherData = (teacherEmail) =>{
  //Replace with teacherendpoint
  const punishUrl= `${baseUrl}/punish/v1/punishments/`;
  axios
  .get(punishUrl, { headers }) // Pass the headers option with the JWT token
  .then(function (response) {

    const data = response.data;
    console.log(teacherEmail)
    const newData = data.filter(((x)=> x.teacherEmail === teacherEmail));
    console.log("find me ", newData)
    setTeacherProfileData(newData);
    setTeacherProfileModal(true);  
    
console.log(newData)
  })
  .catch(function (error) {
    console.log(error);
  });
}
  

const handleProfileClick = (x) =>{
  setActiveTeacher(x)
  fetchTeacherData(x.email)
  setTeacherProfileModal(true)
}

const pdfRef = useRef();

const generatePDF = (activeTeacher,studentData) => {
  const pdf = new jsPDF();
    // Add logo
    const logoWidth = 50; // Adjust the width of the logo as needed
    const logoHeight = 50; // Adjust the height of the logo as needed
    const logoX = 130; // Adjust the X coordinate of the logo as needed
    const logoY = 15; // Adjust the Y coordinate of the logo as needed
    
//https://medium.com/dont-leave-me-out-in-the-code/5-steps-to-create-a-pdf-in-react-using-jspdf-1af182b56cee
//Resource for adding image and how pdf text works
    var image = new Image();
    image.src = "/burke-logo.png";
    pdf.addImage(image, 'PNG', logoX,logoY , logoWidth, logoHeight);

  // Add student details section
  pdf.setFontSize(12)
  pdf.rect(15,15,180,50)
  pdf.text(`${activeTeacher.firstName} ${activeTeacher.lastName}`, 20, 20);
  pdf.text(`Email: ${activeTeacher.email}`, 20, 30);
  // pdf.text(`Phone: ${studentData[0].student.studentPhoneNumber}`, 20, 40);
  // pdf.text(`Grade: ${studentData[0].student.grade}`, 20, 50);
  // pdf.text(`Address: ${studentData[0].student.address}`, 20, 60);

  // Add punishment details table
  pdf.autoTable({
    startY: 70, // Adjust the Y-coordinate as needed
    head: [['Status', 'Description', 'Date', 'Infraction']],
    body: studentData.map((student) => [
      student.status,
      student.infraction.infractionDescription,
      student.timeCreated,
      student.infraction.infractionName,
    ]),
  });

  // Save or open the PDF
  pdf.save('teacher_report.pdf');
};


    const hasScroll = data.length > 10;
    return (
        <>
          {(teacherProfileModal && teacherProfileData) && (


<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}} className="modal-overlay">
  <div style={{
    height: '100%',
    width: '80%',
    position: 'relative',
    backgroundColor: 'white',  // Adjust background color as needed
    padding: '20px',          // Adjust padding as needed
    borderRadius: '8px',      // Add border radius as needed
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Add box shadow as needed
  }} className="modal-content">
      <div className='modal-header'>
        <div style={{display:"flex", flexDirection:"row"}}>
            <div style={{width:"40%"}} className='box-left'>
                <div>
                <h4 style={{ textAlign: "left" }}>{activeTeacher.firstName} {activeTeacher.lastName}</h4>
                  </div>
                  <div style={{ textAlign: "left" }}>Email: {activeTeacher.email}</div>
                <div>
       
            </div>
            </div>
            <div style={{width:"0%"}} className='box-center'>

            </div>
            <div style={{width:"60%"}} className='box-right'>
                              <IncidentByStudentPieChart data={teacherProfileData}/>



</div>
{/* 
            <div style={{  width: "100px", height: "100px", marginLeft: "auto" }} className='box-right'>
        <AccountBoxIcon sx={{ fontSize: 100 }}/>
            </div> */}
      
      </div>
      </div>

{data ? 
    <div style={{height:"320px"}}className='modal-body-student'>
  <TableContainer style={{height:"300px",backgroundColor:"white" }}>
    <Table stickyHeader>
    <TableHead>
      <TableRow>
        <TableCell style={{ width: "25%" }}>
          Status
        </TableCell>
        <TableCell style={{ width: "25%" }}>
          Description
        </TableCell>
        <TableCell style={{ width: "25%" }}>
          Date
        </TableCell>
        <TableCell style={{ width: "25%" }}>
          Infraction
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody >
      {teacherProfileData.map((teacher, index) => (
        <TableRow style={{ background: index % 2 === 0 ? "lightgrey" : "white" }} key={index}>
          <TableCell style={{ width: "25%" }}>
            {teacher.status}
          </TableCell>
          <TableCell style={{ width: "25%" }}>
            {teacher.infraction.infractionDescription}
          </TableCell>
          <TableCell style={{ width: "25%" }}>
            {teacher.timeCreated}
          </TableCell>
          <TableCell style={{ width: "25%" }}>
            {teacher.infraction.infractionName}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
    </Table>
  </TableContainer>
</div>
: <div>No Data available</div>}


      <div style={{padding:"10px"}} className='modal-buttons'>
        <button onClick={() => { setTeacherProfileModal(false) }}>Cancel</button>
        <button onClick={()=>{generatePDF(activeTeacher,teacherProfileData)}}style={{backgroundColor:"#CF9FFF"}} >Print</button>

      </div>
    </div>
  </div>
)}
         <div style={{backgroundColor:"rgb(25, 118, 210)",marginTop:"10px", marginBlock:"5px"}}>
   <Typography color="white" variant="h6" style={{ flexGrow: 1, outline:"1px solid  white",padding:
"5px"}}>
   Teachers
        </Typography>
        </div>
   
        <TableContainer component={Paper} style={{ maxHeight: hasScroll ? '720px' : 'auto', overflowY: hasScroll ? 'scroll' : 'visible' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
              Name
            </TableCell>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
             Email
            </TableCell>
            <TableCell variant="head" style={{ fontWeight: 'bold' }}>
              Role
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>


{console.log(data)}

          {data.length > 0 ? (
            data.map((x, key) => (
<TableRow key={key} onClick={() => {handleProfileClick(x)}}>
  <TableCell>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <AccountCircleIcon
        style={{
          fontSize: '2rem',  // Adjust the size as needed
          color: 'rgb(25, 118, 210)', // Change the color to blue
        }}
      />
      <span>{x.firstName} {x.lastName}</span>
    </div>
  </TableCell>
  <TableCell>{x.email}</TableCell>
  <TableCell>{String(x.roles.map(x=>x.role))}</TableCell>

</TableRow>

            ))
          ) : (
            <TableRow>
              <TableCell colSpan="5">No open assignments found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
   
    </TableContainer>


    </>
    )
    }


    export default AdminTeacherPanel;


