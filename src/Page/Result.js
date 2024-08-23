import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Result() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This StuRes,MarRes Is Stored The Api Data
        const [StuRes, MarRes] = await Promise.all([
          axios.get("http://localhost:3000/students"),
          axios.get("http://localhost:3000/marks"),
        ]);
        // This Student Are Stored InStudent Data Only Like Name,subject,Surname Etc.
        const students = StuRes.data;

        // This Marks Stored In 2 API Like Marks And Student Details
        const marks = MarRes.data;

        const mergedData = students.map((student) => {
          // This Subject Are Display  Grade, Marks, Percentage, Subject
          // This Subject Are Display Return New Data Usin Map Method
          // The Subject Are Show This Type Of Data = subject: 'Hindi', Dismark: 98, grade: 'B'
          const subjects = student.Subject.map((subject) => {
            // The find() method returns the value of the first element that passes a test.
            // The Dismark Is Find The Student id And Subject To Compare
            const Dismark =
              marks.find(
                (mark) =>
                  // This Compare Student Id & Subject If Not Find The Same Student Id Then Return The Undefind
                  mark.StudentId === student.id && mark.Subject === subject
              )?.Marks ?? 0;

            // Grade Display
            const grade =
              Dismark >= 100
                ? "A"
                : Dismark >= 85
                ? "B"
                : Dismark >= 60
                ? "C"
                : Dismark >= 35
                ? "D"
                : "F";
            return { subject, Dismark, grade };
          });
          // console.log("subjects: ", subjects);

          // The AvgPerct Is Represent Of Parcentage's
          // Like 58.0 % ,98.87 %
          const AvgPerct =
            //📍 The Subject Is The Total To Marks And Subject Value
            // This {Dismark} Is Take Mark In The Array And iivided The Marks
            // The Subject.Length Is Use To Total Subject To divided & Take The Parcentage To Find
            // This Acc Is Colleing The Prev Value Add And Comparing
            subjects.reduce((acc, { Dismark }) => acc + Dismark, 0) /
            subjects.length;
          return { ...student, subjects, AvgPerct };
        });
        setStudentData(mergedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <div className="col-12 col-md-3 mb-2 mb-md-ms-5">
          <button
            type="button"
            className="btn btn-outline-primary w-50 w-md-auto"
            onClick={() => navigate("/grade")}
          >
            Prev
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-primary">Student Report Card</h2>
          <h4 className="text-muted">Academic Year: 2023-2024</h4>
        </div>
        <div className="col-12 col-md-3 text-center text-md-end">
          <button
            type="button"
            className="btn btn-primary w-50 w-md-auto"
            onClick={() => navigate("/")}
          >
            Next
          </button>
        </div>
      </header>

      {studentData.map((student, index) => (
        <div key={index} className="mb-5">
          {/* Student Information */}
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3 mb-2">
              <input
                type="text"
                className="form-control"
                value={`${student.Name} ${student.Surname}`}
                readOnly
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3 mb-2">
              <input
                type="text"
                className="form-control"
                value={student.GRNo}
                readOnly
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3 mb-2">
              <input
                type="number"
                className="form-control"
                value={student.Standard}
                readOnly
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3 mb-2">
              <input
                type="number"
                className="form-control"
                value={student.RollNo}
                readOnly
              />
            </div>
          </div>

          {/* Subject Marks and Grades */}
          <table className="table table-striped text-center mt-3">
            <thead className="table-primary">
              <tr className="border border-2 border-secondary">
                <th className="border border-2 border-secondary">Subject</th>
                <th className="border border-2 border-secondary">Total</th>
                <th className="border border-2 border-secondary">Marks</th>
                <th className="border border-2 border-secondary">Grade</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subject, i) => (
                <tr key={i}>
                  <td className="border border-2 border-secondary">
                    {subject.subject}
                  </td>
                  <td className="border border-2 border-secondary">100</td>
                  <td className="border border-2 border-secondary">
                    {subject.Dismark}
                  </td>
                  <td className="border border-2 border-secondary">
                    {subject.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Showing The Result */}
          <div className="d-flex justify-content-between mt-3">
            <div>
              <strong>Per:</strong>
              <span
                className={`text-success ${
                  student.AvgPerct < 35 ? "text-danger" : ""
                }`}
              >
                {student.AvgPerct.toFixed(2)}%
              </span>
            </div>
            <div>
              <strong>Result:</strong>
              <span
                className={`text-success ${
                  student.AvgPerct < 35 ? "text-danger" : ""
                }`}
              >
                <b>{student.AvgPerct >= 35 ? "Pass" : "Fail"}</b>
              </span>
            </div>
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
}

export default Result;
