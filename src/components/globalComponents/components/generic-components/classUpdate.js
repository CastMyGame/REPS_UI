import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "src/utils/jsonData";

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

const ClassUpdate = ({
  setContactUsDisplayModal,
  contactUsDisplayModal,
  teacher,
}) => {
  const [listOfStudents, setListOfStudents] = useState([]);
  const [infractionTypeSelected, setInfractionTypeSelected] = useState("");
  const [infractionPeriodSelected, setInfractionPeriodSelected] = useState("");
  const [teacherEmailSelected, setTeacherEmailSelected] = useState();
  const [infractionDescriptionSelected, setInfractionDescriptionSelected] =
    useState("");
  const [toast, setToast] = useState({ display: false, message: "" });
  const [studentNames, setStudentNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState({
    display: false,
    message: "",
    buttonType: "",
  });

  // Set the first class in teacher's class roster when component mounts
  useEffect(() => {
    if (teacher && teacher.classes && teacher.classes.length > 0) {
      const firstClass = teacher.classes[0]; // Select the first class
      setSelectedClass(firstClass);
      setClassName(firstClass.className);
      setPeriodSelected(firstClass.classPeriod);
      setStudentEmails(
        firstClass.classRoster.map((student) => student.studentEmail)
      );
    }
  }, [teacher]);

  const defaultTheme = createTheme();

  const url = `${baseUrl}/student/v1/allStudents`;
  const headers = {
    Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
  };

  useEffect(() => {
    // Close modal if `contactUsDisplayModal` changes to anything else
    if (contactUsDisplayModal !== "classUpdate") {
      setContactUsDisplayModal("");
    }
  }, [contactUsDisplayModal, setContactUsDisplayModal]);

  // Fetch all students to populate the list of available students
  useEffect(() => {
    axios
      .get(url, { headers })
      .then(function (response) {
        setListOfStudents(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  const infractionPeriodSelectOptions = [
    { value: "exchange", label: "Class Exchange" },
    { value: "afterSchool", label: "After School" },
    { value: "lunch", label: "Lunch" },
    { value: "block1", label: "Block 1" },
    { value: "block2", label: "Block 2" },
    { value: "block3", label: "Block 3" },
    { value: "block4", label: "Block 4" },
    { value: "period1", label: "Period 1" },
    { value: "period2", label: "Period 2" },
    { value: "period3", label: "Period 3" },
    { value: "period4", label: "Period 4" },
    { value: "period5", label: "Period 5" },
    { value: "period6", label: "Period 6" },
    { value: "period7", label: "Period 7" },
    { value: "period8", label: "Period 8" },
    { value: "period9", label: "Period 9" },
  ];

  const selectOptions = listOfStudents.map((student) => ({
    value: student.studentEmail, // Use a unique value for each option
    label: `${student.firstName} ${student.lastName} - ${student.studentEmail}`, // Display student's full name as the label
  }));

  // Handle adding/removing students from class roster
  const handleAddStudent = () => {
    setStudentEmails([...studentEmails, ""]);
  };

  const handleRemoveStudent = (index) => {
    setStudentEmails(studentEmails.filter((_, i) => i !== index));
  };

  const handleStudentChange = (e, index) => {
    const updatedEmails = [...studentEmails];
    updatedEmails[index] = e.target.value;
    setStudentEmails(updatedEmails);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setToast({ display: false, message: "" });

    // Prepare the payload for the API request
    const classRoster = studentEmails.map((email) => ({ studentEmail: email }));

    const payload = {
      classToUpdate: {
        className: className,
        classPeriod: periodSelected,
        classRoster: classRoster,
        punishmentsThisWeek: 0, // Default value
      },
    };

    axios
      .post(`${baseUrl}/employees/v1/updateClass/${teacher.email}`, payload, {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("Authorization"),
        },
      })
      .then(function (res) {
        setToast({ display: true, message: "Class Successfully Updated" });
        setTimeout(() => {
          setLoading(false);
          setToast({ display: false, message: "" });
        }, 1000);
        setContactUsDisplayModal("login");
      })
      .catch(function (error) {
        console.error(error);
        setToast({ display: true, message: "Something Went Wrong" });
        setTimeout(() => {
          setLoading(false);
          setToast({ display: false, message: "" });
        }, 2000);
      });
  };

  return (
    <>
      {toast.display === true && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={toast}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert Close={handleClose} severity="success" sx={{ width: "100%" }}>
            {toast.message}
          </Alert>
        </Snackbar>
      )}
      {openModal.display && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{openModal.message}</h3>
            </div>
            <div className="modal-body"></div>
            <div className="modal-buttons">
              <button
                onClick={() => {
                  setOpenModal({ display: false, message: "" });
                }}
              >
                Cancel
              </button>
              {openModal.buttonType === "submit" && (
                <Button
                  disabled={
                    !infractionPeriodSelected ||
                    !infractionTypeSelected ||
                    !infractionDescriptionSelected ||
                    studentNames.length === 0 ||
                    difference < 0
                  }
                  type="submit"
                  onClick={handleSubmit}
                  width="50%"
                  variant="contained"
                  sx={{ height: "100%" }} // Set explicit height
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="form-referral">
        {loading && (
          <div
            style={{
              position: "absolute", // Position the div absolutely
              top: "64%", // Center vertically
              left: "60%", // Center horizontally
              transform: "translate(-50%, -50%)", // Adjust to perfectly center the div
              backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: Add background color or opacity
            }}
          >
            <CircularProgress style={{}} color="secondary" />
          </div>
        )}
        <ThemeProvider theme={defaultTheme}>
          <Container component="main">
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <h4>Submitting Teacher: {teacherEmailSelected}</h4>
                <hr />

                <Autocomplete
                  multiple
                  className="student-dropdown"
                  id="demo-multiple-chip"
                  value={studentNames}
                  onChange={(event, newValue) => setStudentNames(newValue)}
                  options={selectOptions} // Pass the selectOptions array here
                  getOptionLabel={(option) => option.label}
                  inputLabelProps={{ style: { fontSize: 18 } }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="student-dropdown"
                      inputLabelProps={{ style: { fontSize: 18 } }}
                      label="Select Students"
                      sx={{ width: "100%" }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        key={option.value}
                        label={option.label}
                        sx={{ fontSize: 18 }}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                />
                <div style={{ height: "5px" }}></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <InputLabel id="infractionPeriod" style={{ fontSize: 24 }}>
                      Class Period
                    </InputLabel>

                    <Select
                      sx={{ width: "100%", fontSize: 18 }}
                      labelId="infractionPeriod"
                      value={infractionPeriodSelected}
                      onChange={handleInfractionPeriodChange}
                      renderValue={(selected) => {
                        // Check if selected is an array, if not, wrap it in an array
                        const selectedArray = Array.isArray(selected)
                          ? selected
                          : [selected];

                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selectedArray.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                sx={{ fontSize: 18 }}
                              />
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
                          sx={{ fontSize: 18 }}
                        >
                          {name.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div
                    style={{ width: "50%", marginLeft: "10px", fontSize: 18 }}
                  >
                    <InputLabel id="infractionType" style={{ fontSize: 24 }}>
                      Infraction Type/Positive Shoutout
                    </InputLabel>

                    <Select
                      sx={{ width: "100%" }}
                      labelId="infractionType"
                      value={infractionTypeSelected}
                      onChange={handleInfractionTypeChange}
                      renderValue={(selected) => {
                        // Check if selected is an array, if not, wrap it in an array
                        const selectedArray = Array.isArray(selected)
                          ? selected
                          : [selected];

                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selectedArray.map((value) => (
                              <Chip
                                key={value}
                                label={value}
                                sx={{ fontSize: 18 }}
                              />
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
                          sx={{ fontSize: 18 }}
                        >
                          {name.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="question-container-text-area">
                  <p style={{ fontSize: 24 }}>
                    {infractionTypeSelected === "Failure to Complete Work" ||
                    infractionTypeSelected === "Positive Behavior Shout Out!" ||
                    infractionTypeSelected === "Behavioral Concern"
                      ? getDescription(infractionTypeSelected)
                      : "Description of Behavior/Event. This will be sent directly to the student and guardian so be sure to provide accurate and objective facts as well as do NOT include the names of any other students."}
                  </p>
                  <div>
                  {studentNames.length < 2 && infractionTypeSelected !== "Positive Behavior Shout Out!" && (
                    <div className="guidance-box">
                      <FormGroup>
                        <FormControlLabel
                          style={{ color: "black" }}
                          componentsProps={{ typography: { variant: "h4" } }}
                          value="end"
                          labelPlacement="end"
                          control={
                            <Checkbox
                              color="primary"
                              checked={isGuidance.isGuidanceBoolean}
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                              onChange={handleGuidanceCheckboxChange}
                              name="isGuidanceBoolean"
                            />
                          }
                          label="Create Guidance Referral"
                        />
                        {isGuidance.isGuidanceBoolean && studentNames.length < 2 && (
                          <h4>Description goes here</h4>
                        )}
                      </FormGroup>
                    </div>
                  )}
                    {studentNames.length < 2 && (
                    <div className="guidance-box">
                      <FormGroup>
                        <FormControlLabel
                          style={{ color: "black" }}
                          componentsProps={{ typography: { variant: "h4" } }}
                          value="end"
                          labelPlacement="end"
                          control={
                            <Checkbox
                              color="primary"
                              checked={isPhoneLog.isPhoneLogBoolean}
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                              onChange={handlePhoneLogCheckboxChange}
                              name="isPhoneLogBoolean"
                            />
                          }
                          label="Log Phone Call"
                        />
                        
                        {isPhoneLog.isPhoneLogBoolean && (
                          <h4>Phone Log goes here</h4>
                        )}
                      </FormGroup>
                    </div>
                    )}
                    {infractionTypeSelected ===
                      "Positive Behavior Shout Out!" && (
                      <div className="points-container">
                        <div className="point-field">
                          <div className="wallet-after">
                            <p>
                              {" "}
                              Wallet after shout out:{" "}
                              {difference ? difference : 0}
                            </p>
                          </div>
                          <TextField
                            type="numeric"
                            margin="normal"
                            inputProps={{ style: { fontSize: 15 }, min: 0 }} // font size of input text
                            className="points-input"
                            required
                            onChange={handleCurrencyChange}
                            id="currency"
                            placeholder="Enter Amount"
                            name="currency"
                            autoFocus
                            value={currency}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginTop: "1%",
                          }}
                          className="points-arrow"
                        >
                          <KeyboardDoubleArrowUpIcon
                            onClick={() => setCurrency((prev) => prev + 1)}
                            sx={{ fontSize: 40 }}
                          />
                          <KeyboardDoubleArrowDownIcon
                            onClick={() =>
                              setCurrency((prev) =>
                                prev > 0 ? prev - 1 : prev
                              )
                            }
                            sx={{ fontSize: 40 }}
                          />
                        </div>
                        <div className="shout-message">
                          <p>
                            Thank you for celebrating the positive behavior of a
                            student. Please include a description of the
                            students behavior below. Refrain from using any
                            student’s name in this description.
                            Remember you can not give away more currency than
                            you have in your wallet and it does not replenish!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    minRows={2} // Optional: Set minimum number of rows
                    onChange={(event) => {
                      const enteredValue = event.target.value;
                      setInfractionDescriptionSelected(enteredValue);
                    }}
                    id="offenseDescription"
                    label="Brief Infraction Description"
                    name="offenseDescription"
                    autoFocus
                    value={infractionDescriptionSelected}
                    inputProps={{ style: { fontSize: 15 }, min: 0 }} // font size of input text
                    InputLabelProps={{
                      sx: {
                        "&.Mui-focused": {
                          color: "white",
                          marginTop: "-10px",
                        },
                      },
                    }}
                    sx={{ fontSize: 40 }} // Increase the font size of the input text
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent form submission on Enter key

                        // Get the current cursor position
                        const { selectionStart, selectionEnd } = e.target;

                        // Get the current value of the input
                        const value = e.target.value;

                        // Insert a newline character (\n) at the cursor position
                        const newValue =
                          value.substring(0, selectionStart) +
                          "\n" +
                          value.substring(selectionEnd);

                        // Update the input value and set the cursor position after the newline character
                        e.target.value = newValue;
                        e.target.selectionStart = e.target.selectionEnd =
                          selectionStart + 1;

                        // Trigger the change event manually (React doesn't update the value automatically)
                        const event = new Event("input", { bubbles: true });
                        e.target.dispatchEvent(event);

                        // Optionally, you can add your logic here for what should happen after Enter is pressed.
                      }
                    }}
                  />
                </div>
                {isGuidance.isGuidanceBoolean && (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="guidanceDescription"
                    label="Brief Guidance Description"
                    name="guidanceDescription"
                    value={isGuidance.guidanceDescription}
                    onChange={handleGuidanceChange}
                  />
                )}
                {isPhoneLog.isPhoneLogBoolean && studentNames.length < 2 && (
                  <>
                    <Box
                      component="section"
                      sx={{ p: 2, border: "1px dashed grey" }}
                    >
                      Parent phone number:{" "}
                      {getPhoneNumber(studentNames[0].value)}
                    </Box>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="phoneLogDescription"
                      label="Phone Log Description"
                      name="phoneLogDescription"
                      value={isPhoneLog.phoneLogDescription}
                      onChange={handlePhoneLogChange}
                    />
                  </>
                )}
                {/* <br/> */}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                  className="button-container"
                >
                  <div style={{ width: "30%" }}>
                    <Button
                      type="reset"
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        resetForm();
                      }}
                      sx={{
                        height: "100%",
                        backgroundColor: "grey",
                        fontSize: 16,
                        "&:hover": {
                          backgroundColor: "red", // Darken the color on hover if desired
                        },
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                  <div style={{ width: "70%" }}>
                    {studentNames.length > 1 ? (
                      <Button
                        disabled={
                          !infractionPeriodSelected ||
                          !infractionTypeSelected ||
                          !infractionDescriptionSelected ||
                          studentNames.length === 0 ||
                          difference < 0
                        }
                        onClick={() => {
                          setOpenModal({
                            display: true,
                            message:
                              "Warning! You are currently writing up multiple students simultaneously. If this is your intent make sure you have not included any student identifiers including names or pronouns. If you wish to continue press Submit, to go back press cancel.",
                            buttonType: "submit",
                          });
                        }}
                        fullWidth
                        variant="contained"
                        sx={{ height: "100%", fontSize: 18 }} // Set explicit height
                      >
                        Submit Multiple
                      </Button>
                    ) : (
                      <Button
                        disabled={
                          !infractionPeriodSelected ||
                          !infractionTypeSelected ||
                          !infractionDescriptionSelected ||
                          studentNames.length === 0 ||
                          difference < 0
                        }
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          height: "100%",
                          "&:hover": {
                            backgroundColor: "blue", // Darken the color on hover if desired
                            fontSize: 16,
                          },
                        }} // Set explicit height
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </div>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
        :
      </div>
    </>
  );
};

export default ClassUpdate;
