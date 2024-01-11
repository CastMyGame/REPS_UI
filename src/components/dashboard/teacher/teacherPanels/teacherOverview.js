import react, {useState,useEffect} from 'react'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios"
import { baseUrl } from '../../../../utils/jsonData'
import StudentProfile from '../../../StudentProfile';
import IncidentsByStudentTable from './incidentsByStudentTable';
import TotalReferalByWeek from './referralsByWeek';
import TotalStudentReferredByWeek from './numberOfStudentReferralsByWeek';
import Card from '@mui/material/Card';
import ReferralByBehavior from './referralsByBehavior';
import { fetchDataFromApi } from '../../global/helperFunctions';
import TeacherInfractionOverPeriodBarChart from './teacherInfractionPeriodBarChart';
import { PieChartParentCommunication } from './pieChartParentCommunication';
import RecentIncidents from './studentRecentIncidents';

   const TeacherOverviewPanel = ({data = []}) => {
	const [listOfStudents, setListOfStudents]= useState([])
  const [studentDisplay, setStudentDisplay] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  
  


    return (
        <>
         <div style={{backgroundColor:"rgb(25, 118, 210)",marginTop:"10px", marginBlock:"5px"}}>
   <Typography color="white" variant="h6" style={{ flexGrow: 1, outline:"1px solid  white",padding:
"5px"}}>
   Week At a Glance
        </Typography>
        </div>


  <div className='overview-row'>
    <div className='teacher-widget-half'>
      <Card>
    <div style={{ textAlign:"center",marginTop:"10px"}}>
<PieChartParentCommunication data={data}/>


    </div>
    </Card>
    </div>
    <div className='teacher-widget-half'>
      <div className='infraction-bar-chart'>
        <Card>
<TeacherInfractionOverPeriodBarChart data={data}/>
</Card>
      </div>
  


</div>

  </div>

  <div style={{backgroundColor:"rgb(25, 118, 210)",marginTop:"10px", marginBlock:"5px"}}>
   <Typography color="white" variant="h6" style={{ flexGrow: 1, outline:"1px solid  white",padding:
"5px"}}>
  Students of Concern
        </Typography>
        </div>


  <div className='overview-row'>
    <div className='teacher-widget-half'>
<div className='studentIncidentTable'>
<Card style={{padding:"5px"}}>
    <IncidentsByStudentTable data={data}/>
</Card>


</div>

    </div>
    <div className='teacher-widget-half'>
<Card style={{padding:"5px"}}>
<RecentIncidents data={data}/>
</Card>

</div>

  </div>

  <div style={{backgroundColor:"rgb(25, 118, 210)",marginTop:"10px", marginBlock:"5px"}}>
   <Typography color="white" variant="h6" style={{ flexGrow: 1, outline:"1px solid  white",padding:
"5px"}}>
  Longitudinal Reports
        </Typography>
        </div>


  <div className='overview-row'>
    <div className='teacher-widget-third'>
    <Card style={{padding:"5px"}}>

      <TotalReferalByWeek data={data}/>

      </Card>



    </div>
    <div className='teacher-widget-third'>
    <Card style={{padding:"5px"}}>
<TotalStudentReferredByWeek data={data}/>
</Card>
</div>

<div className='teacher-widget-third'>
<Card style={{padding:"5px"}}>
<ReferralByBehavior data={data}/>
</Card>

</div>

  </div>

  
    </>
    )
    }


    export default TeacherOverviewPanel;


