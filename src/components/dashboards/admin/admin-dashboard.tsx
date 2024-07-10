import { useCallback, useEffect, useState } from "react";
import "./admin-dashboard.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SendIcon from "@mui/icons-material/Send";
import SchedulerComponent from "../../globalComponents/modals/scheduler/scheduler";
import NotesComponent from "../../globalComponents/modals/notes/notes";
import SendResourcesComponent from "../../globalComponents/modals/resources/resources";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import axios from "axios";
import { baseUrl } from "src/utils/jsonData";
import { DateTime } from "luxon";
import {
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { handleLogout } from "src/utils/helperFunctions";
import { categoryBadgeGenerator, dateCreateFormat } from "src/helperFunctions/helperFunctions";
import { get } from "src/utils/api/api";
import { StudentDetailsModal } from "src/components/globalComponents/components/modals/studentDetailsModal";
import NavbarCustom from "src/components/globalComponents/modals/navBar/navBar";
import CreatePunishmentPanel from "src/components/globalComponents/modals/functions/createPunishmentPanel.js";
import { TeacherDetailsModal } from "src/components/globalComponents/components/modals/teacherDetailsModal ";
import {
  GuidanceResponse,
  StudentResponse,
  TeacherResponse,
} from "src/types/responses";
import { guidanceButtonData } from "src/types/navbars";
import { BEHAVIORAL, CLERICAL } from "src/types/constants";
import ShoutOutReportGeneral from "src/components/globalComponents/shoutOutReportGeneral";
import DetentionWidget from "src/components/globalComponents/detentionWidget";
import ISSWidget from "src/components/globalComponents/issWidget";
import { IncidentByStudentPieChart } from "src/components/globalComponents/dataDisplay/incident-by-student-pie-chart";
import IncidentsByStudentTable from "src/components/globalComponents/dataDisplay/incidentsByStudentTable";
import TeacherInfractionOverPeriodBarChart from "src/components/globalComponents/dataDisplay/teacherInfractionPeriodBarChart";

const AdminDashboard = () => {
  const [displayPicker, setDisplayPicker] = useState(false);
  const [displayNotes, setDisplayNotes] = useState(false);
  const [displayResources, setDisplayResources] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const [updatePage, setUpdatePage] = useState(false);
  const [data, setData] = useState<any>([]);
  const [panelName, setPanelName] = useState("overview");
  const [dtoData,setDtoData] =useState<any>([])

  //Indicators - UI display of processing e.g. loading wheel
  const [closeIndicator, setCloseIndicator] = useState(false);

  const [openTask, setOpenTask] = useState<any>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [guidanceFilter, setGuidanceFilter] = useState<boolean>(false);
  const [displayStudentModal, setDisplayStudentModal] = useState(false);
  const [displayTeacherModal, setDisplayTeacherModal] = useState(false);
  

  //Toggles
  const [taskType, setTaskType] = useState("OPEN");

  const handleUpdatePage = () => {
    setTimeout(() => {
      setUpdatePage((prev: any) => !prev);
    }, 500);
  };

  const handleTaskTypeChange = (event: any, newTaskType: string) => {
    if (newTaskType !== null) {
      setTaskType(newTaskType);
    }
  };

  const handleCategoryChange = (event: any, category: string) => {
    if (category !== null) {
      setCategoryFilter(category);
    }
  };

  const handleStatusChange = (status: any, id: string) => {
    const payload = { status: status };
    const headers = {
      Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
    };

    const url = `${baseUrl}/punish/v1/guidance/status/${id}`;
    axios
      .put(url, payload, { headers })
      .then((response) => {
        console.log(response.data);
        handleUpdatePage();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReferralFilterChange = (filterBoolean: boolean) => {
    if (filterBoolean !== null) {
      setGuidanceFilter(filterBoolean);
      setUpdatePage((prev) => !prev);
    }
  };

  const handleChange = (event: any) => {
    handleReferralFilterChange(event.target.checked);
  };

  //Status Change Actions for Closing and Scheduling Task

  const handlePunishmentClose = (id: string) => {
    setCloseIndicator(true);

    const headers = {
      Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
    };

    const url = `${baseUrl}/punish/v1/close/${id}`;
    axios
      .post(url, [], { headers })
      .then((response) => {
        console.log(response.data);
        setCloseIndicator(false);
        handleUpdatePage();
        window.alert(`You have Closed Record: ${id} `);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //CALLBACKS
  const fetchPunishmentData = useCallback(async () => {
    try {
      let result;
      if (taskType === "ALL") {
        result = await get("punish/v1/punishments/");
      } else {
        result = await get(`punish/v1/punishStatus/${taskType}`);
      }
      setData(
        result.filter((item: any) => {
          return !item.guidance;
        })
      );
    } catch (err) {
      console.error("Error Fetching Data: ", err);
    }
  }, [taskType, updatePage]);

  const fetchStudentData = useCallback(async () => {
    try {
      let result = await get("student/v1/allStudents/");
      setData(result);
    } catch (err) {
      console.error("Error Fetching Data: ", err);
    }
  }, [taskType, updatePage]);

  const fetchTeacherData = useCallback(async () => {
    try {
      let result = await get("employees/v1/employees/TEACHER");
      setData(result);
    } catch (err) {
      console.error("Error Fetching Data: ", err);
    }
  }, [taskType, updatePage]);

  const fetchOfficeReferrals = useCallback(async () => {
    try {
      const result = await get(
        `officeReferral/v1/punishments`
      );
      if (Array.isArray(result)) {
        if (categoryFilter === "CLERICAL") {
          setData(
            result.filter((item: { infractionName: string }) =>
              CLERICAL.includes(item.infractionName)
            )
          );
        } else if (categoryFilter === "BEHAVIORAL") {
          setData(
            result.filter((item: { infractionName: string }) =>
              BEHAVIORAL.includes(item.infractionName)
            )
          );
        } else {
          setData(result);
        }
      } else {
        console.error("Fetched data is not an array.");
      }
    } catch (error) {
      console.error(error);
    }
  }, [taskType, guidanceFilter, categoryFilter, updatePage]);

  //Handle Functions
  const deleteRecord = (punishment: any) => {
    const headers = {
      Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
    };
    const url = `${baseUrl}/punish/v1/delete`;

    axios
      .delete(url, { data: punishment, headers }) // Pass the headers option with the JWT token
      .then(function (response) {
        console.log(response.data);
        setUpdatePage((prev) => !prev);
        window.alert(
          `You have Deleted Record: ${punishment.infractionName} ${punishment.studentEmail}`
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  };


  useEffect(() => {
    const fetchAnayliticDto = async () => {
      try {
        const result = await get("DTO/v1/AdminOverviewData");
        setDtoData(result);
      } catch (err) {
        console.error("Error Fetching Data: ", err);
      }
    };

    if (panelName === "overview") {
      fetchAnayliticDto();
    }
  }, [panelName]);

  useEffect(() => {
    if (panelName === "existing-parent-contact") {
      fetchPunishmentData();
    } else if (panelName === "overview") {
      fetchOfficeReferrals();
    } else if (panelName === "report-student") {
      fetchStudentData();
    } else if (panelName === "report-teacher") {
      fetchTeacherData();
    }
  }, [
    panelName,
    taskType,
    categoryFilter,
    guidanceFilter,
    updatePage,
    fetchPunishmentData,
    fetchOfficeReferrals,
    fetchStudentData,
    fetchTeacherData,
  ]);

  useEffect(() => {
    setTaskType("OPEN");
  }, [panelName]);

  //LOG OUT IF AUTHORIZATION IS NULL
  useEffect(() => {
    if (sessionStorage.getItem("Authorization") === null) {
      window.location.href = "/login";
    }
  }, []);

  const formatDate = (dateString: any) => {
    if (!dateString) {
      return "";
    }

    try {
      // Parse the ISO 8601 date string and format it to MM-dd-yyyy
      const date = DateTime.fromISO(dateString);
      if (date.isValid) {
        return date.toFormat("MM-dd-yyyy");
      } else {
        return dateString;
      }
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString;
    }
  };

  //Badge Generatores
  

  const statusBadgeGenerator = (status: string) => {
    if (status === "OPEN") {
      return (
        <div style={{ backgroundColor: "green" }} className="cat-badge">
          OPEN
        </div>
      );
    }

    if (status === "CLOSED") {
      return (
        <div style={{ backgroundColor: "red" }} className="cat-badge">
          CLOSED
        </div>
      );
    }

    if (status === "CFR") {
      return (
        <div style={{ backgroundColor: "orange" }} className="cat-badge">
          CFR
        </div>
      );
    }

    if (status === "BC") {
      return (
        <div style={{ backgroundColor: "purple" }} className="cat-badge">
          Behavioral
        </div>
      );
    }

    if (status === "SO") {
      return (
        <div style={{ backgroundColor: "blue" }} className="cat-badge">
          Shout Out
        </div>
      );
    }
  };

  // let punishments = dtoData.punishmentResponse;
  // let teacherData = dtoData.teachers;

  // const weeklyDataIncSOBxConcern = punishments.filter((x:any) => {
  //   const currentDate = new Date();
  //   const itemDate = new Date(x.timeCreated);
  //   const sevenDaysAgo = new Date(
  //     currentDate.setDate(currentDate.getDate() - 7)
  //   );
  //   return itemDate > sevenDaysAgo;
  // });


  return (
    <>
      {/* MODALS */}

      <div>
        {/* {modalType === "contact" && (
      <ContactUsModal setContactUsDisplayModal={true} contactUsDisplayModal={false} />
    )} */}

        {displayPicker && (
          <SchedulerComponent
            setDisplayModal={setDisplayPicker}
            activeTask={activeTask}
            setUpdatePage={setUpdatePage}
          />
        )}

        {displayNotes && (
          <NotesComponent
            setDisplayModal={setDisplayNotes}
            activeTask={activeTask}
            setUpdatePage={setUpdatePage}
            panelName={panelName}
          />
        )}

        {displayStudentModal && (
          <StudentDetailsModal
            studentEmail={activeTask}
            setDisplayModal={setDisplayStudentModal}
          />
        )}

        {displayTeacherModal && (
          <TeacherDetailsModal
            teacherEmail={activeTask}
            setDisplayModal={setDisplayTeacherModal}
          />
        )}

        {displayResources && (
          <SendResourcesComponent
            setDisplayModal={setDisplayResources}
            activeTask={activeTask}
            setUpdatePage={setUpdatePage}
          />
        )}

        <NavbarCustom
          setPanelName={setPanelName}
          buttonData={guidanceButtonData}
          setLogin={handleLogout}
        />
      </div>

      <div style={{ height: "100vh" }}>
      {panelName === "overview" && <div style={{padding:"10px 10px",width:"100%", height:"auto",backgroundColor:"lightGrey"}}><ShoutOutReportGeneral /></div>}

        <div
          style={{
            padding: "10px 10px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          className="panel-container"
        >

          <div className={`task-panel ${panelName !== "overview" && "full"}`}>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="toggles"
            >
              {panelName === "overview" && (<div style={{display:"flex",flexDirection:"column"}}>
                <div className="toggle-groups">
                  <ToggleButtonGroup
                    color="primary"
                    value={taskType}
                    exclusive
                    onChange={handleTaskTypeChange}
                    aria-label="Task Type"
                    sx={{
                      "& .MuiToggleButton-root": { height: 30, width: 70 },
                    }} // Custom height
                  >
                    <ToggleButton value="OPEN">Open</ToggleButton>
                    <ToggleButton value="CLOSED">Closed</ToggleButton>
                    <ToggleButton value="DORMANT">Dormant</ToggleButton>
                  </ToggleButtonGroup>

                  <ToggleButtonGroup
                    color="primary"
                    value={categoryFilter}
                    exclusive
                    onChange={handleCategoryChange}
                    aria-label="Category"
                    sx={{
                      "& .MuiToggleButton-root": {
                        height: 30,
                        width: 70,
                        marginTop: 2,
                      },
                    }} // Custom height
                  >
                    <ToggleButton value="CLERICAL">Clerical</ToggleButton>
                    <ToggleButton value="BEHAVIORAL">Behavioral</ToggleButton>
                    <ToggleButton value="">All</ToggleButton>
                  </ToggleButtonGroup>
                </div>
                </div>
              )}

              {panelName === "existing-parent-contact" && (
                <div className="toggle-groups">
                  <ToggleButtonGroup
                    color="primary"
                    value={taskType}
                    exclusive
                    onChange={handleTaskTypeChange}
                    aria-label="Task Type"
                    sx={{
                      "& .MuiToggleButton-root": { height: 30, width: 70 },
                    }} // Custom height
                  >
                    <ToggleButton value="OPEN">Open</ToggleButton>
                    <ToggleButton value="CLOSED">Closed</ToggleButton>
                    <ToggleButton value="CFR">CFR</ToggleButton>
                    <ToggleButton value="ALL">All</ToggleButton>
                  </ToggleButtonGroup>
                </div>
              )}

              <div className={`${panelName === "overview" ? "" : "none"}`}>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={guidanceFilter}
                      onChange={handleChange}
                      aria-label="Referral Filter"
                    />
                  }
                  label={guidanceFilter ? "My Referrals" : "All Referrals"}
                />
              </div>
            </div>
            {panelName === "existing-parent-contact" && (
              <div className="parent-contact-panel">
                <div>
                  {" "}
                  <h1 className="main-panel-title">Parent Contacts</h1>
                </div>
                {data.map((item: any, index: any) => {
                  return (
                    <div
                      className="task-card"
                      onClick={() => setActiveIndex(index)}
                      key={index}
                    >
                      <div className="tag">
                        <div className="color-stripe"></div>
                        <div className="tag-content">
                          <div className="index"> {index + 1}</div>
                          <div className="date">
                            {" "}
                            {dateCreateFormat(item?.followUpDate) ||
                              dateCreateFormat(item?.timeCreated)}
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="card-body-title">
                          {item.infractionName}
                        </div>
                        <div className="card-body-description">
                          {item.infractionDescription}
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="card-body-title">Created By</div>
                        <div className="card-body-description">
                          {item.teacherEmail}
                        </div>
                        <div>{statusBadgeGenerator(item.status)}</div>
                      </div>
                      <div className="action-container">
                        <div className="card-actions">
                          <div className="card-action-title">
                            {item.guidanceStatus === "CLOSED"
                              ? "Restore"
                              : " Complete"}
                          </div>
                          <div
                            onClick={() =>
                              handlePunishmentClose(item.punishmentId)
                            }
                            className={
                              closeIndicator && activeIndex === index
                                ? "check-box checked-fill "
                                : `check-box`
                            }
                          ></div>
                        </div>
                        <div className="card-actions">
                          <div className="card-action-title">Notes</div>
                          <div
                            className="clock-icon"
                            onClick={() => {
                              setDisplayNotes((prevState) => !prevState); // Toggle the state
                              setActiveTask(item.punishmentId);
                            }}
                          >
                            <NoteAddIcon
                              sx={{ fontSize: "20px", fontWeight: "bold" }}
                            />
                          </div>
                        </div>
                        <div className="card-actions">
                          <div className="card-action-title">Delete</div>
                          <div
                            className="clock-icon"
                            onClick={() => {
                              // setDisplayNotes((prevState) => !prevState); // Toggle the state
                              deleteRecord(item);
                            }}
                          >
                            <DeleteForeverIcon
                              sx={{ fontSize: "20px", fontWeight: "bold" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* TEACHER PANEL */}
            {panelName === "report-teacher" && (
              <div className="guidance-panel">
                <div>
                  {" "}
                  <h1 className="main-panel-title">Teacher Records</h1>
                </div>
                {data?.map((item: TeacherResponse, index: any) => {
                  return (
                    <div
                      className="task-card"
                      onClick={() => {
                        setActiveTask(item.email);
                        setDisplayTeacherModal((prevState) => !prevState);
                        setActiveIndex(index);
                      }}
                      key={index}
                    >
                      <div className="tag">
                        <div className="color-stripe"></div>
                        <div className="tag-content">
                          <div className="index"> {index}</div>
                          <div className="grade"> </div>
                        </div>
                      </div>

                      <div style={{ display: "flex" }} className="card-body">
                        <div className="card-body-name">
                          {item.firstName} {item.lastName}
                        </div>
                        <div className="card-body-email">
                          {item.roles && item.roles.length > 0
                            ? item.roles[0].role
                            : "Role Not Assigned"}
                        </div>
                        <div className="card-body-email">{item.email}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {panelName === "new-referral-contact" && <CreatePunishmentPanel />}
            {panelName === "create-assignment" && <h1>CREATE ASSIGNMENT</h1>}
            {panelName === "create-user" && <h1>CREATE USER</h1>}
            {panelName === "archvied-records" && <h1>ARCHIVED RECORD</h1>}
            {panelName === "contact-us" && <h1>CONTACT US</h1>}
            {panelName === "detention" && <h1>DETENTION LIST</h1>}
            {panelName === "redeem" && <h1>REDEEM</h1>}

            {panelName === "overview" && (
              
              <div className="guidance-panel">
              
                <div>
                  {" "}
                  <h1 className="main-panel-title">Office Referrals</h1>
                </div>
                {data.map((item: GuidanceResponse, index: any) => {
                  return (
                    <div
                      className="task-card"
                      onClick={() => setActiveIndex(index)}
                      key={index}
                    >
                      <div className="tag">
                        <div className="color-stripe"></div>
                        <div className="tag-content">
                          <div className="index"> {index + 1}</div>
                          <div className="date">
                            {" "}
                            {dateCreateFormat(item?.followUpDate) ||
                              dateCreateFormat(item?.timeCreated)}
                          </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="card-body-title">
                          {item.referralDescription !== undefined &&
                            item.referralDescription[0]}
                        </div>
                        <div className="card-body-description">
                          {/* {item?.notesArray[0]?.content} */}
                        </div>
                        {item.referralDescription &&
                          item.referralDescription[0] !== undefined &&
                          categoryBadgeGenerator(item.referralDescription[0])}
                      </div>
                      <div className="card-body">
                        <div className="card-body-title">Created By</div>
                        <div className="card-body-description">
                          {item.teacherEmail}
                        </div>
                      </div>
                      <div className="card-actions">
                        <div className="card-action-title">
                          {item.status === "CLOSED"
                            ? "Restore"
                            : "Mark Complete"}
                        </div>
                        <div
                          onClick={() =>
                            handleStatusChange("CLOSED", item.guidanceId)
                          }
                          className="check-box"
                        ></div>
                      </div>
                      <div className="card-actions">
                        <div className="card-action-title">Follow Up</div>
                        <div
                          className="clock-icon"
                          onClick={() => {
                            setDisplayPicker((prevState) => !prevState); // Toggle the state
                            setActiveTask(item.guidanceId);
                          }}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: "20px", fontWeight: "bold" }}
                          />
                        </div>
                      </div>
                      <div className="card-actions">
                        <div className="card-action-title">Notes</div>
                        <div
                          className="clock-icon"
                          onClick={() => {
                            setDisplayNotes((prevState) => !prevState); // Toggle the state
                            setActiveTask(item.guidanceId);
                          }}
                        >
                          <NoteAddIcon
                            sx={{ fontSize: "20px", fontWeight: "bold" }}
                          />
                        </div>
                      </div>
                      <div className="card-actions">
                        <div className="card-action-title">Resources</div>
                        <div
                          className="clock-icon"
                          onClick={() => {
                            setDisplayResources((prevState) => !prevState); // Toggle the state
                            setActiveTask(item.guidanceId);
                          }}
                        >
                          <SendIcon
                            sx={{ fontSize: "20px", fontWeight: "bold" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* STUDENT PANEL */}
            {panelName === "report-student" && (
              <div className="guidance-panel">
                <div>
                  {" "}
                  <h1 className="main-panel-title">Student Records</h1>
                </div>
                {data?.map((item: StudentResponse, index: any) => {
                  return (
                    <div
                      className="task-card"
                      onClick={() => {
                        setActiveTask(item.studentEmail);
                        setDisplayStudentModal((prevState) => !prevState);
                        setActiveIndex(index);
                      }}
                      key={index}
                    >
                      <div className="tag">
                        <div className="color-stripe"></div>
                        <div className="tag-content">
                          <div className="index"> Grade {item.grade}</div>
                          <div className="grade"> </div>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="card-body-name">
                          {item.firstName} {item.lastName}
                        </div>
                        <div className="card-body-email">
                          {item.studentEmail}
                        </div>
                      </div>

                      <div className="card-actions">
                        <div className="card-action-title">Notes</div>
                        <div
                          className="clock-icon"
                          onClick={() => {
                            setDisplayNotes((prevState) => !prevState); // Toggle the state
                            setActiveTask(item.studentIdNumber);
                          }}
                        >
                          <NoteAddIcon
                            sx={{ fontSize: "20px", fontWeight: "bold" }}
                          />
                        </div>
                      </div>
                      <div className="card-actions">
                        <div className="card-action-title">Resources</div>
                        <div
                          className="clock-icon"
                          //  onClick={() => {
                          //    setDisplayResources((prevState) => !prevState); // Toggle the state
                          //    setActiveTask(item.studentIdNumber);
                          //  }}
                        >
                          <SendIcon
                            sx={{ fontSize: "20px", fontWeight: "bold" }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* NOTES AND DETAILS SECTION */}
          <div
            className={`secondary-panel ${panelName !== "overview" && "hide"}`}
          >
            <h1 className="main-panel-title">At-A-Glance</h1>
            {/* {activeIndex != null && activeIndex >= 0 && (
              <div className="details-container">
                <p>{data[activeIndex]?.guidanceTitle}</p>
                <p>{dateCreateFormat(openTask[activeIndex]?.createdDate)}</p>
                <p>{data[activeIndex]?.studentId}</p>
                <p>{data[activeIndex]?.studentEmail}</p>
                <p>{data[activeIndex]?.teacherEmail}</p>
              </div>
            )} */}
            {/* <div className="thread-container">
              {activeIndex != null &&
                activeIndex >= 0 &&
                data[activeIndex]?.notesArray?.length > 0 &&
                data[activeIndex].notesArray.map(
                  (thread: any, index: number) => {
                    return (
                      <div className="thread-card" key={index}>
                        <p>Event: {thread.event}</p>
                        <p>Date: {dateCreateFormat(thread.date)}</p>
                        <p>Content: {thread.content}</p>
                      </div>
                    );
                  }
                )}

              {activeIndex == null && (
                <p>Click on Acitve Task to see details</p>
              )}
            </div> */}
                    <DetentionWidget />
                    <ISSWidget />
          </div>
        </div>
        <div className="analytics-panel">
          <h1 className="main-panel-title">Analytics</h1>
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
          <IncidentByStudentPieChart writeUps={dtoData.writeUpResponse} />
        </div>

        <div className="card-overview-third">
          <IncidentsByStudentTable writeUps={dtoData.writeUpResponse} />
        </div>

        <div className="card-overview-third">
          {/* <TeacherInfractionOverPeriodBarChart
            data={weeklyDataIncSOBxConcern}
          /> */}
        </div>
      </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
