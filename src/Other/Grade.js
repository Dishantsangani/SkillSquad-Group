import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Grade() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState([]); // Raw data fetched from the API
  const [displaydata, setDisplaydata] = useState([]); // Processed data to be displayed
  const [error, setError] = useState(null);

  // Fetch data from API on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/marks")
      .then((res) => {
        setFormData(res.data);
      })
      .catch((err) => {
        setError("Error fetching data. Please try again later.");
        console.error("Error fetching data: ", err);
      });
  }, []);

  // Calculate total marks, percentage, and aggregate subjects for each student
  const handlecheck = () => {
    // Showing the error When Data Is Not Founded When Formdata Length is 0
    if (formData.length === 0) {
      setError("No data available to process.");
      return;
    }

    // The StudentMarks Is A Object That Add Data IN A API Format
    const studentMarks = {};

    // The Entry Is A Function The use Callback function To Print Each And Every Functions
    // ForEach Function Are Return All The Value
    formData.forEach((entry) => {
      // console.log("This is A Foreach Entery", entry);
      //📍This is A Destructuring Of Object
      const { StudentId, Name, Subject, Marks, Standard } = entry;
      // console.log("This is New Entery", entry);

      // Add Validation's
      if (!StudentId || !Name || !Standard || !Subject || Marks == null) {
        setError("Invalid data format. Please check the API response.");
        return;
      }

      // This Key Is Using Template Literals Code To Print Api Data in One Raw
      const key = `${StudentId}-${Name}-${Standard}`;
      // console.log("This is A Key Of",key);

      // !studentMarks IS check Is Undifended Or Null
      if (!studentMarks[key]) {
        //studentMarks[key] with an object containing student details and default values.
        studentMarks[key] = {
          StudentId,
          Name,
          Standard,
          Subjects: {},
          TotalMarks: 0,
          TotalSubjects: 0,
        };
      }

      // This Marks Is A Partiular Subject Marks
      studentMarks[key].Subjects[Subject] = Marks;
      // console.log("This is A  Destracturing Of Marks", Subject);

      // This is A Total Marks IN The Object
      studentMarks[key].TotalMarks += parseFloat(Marks);
      // console.log("This is New Marks", Marks);

      // The TotalSubjects Propeerty Of Th StudentMarks Object For A Spacific Key
      studentMarks[key].TotalSubjects += 1;
      // console.log("This is A Total Subject", TotalSubjects);
    });

    // The Displaydata Is Display All Of Objcet Data Of A Stored in Api
    //  Is The Object.Values Is Print All The Data In A StudentMarks & The StudentMarks Is Print All Data In A API Format
    const displaydata = Object.values(studentMarks).map((student) => {
      // This is A Subject Are Stored In Array IN Subject And Marks

      const subjects = Object.entries(student.Subjects).map(
        ([subject, marks]) => `${subject.toUpperCase()}:${marks},`
      );
      // console.log("This Is A Subject", subjects);

      //This is Total Marks Is Each Subjec 100 Marks
      const TotalMarksPossible = student.TotalSubjects * 100; // Assuming each subject has 100 marks
      // console.log("This is A Total Marks", TotalMarksPossible);

      const Percentage = (
        (student.TotalMarks / TotalMarksPossible) *
        100
      ).toFixed(2);
      // console.log("This Is A Percentages", Percentage);

      const Status = Percentage <= 30 ? "Fail" : "Pass";

      return {
        StudentId: student.StudentId,
        Name: student.Name,
        Standard: student.Standard,
        Subjects: subjects,
        TotalMarks: student.TotalMarks,
        Percentage: `${Percentage}%`,
        Status,
      };
    });
    setDisplaydata(displaydata);
    setError(null); // Clear any previous errors
  };

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div className="col-12 col-md-3 mb-2 mb-md-0 d-flex justify-content-center justify-content-md-start">
          <button
            type="button"
            className="btn btn-outline-primary w-50 w-md-auto"
            onClick={() => navigate("/student")}
          >
            Prev
          </button>
        </div>
        <div className="text-center">
          <h2 className="font-weight-bold text-primary">
            Student Grade History
          </h2>
          <h4 className="text-muted">Academic Year: 2023-2024</h4>
        </div>
        <div className="col-12 col-md-3 text-center text-md-end">
          <button
            type="button"
            className="btn btn-primary w-50 w-md-auto"
            onClick={() => navigate("/result")}
          >
            Next
          </button>
        </div>
      </header>
      {/* Tables */}
      <div className="table-responsive">
        <table className="table table-striped text-center">
          <thead className="table-primary">
            <tr className="border border-2 border-secondary">
              <th className="border border-2 border-secondary">Student ID</th>
              <th className="border border-2 border-secondary">Name</th>
              <th className="border border-2 border-secondary">Standard</th>
              <th className="border border-2 border-secondary">Subjects</th>
              <th className="border border-2 border-secondary">Total Marks</th>
              <th className="border border-2 border-secondary">Percentage</th>
              <th className="border border-2 border-secondary">Status</th>
              {/* Add Status column */}
            </tr>
          </thead>
          <tbody>
            {displaydata.map((data, index) => (
              <tr key={index}>
                <td className="border border-2 border-secondary">
                  {data.StudentId}
                </td>
                <td className="border border-2 border-secondary">
                  {data.Name}
                </td>
                <td className="border border-2 border-secondary">
                  {data.Standard}
                </td>
                <td className="border border-2 border-secondary">
                  {data.Subjects}
                </td>
                <td className="border border-2 border-secondary">
                  {data.TotalMarks}
                </td>
                <td className="border border-2 border-secondary">
                  {data.Percentage}
                </td>
                <td className="border border-2 border-secondary">
                  {data.Status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-3">
        <button className="btn btn-success w-md-auto" onClick={handlecheck}>
          Check
        </button>
      </div>
    </div>
  );
}

export default Grade;
