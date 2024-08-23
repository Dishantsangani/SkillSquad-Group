import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import Footer from "./Footer";

function Student() {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState([]);
  const [existingMarks, setExistingMarks] = useState([]);
  const [SelStd, setSelStd] = useState("");
  const [Ssub, setSsub] = useState("");
  const [marks, setMarks] = useState({});
  // Api Calling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, marksResponse] = await Promise.all([
          axios.get("http://localhost:3000/students"),
          axios.get("http://localhost:3000/marks"),
        ]);
        setFormdata(studentsResponse.data);
        setExistingMarks(marksResponse.data);
      } catch (error) {}
    };
    fetchData();
  }, []);
  // Standrd Chage Handle
  const handleStandardChange = (e) => {
    setSelStd(e.target.value);
    setSsub("");
    setMarks({});
  };

  const handleSubjectChange = (e) => {
    setSsub(e.target.value);
  };

  const Fdata = formdata.filter((item) => {
    const mstd = !SelStd || item.Standard.toString() === SelStd;
    const msubj = !Ssub || item.Subject.includes(Ssub);
    return mstd && msubj;
  });

  const handlemarks = (id, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlesave = async () => {
    if (!Ssub) {
      Swal.fire({
        title: "Error",
        text: "Please select a subject.",
        icon: "error",
      });
      return;
    }

    const newMarks = [];
    let hasInvalidMarks = false;

    // Loop through the marks entered by the user
    Object.keys(marks).forEach((id) => {
      const mark = marks[id];
      const student = Fdata.find((item) => item.id === id);
      if (!student) return;

      if (
        isNaN(mark) ||
        mark === "" ||
        parseFloat(mark) < 0 ||
        parseFloat(mark) > 100
      ) {
        hasInvalidMarks = true;
        return;
      }

      newMarks.push({
        id: uuidv4(),
        StudentId: id,
        Name: student.Name,
        RollNo: student.RollNo,
        Subject: Ssub,
        Standard: SelStd,
        Marks: parseFloat(mark),
      });
    });

    if (hasInvalidMarks) {
      Swal.fire({
        title: "Error",
        text: "Please provide valid marks for all entries.",
        icon: "error",
      });
      return;
    }

    if (newMarks.length === 0) {
      Swal.fire({
        title: "Error",
        text: "No valid marks to save.",
        icon: "error",
      });
      return;
    }

    try {
      for (const mark of newMarks) {
        const existingMark = existingMarks.find(
          (m) =>
            m.StudentId === mark.StudentId &&
            m.Subject === mark.Subject &&
            m.Standard === mark.Standard &&
            m.RollNo === mark.RollNo
        );

        if (existingMark) {
          // Prevent duplicate entry
          Swal.fire({
            title: "Error",
            text: `Marks for ${existingMark.Name} in ${existingMark.Subject} (Std ${existingMark.Standard}) already exist.`,
            icon: "error",
          });
          return; // Exit the loop on finding a duplicate
        } else {
          // Add new mark
          await axios.post("http://localhost:3000/marks", mark);
          // Update the local state to reflect the new mark
          setExistingMarks((prevMarks) => [...prevMarks, mark]);
        }
      }

      Swal.fire({
        title: "Save Successfully",
        icon: "success",
      });

      // Clear the marks and reset form selections
      setMarks({});
      setSelStd("");
      setSsub("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while saving data.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div className="col-12 col-md-3 mb-2 mb-md-ms-5">
            <button
              type="button"
              className="btn btn-outline-primary w-50 w-md-auto"
              onClick={() => navigate("/")}
            >
              Prev
            </button>
          </div>
          <div className="text-center text-md-start">
            <h2 className="mb-2 font-weight-bold text-primary">Student Marks</h2>
            <h4 className="text-muted">Academic Year: 2023-2024</h4>
          </div>
          <div className="col-12 col-md-3 text-center text-md-end">
            <button
              type="button"
              className="btn btn-primary w-50 w-md-auto"
              onClick={() => navigate("/grade")}
            >
              Next
            </button>
          </div>
        </header>
      </div>

      <div className="container border mt-3">
        <div className="row">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <label className="form-label">Standard:</label>
            <select
              className="form-select"
              value={SelStd}
              onChange={handleStandardChange}
            >
              <option value="">Select STD</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 mt-4 col-md-6">
            <div className="d-flex">
              <label className="form-label me-3">Subject:</label>
              <div className="form-check me-3">
                <input
                  type="radio"
                  name="Subject"
                  value="Hindi"
                  className="form-check-input"
                  checked={Ssub === "Hindi"}
                  onChange={handleSubjectChange}
                />
                <label className="form-check-label">Hindi</label>
              </div>
              <div className="form-check me-3">
                <input
                  type="radio"
                  name="Subject"
                  value="English"
                  className="form-check-input"
                  checked={Ssub === "English"}
                  onChange={handleSubjectChange}
                />
                <label className="form-check-label">English</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="Subject"
                  value="Science"
                  className="form-check-input"
                  checked={Ssub === "Science"}
                  onChange={handleSubjectChange}
                />
                <label className="form-check-label">Science</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="table-responsive">
          <table className="table table-striped mt-3 text-center">
            <thead className="table-primary">
              <tr className="border border-2 border-secondary">
                <th className="border border-2 border-secondary">ID</th>
                <th className="border border-2 border-secondary">Name</th>
                <th className="border border-2 border-secondary">Surname</th>
                <th className="border border-2 border-secondary">STD</th>
                <th className="border border-2 border-secondary">RollNO</th>
                <th className="border border-2 border-secondary">Subject</th>
                <th className="border border-2 border-secondary">Marks</th>
              </tr>
            </thead>
            <tbody>
              {Fdata.length > 0 ? (
                Fdata.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-2 border-secondary">
                      {item.id}
                    </td>
                    <td className="border border-2 border-secondary">
                      {item.Name}
                    </td>
                    <td className="border border-2 border-secondary">
                      {item.Surname}
                    </td>
                    <td className="border border-2 border-secondary">
                      {item.Standard}
                    </td>
                    <td className="border border-2 border-secondary">
                      {item.RollNo}
                    </td>
                    <td className="border border-2 border-secondary">
                      {item.Subject}
                    </td>
                    <td className="border border-2 border-secondary">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Enter Marks"
                        value={marks[item.id] || ""}
                        onChange={(e) => handlemarks(item.id, e.target.value)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <button className="btn btn-success  mt-3" onClick={handlesave}>
            SAVE
          </button>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Student;
