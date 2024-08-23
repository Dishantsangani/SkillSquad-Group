import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Result() {
  const [studentData, setStudentData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsResponse = await axios.get(
          "http://localhost:3000/students"
        );
        const marksResponse = await axios.get("http://localhost:3000/marks");
        const students = studentsResponse.data;
        const marks = marksResponse.data;

        // Map through each student and merge their respective marks
        const mergedData = students.map((student) => {
          // Filter marks for the current student
          const studentMarks = marks.filter(
            (mark) => mark.StudentId === student.id
          );

          // Calculate percentage and grade for each subject
          const subjects = student.Subject.map((subject) => {
            const markData = studentMarks.find(
              (mark) => mark.Subject === subject
            );
            const marksObtained = markData ? markData.Marks : 0;
            const percentage = (marksObtained / 100) * 100;
            console.log("percentage: ", percentage);

            let grade;
            if (percentage >= 90) {
              grade = "A";
            } else if (percentage >= 75) {
              grade = "B";
            } else if (percentage >= 50) {
              grade = "C";
            } else if (percentage >= 35) {
              grade = "D";
            } else {
              grade = "F";
            }

            return {
              subject,
              marksObtained,
              percentage,
              grade,
            };
          });

          return {
            ...student,
            subjects,
          };
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
                value={student.Name + " " + student.Surname}
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
          <table className="table table-striped text-center">
            <thead className="table-primary">
              <tr className="border border-2 border-secondary">
                <th className="border border-2 border-secondary">Subject</th>
                <th className="border border-2 border-secondary">Marks</th>
                <th className="border border-2 border-secondary">Percentage</th>
                <th className="border border-2 border-secondary">Grade</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subject, i) => (
                <tr key={i}>
                  <td className="border border-2 border-secondary">
                    {subject.subject}
                  </td>
                  <td className="border border-2 border-secondary">
                    {subject.marksObtained}
                  </td>
                  <td className="border border-2 border-secondary">
                    {subject.percentage.toFixed(2)}%
                  </td>
                  <td className="border border-2 border-secondary">
                    {subject.grade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Result;
