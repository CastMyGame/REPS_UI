import react, {useState,useEffect} from 'react'
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, getImageListItemBarUtilityClass } from '@mui/material';
import { dateCreateFormat } from '../../../../global/helperFunctions';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
  
const AdminShoutOut = ({data = []}) => {
    const [barOpen,setBarOpen] = useState(true)
  
    //We need to fix the cfr issues
    console.log("shoutout", data)
	  const shoutOutData = data
    .filter(punish => punish.punishment.infractionName === "Positive Behavior Shout Out!");
      
    const hasScroll = shoutOutData.length > 2;

    shoutOutData.sort((a,b) => b.punishment.timeCreated - a.punishment.timeCreated ? 1 : -1)

    return (
!barOpen ?  


<div className='shout-out-bar-container'>
<div className="bar-content">
<ArrowDropDownCircleIcon 
className='arrowIcon'
style={{ transform: 'rotate(0deg)', cursor: 'pointer', marginTop:"3px" }}
onClick={() => setBarOpen(true)}
/> <h5 style={{marginLeft:"20px"}}>Positive Behavior</h5>  </div>

</div>

 :
        <>
<div className='bar-container open'>
<div className="bar-content">
<ArrowDropDownCircleIcon 
className="arrowIcon"
style={{ transform: 'rotate(180deg)', cursor: 'pointer', marginTop:"3px" }}
onClick={() => setBarOpen(false)}
/> <h5 style={{marginLeft:"20px"}}>Positive Behavior</h5>  </div>

</div>




<TableContainer  style={{ width:"100%",height: hasScroll ? '200px' : 'auto', overflowY: hasScroll ? 'scroll' : 'visible' }}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell variant="head" style={{ fontWeight: 'bold', width: '20%', fontSize: '2rem' }}>
          Created On
        </TableCell>
        <TableCell variant="head" style={{ fontWeight: 'bold', width: '20%', fontSize: '2rem' }}>
          Student
        </TableCell>
        <TableCell variant="head" style={{ fontWeight: 'bold', width: '30%', fontSize: '2rem' }}>
          Shout Outs
        </TableCell>
        <TableCell variant="head" style={{ fontWeight: 'bold', width: '30%', fontSize: '2rem' }}>
          Created By
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {shoutOutData.length > 0 ? (
        shoutOutData.map((x, key) => (
          <TableRow key={key}>
            <TableCell style={{ width: '20%', fontSize: '1.25rem' }}>{dateCreateFormat(x.punishment.timeCreated)}</TableCell>
            <TableCell style={{ width: '20%', fontSize: '1.25rem' }}>{x.firstName} {x.lastName}</TableCell>
            <TableCell style={{ width: '30%', fontSize: '1.25rem' }}>
  {x.punishment.infractionDescription}
</TableCell>            
<TableCell style={{ width: '30%', fontSize: '1.25rem' }}>{x.punishment.teacherEmail}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan="4">No Shout Out Yet, but I'm sure it's coming!</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>    </>
    )
    }

    export default AdminShoutOut;

