import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import TotalReferralByWeek from "../teacher/teacherPanels/charts/lineCharts/referralsByWeek";
import TotalStudentReferredByWeek from "../teacher/teacherPanels/charts/lineCharts/numberOfStudentReferralsByWeek";
import ReferralByBehavior from "../teacher/teacherPanels/charts/lineCharts/referralsByBehavior";
import IncidentsByStudentTable from "../../components/globalComponents/dataDisplay/incidentsByStudentTable";
import TeacherInfractionOverPeriodBarChart from "../teacher/teacherPanels/charts/barChart/teacherInfractionPeriodBarChart";
import { IncidentByTeacherPieChart } from "../../components/globalComponents/dataDisplay/incident-by-teacher-pie-chart";
import { Top5TeacherRatioTable } from "../../components/globalComponents/dataDisplay/top-5-ratio-table";
import { WorseClassTable } from "../../components/globalComponents/dataDisplay/top-class-with-write-up";
import { IncidentByStudentPieChart } from "../../components/globalComponents/dataDisplay/incident-by-student-pie-chart";
import "./admin.css";
import ShoutOuts from "../../components/globalComponents/shoutOuts";

const AdminOverviewPanel = ({ data = [] }) => {
  //Fetch Data to Prop Drill to Componetns

  let punishments = data.punishmentResponse;
  let teacherData = data.teachers;

  const weeklyDataIncSOBxConcern = punishments.filter((x) => {
    const currentDate = new Date();
    const itemDate = new Date(x.timeCreated);
    const sevenDaysAgo = new Date(
      currentDate.setDate(currentDate.getDate() - 7)
    );
    return itemDate > sevenDaysAgo;
  });

  return (
    <>
      <div className="teacher-overview-first">
        <Card variant="outlined">
          <ShoutOuts data={data} />
        </Card>
      </div>

      <div className="card-title">
        <Typography
          color="white"
          variant="h6"
          style={{ flexGrow: 1, outline: "1px solid  white", padding: "5px" }}
        >
          Week At a Glance
        </Typography>
      </div>

      <div className="overview-row">
        <div className="card-overview-third">
          <IncidentByStudentPieChart writeUps={data.writeUpResponse} />
        </div>

        <div className="card-overview-third">
          <IncidentsByStudentTable writeUps={data.writeUpResponse} />
        </div>

        <div className="card-overview-third">
          <TeacherInfractionOverPeriodBarChart
            data={weeklyDataIncSOBxConcern}
          />
        </div>
      </div>

      <div className="card-title">
        <Typography
          color="white"
          variant="h6"
          style={{ flexGrow: 1, outline: "1px solid  white", padding: "5px" }}
        >
          Coaching Information
        </Typography>
      </div>

      <div className="overview-row">
        <div className="card-overview-third">
          <IncidentByTeacherPieChart
            data={data.writeUpResponse}
            teacherData={teacherData}
          />
        </div>

        <div className="card-overview-third">
          {data.teachers && (
            <Top5TeacherRatioTable
              data={punishments}
              teacherData={teacherData}
            />
          )}
        </div>

        <div className="card-overview-third">
          <WorseClassTable data={punishments} teacherData={teacherData} />
        </div>
      </div>

      <div className="card-title">
        <Typography
          color="white"
          variant="h6"
          style={{ flexGrow: 1, outline: "1px solid  white", padding: "5px" }}
        >
          Longitudinal Reports
        </Typography>
      </div>

      <div className="overview-row">
        <div className="card-overview-third">
          <TotalReferralByWeek data={punishments} />
        </div>

        <div className="card-overview-third">
          <TotalStudentReferredByWeek data={punishments} />
        </div>

        <div className="card-overview-third">
          <ReferralByBehavior data={punishments} />
        </div>
      </div>
    </>
  );
};

export default AdminOverviewPanel;
