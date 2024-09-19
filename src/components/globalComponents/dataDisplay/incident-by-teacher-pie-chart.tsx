import React from "react";
import { AdminOverviewDto, TeacherDto } from "src/types/responses";
import { Employee } from "src/types/school";
import ReactEcharts from "echarts-for-react";
import {
  extractDataByWeek,
  getCurrentWeekOfYear,
} from "src/helperFunctions/helperFunctions";

export const IncidentByTeacherPieChart: React.FC<AdminOverviewDto> = ({
  writeUpResponse = [],
  officeReferrals = [],
  teachers = [],
}) => {
  const currentWeek = getCurrentWeekOfYear();
  //grab total indcidents
  const totalIncidents = (writeUpResponse as TeacherDto[]).length;

  let uniqueTeachers: Record<string, number> = {};

  // Filter data for the current week
  const weeklyTmIncidents = extractDataByWeek(currentWeek, writeUpResponse as TeacherDto[]);
  const weeklyOmIncidents = extractDataByWeek(currentWeek, officeReferrals as TeacherDto[]);

  // Combine both arrays into one
  const combinedIncidents = [...weeklyTmIncidents, ...weeklyOmIncidents];

  // Get Unique Teachers Info by aggregating incidents by teacherEmail
  const teacherIncidentMap = combinedIncidents.reduce<Record<string, number>>((acc, item) => {
    const teacherEmail = item.teacherEmail;
    acc[teacherEmail] = (acc[teacherEmail] || 0) + 1;
    return acc;
  }, {});

  // Map over unique teacher emails and get the incidents and teacher details
  const teachersWithIncidentsList = Object.entries(teacherIncidentMap).map(
    ([teacherEmail, incidents]) => {
      // Find the first occurrence of the teacher in the combined incidents list
      const teacher = combinedIncidents.find(
        (item) => item.teacherEmail === teacherEmail
      );

      // Find the teacher details from the teachers list (Employee)
      const employee = (teachers as Employee[]).find(
        (teacher) => teacher.email === teacherEmail
      );
      const teacherFirstName = employee?.firstName || "Unknown";
      const teacherLastName = employee?.lastName || "Unknown";

      return {
        teacherEmail,
        teacherFirstName,
        teacherLastName,
        incidents: Number(incidents),
        percent: ((Number(incidents) / combinedIncidents.length) * 100).toFixed(2),
      };
    }
  );

  const option = {
    title: {
      text: "Total Referrals by Teacher",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      align: "auto",
      left: "left",
      top: "10%",
    },
    series: [
      {
        type: "pie",
        radius: "80%",
        label: {
          show: false,
        },
        data: [
          ...teachersWithIncidentsList.map((teacher) => ({
            value: teacher.incidents,
            name: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
          })),
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div>
      <ReactEcharts option={option} />
    </div>
  );
};
