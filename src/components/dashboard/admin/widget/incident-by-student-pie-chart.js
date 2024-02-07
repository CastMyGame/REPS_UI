import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import './CustomPieChart.css'
import { baseUrl } from '../../../../utils/jsonData';
import axios from 'axios';

export const IncidentByStudentPieChart = ({ data = [] }) => {

  const [writeUps,setWriteUps] = useState([])

  // const filterData = data.filter()
  const uniqueStudents = {};
  const totalIncidents = data.length;

  const headers = {
    Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
  };
  
  const url = `${baseUrl}/punish/v1/writeUps`;
  

  useEffect(() => {
    axios
      .get(url, { headers }) // Pass the headers option with the JWT token
      .then(function (response) {
        setWriteUps(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);


  // Get Unique Students Info
  writeUps.forEach(item => {
    const studentId = item.student.studentIdNumber;
    uniqueStudents[studentId] = (uniqueStudents[studentId] || 0) + 1;
  });

  const studentsWithIncidentsList = Object.entries(uniqueStudents).map(([studentId, incidents]) => {
    const { firstName, lastName } = writeUps.find(item => item.student.studentIdNumber === studentId).student;
    return {
      studentId,
      firstName,
      lastName,
      incidents,
      percent: ((incidents / totalIncidents) * 100).toFixed(2),
    };
  });


const meetsTres = studentsWithIncidentsList.filter(ind=> parseFloat(ind.percent)>5.00).sort((a, b) => b.incidents - a.incidents);
const otherNotMeetingTreshold = studentsWithIncidentsList.filter(ind=> parseFloat(ind.percent) <= 5.00).sort((a, b) => b.incidents - a.incidents);

const modifiedList = [
  ...meetsTres,
  {
    studentId: "001",
    firstName: "Other",
    lastName: "",
    incidents: otherNotMeetingTreshold.reduce((acc, student) => {
      return acc + student.incidents;
    }, 0).toFixed(2),
    percent: otherNotMeetingTreshold.reduce((acc, student) => {
      return acc + parseFloat(student.percent);
    }, 0).toFixed(2) // Closing parenthesis was added here
  }
];



  // Custom styles for the scrollable container
  const scrollableContainerStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    paddingRight: '10px', // Adjust as needed to make room for the scrollbar
  };

  const generateLegendColor = (index) => {
    const colors = ['#02B2AF', '#2E96FF', '#B800D8', '#60009B', '#2731C8', '#03008D'];
    return colors[index % colors.length];
  };

  return (
    <>
      <Typography>Incident By Student (Week)</Typography>
      <div style={{ display: 'flex' }}>
        <PieChart
          series={[
            {
              data: modifiedList.map((student, index) => ({
                id: index, value: parseFloat(student.percent), label: `${student.firstName} ${student.lastName} (${student.studentId.substring(0, 5)})`
              })),
              arcLabel: (item) => `(${parseFloat(item.value)}%)`,
              arcLabelMinAngle: 45,
            },
          ]}
         
          width={300}
          height={300}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          // Use slotProps.legend instead of legend prop
          slotProps={{ legend: { hidden: true } }}
          // slotProps={{
          //   legend:{

          //     vertical:'middle',horizontal:"right"}}}
          />
        {/* Scrollable container for labels */}
        <div className="legend">
      {modifiedList.map((student, index) => (
        <div key={index} className="legend-item">
          <div className={`legend-color legend-color-${index + 1}`} style={{ backgroundColor: generateLegendColor(index) }}></div>
          <span>{`${student.firstName} ${student.lastName} (${student.studentId.substring(0, 5)})`}</span>
        </div>
      ))}
    </div>
      </div>
    </>
  );
};
