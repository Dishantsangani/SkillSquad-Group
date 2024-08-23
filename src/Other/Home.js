import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import Swal from "sweetalert2";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState([]);
  // Form states
  const [id, setId] = useState("");
  const [Name, setName] = useState("");
  const [Surname, setSurname] = useState("");
  const [Dob, setDob] = useState("");
  const [Standard, setStandard] = useState("");
  const [RollNo, setRollNo] = useState("");
  const [GRNo, setGRNo] = useState("");
  // Selecting Subject's
  const [Subject, setSubject] = useState([]);
  // Update Button's When Edit Button Clik Then Showing This Button's
  const [Update, setUpdate] = useState(false);
  //   Loading..
  const [loading, setLoading] = useState(true);

  //   API Calling
  // The useEffect Hook allows you to perform side effects in your components.
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/students")
      .then((res) => {
        setFormdata(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []); //This is a Depandancy In API Calling In Getdata

  //  Calculate Date Of Birth
  const Calculateage = (dob) => {
    const today = new Date(); // This is A Today
    const birthdate = new Date(dob); // This is a Birthday enter in Date Of Birth
    let age = today.getFullYear() - birthdate.getFullYear(); // This is A Age Enter The BirthYear
    let MonthDiff = today.getMonth() - birthdate.getMonth(); // This is show Month Diffrance Of This Month Or Birthday Month
    if (
      MonthDiff < 0 ||
      (MonthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Validation for a  Date Of Birth To Find Standard
  const Validdob = (dob, standard) => {
    //standard is reprenting The number
    //dob is string reprenting the date
    const age = Calculateage(dob);
    const minage = standard + 6; //6 is a minimum age requried bt adding date of birth
    if (age < minage) {
      Swal.fire({
        title: "Warning",
        text: `For Standard ${standard}, the minimum age is ${minage} years. Your age is ${age} years.`,
        icon: "warning",
      });
      return false;
    }
    return true; // This is a Return
  };

  // Update Button
  function updatehandle() {
    if (
      !Name.trim() ||
      !Surname.trim() ||
      !Dob.trim() ||
      !Standard.trim() ||
      !RollNo.trim() ||
      !GRNo.trim() ||
      Subject.length === 0
    ) {
      Swal.fire({
        title: "Enter All Inputs",
        text: "Please Enter All Inputs",
        icon: "error",
      });
      return;
    }

    //  Validation Of Date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(Dob)) {
      Swal.fire({
        title: "Invalid Date Format",
        text: "Please Enter The date In YYYY-MM-DD Format",
        icon: "error",
      });
      return;
    }

    // GRNO.Validation
    if (formdata.some((item) => item.GRNo === GRNo && item.id !== id)) {
      Swal.fire({
        title: "Duplicate GR Number",
        text: "GR Number Already Exists",
        icon: "error",
      });
      return;
    }

    // Convert Standard to an integer
    const standardInt = parseInt(Standard);
    if (isNaN(standardInt)) {
      //NAN Is A Not A Number
      // If it is NaN, display an error message using Swal and exit the function.
      Swal.fire({
        title: "Invalid Standard",
        text: "Standard must be a number.",
        icon: "error",
      });
      return;
    }

    // Age And Date Of Birth Validation
    if (!Validdob(Dob, standardInt)) {
      return;
    }

    // Roll no
    const rollNoInt = parseInt(RollNo); //Convert RollNo to an integer using parseInt.
    if (isNaN(rollNoInt) || rollNoInt.toString() !== RollNo.trim()) {
      //Check if the conversion result is NaN or if the integer's string representation does not match the trimmed original RollNo string.
      Swal.fire({
        title: "Invalid Roll No",
        text: "Roll No must be an integer.",
        icon: "error",
      });
      return;
    }
    // Some 50% 📍
    // Check if the formdata array contains an element with the same Standard and RollNo as the ones entered by the user.
    if (
      formdata.some(
        //The some() method checks if any array elements pass a test (provided as a callback function) //The some() method does not change the original array.
        (item) =>
          item.id !== id &&
          item.Standard === standardInt &&
          item.RollNo === rollNoInt
        //standardInt: an integer representing the standard to check.
      )
    ) {
      Swal.fire({
        title: "Dublicate Entry",
        text: "RollNO & Standard Already Exists",
        icon: "error",
      });
      return;
    }

    // New Update
    const updates = {
      id, //This is a get User Id
      Name,
      Surname,
      Dob,
      Standard: standardInt,
      RollNo: rollNoInt,
      GRNo,
      Subject,
    };

    // PUT API
    axios
      .put(`http://localhost:3000/students/${id}`, updates)
      .then((res) => {
        console.log("Response", res);
        // Some 📍
        setFormdata(
          (prev) => prev.map((item) => (item.id === id ? updates : item))
          //prev: The previous state of formdata, an array of objects.
          //id: The identifier used to find the item to be updated.
          //updates: The new data to replace the existing item with the matching id.
        );
        setUpdate(false);
        Swal.fire({
          title: "Updated!",
          text: "Your data has been updated.",
          icon: "success",
        });
        clearhandle();
      })
      .catch((err) => {
        console.log("Error", err);
        Swal.fire({
          title: "Error!",
          text: "There was a problem updating the data.",
          icon: "error",
        });
      });
  }

  // Add Button ✔
  function addhandle() {
    if (
      !Name.trim() ||
      !Surname.trim() ||
      !Dob.trim() ||
      !Standard.trim() ||
      !RollNo.trim() ||
      !GRNo.trim() ||
      Subject.length === 0
    ) {
      Swal.fire({
        title: "Enter All Inputs",
        text: "Please Enter All Inputs",
        icon: "error",
      });
      return;
    }

    // Date Of Birth Validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(Dob)) {
      Swal.fire({
        title: "Invalid Date Format",
        text: "Please Enter The date In YYYY-MM-DD Format",
        icon: "error",
      });
      return;
    }

    // GRNO.Validation
    //The some() method checks if any array elements pass a test (provided as a callback function).
    if (formdata.some((item) => item.GRNo === GRNo)) {
      Swal.fire({
        title: "Duplicate GR Number",
        text: "GR Number Already Exists",
        icon: "error",
      });
      return;
    }

    // Age And DateOfBirth Validation
    if (!Validdob(Dob, parseInt(Standard))) {
      //Standard: A string representing the standard (grade) which is parsed into an integer.
      return;
    }

    // Standard & RollNo Validation
    if (
      formdata.some(
        //The parseInt method parses a value as a string and returns the first integer.
        (item) =>
          item.Standard === parseInt(Standard) &&
          item.RollNo === parseInt(RollNo)
        //formdata: An array of student objects.
        //Standard: A string representing the standard/class of the student.
        //RollNo: A string representing the roll number of the student
        // check if item.Standard matches the parsed integer value of Standard.
        //Return true if a match is found, otherwise return false.
      )
    ) {
      Swal.fire({
        title: "Dublicate Entry",
        text: "RollNO & Standard Already Exists",
        icon: "error",
      });
      return;
    }

    // RollNo Validation
    const rollNoInt = parseInt(RollNo); //Parse RollNo to an integer and store it in rollNoInt.
    if (isNaN(rollNoInt) || rollNoInt.toString() !== RollNo.trim()) {
      //Check if rollNoInt is NaN or if its string representation does not match the trimmed RollNo.
      // If either condition is true, display an error message using Swal.fire and exit the function
      Swal.fire({
        title: "Invalid Roll No",
        text: "Roll No must be an integer.",
        icon: "error",
      });
      return;
    }
    {
      const added = {
        id: (formdata.length + 1001).toString(),
        Name: Name,
        Surname: Surname,
        Dob: Dob,
        Standard: parseInt(Standard),
        RollNo: rollNoInt,
        GRNo: GRNo,
        Subject: Subject,
      };

      //POST API To posting new data raw
      axios
        .post("http://localhost:3000/students", added)
        .then((response) => {
          setFormdata((prev) => [...prev, response.data]);
          Swal.fire({
            title: "Added!",
            text: "New data has been added.",
            icon: "success",
          });
          clearhandle();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: "Please Fill All inputs!",
            icon: "error",
          });
        });
    }
  }
  // Subject Checker 📍
  //When the "Math" checkbox is checked, "Math" is added to the Subject state. If unchecked, "Math" is removed from the Subject state.
  const subjectshandler = (e) => {
    const value = e.target.value;
    setSubject(
      e.target.checked
        ? [...Subject, value]
        : Subject.filter((Subject) => Subject !== value)
    );
  };
  // Remove Button  ✔
  const Removehandle = (id) => {
    Swal.fire({
      title: "Are you sure?",

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/students/${id}`)
          .then((response) => {
            setFormdata((prev) => prev.filter((item) => item.id !== id));
            //id: The identifier of the item to be removed from the formdata state.
            // prev: The previous state of the formdata array.
            //The filter method is used to create a new array excluding the item with the specified id
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "There was a problem deleting the data.",
              icon: "error",
            });
          });
      }
    });
  };

  // Edit Button ✔
  const Edithandle = (id) => {
    // The find() method returns the value of the first element that passes a test.
    //id: a variable representing the id to search for in the formdata array.
    //Edited Is Get Data IN Particular Id ✔
    const edited = formdata.find((item) => item.id === id);
    //The code uses the find method to search the formdata array for an item with an id matching the id state.
    if (edited !== null) {
      setId(id);
      setName(edited.Name);
      setSurname(edited.Surname);
      setDob(edited.Dob);
      setStandard(edited.Standard.toString()); // Ensure Standard is treated as string
      setRollNo(edited.RollNo.toString()); // Ensure RollNo is treated as string
      setGRNo(edited.GRNo);
      setSubject(edited.Subject);
      setUpdate(true);
    } else {
      alert("Not Selected");
    }
  };
  // Clear Button ✔
  function clearhandle() {
    setId("");
    setName("");
    setSurname("");
    setDob("");
    setStandard("");
    setRollNo("");
    setGRNo("");
    setSubject([]);
    setUpdate(false);
  }
  // Input's
  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
          <div className="col-md-3 mb-2 mb-md-0 text-center text-md-start">
            <h5 className="mb-0">SkillSquad Group</h5>
          </div>
          <div className="text-center flex-grow-1 mx-3">
            <h2 className="font-weight-bold text-primary mb-2">Student Data</h2>
            <h4 className="text-muted mb-0">Academic Year: 2023-2024</h4>
          </div>
          <div className="col-md-3 text-md-end">
            <button
              type="button"
              className="btn btn-primary w-50"
              onClick={() => navigate("/student")}
            >
              Next
            </button>
          </div>
        </header>
      </div>

      <div className="container">
        <div className="row mb-3">
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="id" className="form-label">
              ID:
            </label>
            <input
              type="text"
              id="id"
              className="form-control"
              placeholder="Id Generate utomatically"
              disabled
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter Your Name"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="surname" className="form-label">
              Surname:
            </label>
            <input
              type="text"
              id="surname"
              className="form-control"
              placeholder="Enter Surname"
              onChange={(e) => setSurname(e.target.value)}
              value={Surname}
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="dob" className="form-label">
              DOB:
            </label>
            <input
              type="date"
              id="dob"
              className="form-control"
              onChange={(e) => setDob(e.target.value)}
              value={Dob}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="standard" className="form-label">
              STD:
            </label>
            <select
              id="standard"
              className="form-select"
              onChange={(e) => setStandard(e.target.value)}
              value={Standard}
            >
              <option value="">Select</option>
              {[...Array(12).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="rollNo" className="form-label">
              Roll No:
            </label>
            <input
              type="number"
              id="rollNo"
              className="form-control"
              onChange={(e) => setRollNo(e.target.value)}
              value={RollNo}
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label htmlFor="grNo" className="form-label">
              GR NO:
            </label>
            <input
              type="text"
              id="grNo"
              className="form-control"
              onChange={(e) => setGRNo(e.target.value)}
              value={GRNo}
            />
          </div>
          <div className="col-12 col-md-3 mb-2 mb-md-0">
            <label className="form-label">Subject:</label>
            <div className="d-flex flex-wrap">
              <div className="form-check me-3">
                <input
                  type="checkbox"
                  id="subjectHindi"
                  className="form-check-input"
                  onChange={subjectshandler}
                  checked={Subject.includes("Hindi")}
                  value="Hindi"
                />
                <label htmlFor="subjectHindi" className="form-check-label">
                  Hindi
                </label>
              </div>
              <div className="form-check me-3">
                <input
                  type="checkbox"
                  id="subjectEnglish"
                  className="form-check-input"
                  onChange={subjectshandler}
                  checked={Subject.includes("English")}
                  value="English"
                />
                <label htmlFor="subjectEnglish" className="form-check-label">
                  English
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  id="subjectScience"
                  className="form-check-input"
                  onChange={subjectshandler}
                  checked={Subject.includes("Science")}
                  value="Science"
                />
                <label htmlFor="subjectScience" className="form-check-label">
                  Science
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap mb-3">
          {!Update ? (
            <button
              className="btn btn-success me-2 mb-2"
              onClick={() => addhandle()}
            >
              Add
            </button>
          ) : (
            <button
              className="btn btn-secondary me-2 mb-2"
              onClick={() => updatehandle()}
            >
              Update
            </button>
          )}
          <button className="btn btn-danger mb-2" onClick={() => clearhandle()}>
            Clear
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-striped mt-3 text-center">
            <thead className="table-primary">
              <tr className="border border-2 border-secondary">
                <th className="border border-2 border-secondary">ID</th>
                <th className="border border-2 border-secondary">Name</th>
                <th className="border border-2 border-secondary">Surname</th>
                <th className="border border-2 border-secondary">DOB</th>
                <th className="border border-2 border-secondary">STD</th>
                <th className="border border-2 border-secondary">Roll No</th>
                <th className="border border-2 border-secondary">GR No</th>
                <th className="border border-2 border-secondary">Subject</th>
                <th
                  className="border border-2 border-secondary text-center"
                  colSpan="2"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {formdata.map((item) => (
                <tr key={item.id}>
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
                    {item.Dob}
                  </td>
                  <td className="border border-2 border-secondary">
                    {item.Standard}
                  </td>
                  <td className="border border-2 border-secondary">
                    {item.RollNo}
                  </td>
                  <td className="border border-2 border-secondary">
                    {item.GRNo}
                  </td>
                  <td className="border border-2 border-secondary">
                    {item.Subject}
                  </td>
                  <td className="border border-2 border-secondary text-center">
                    <button
                      className="btn btn-success"
                      onClick={() => Edithandle(item.id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border border-2 border-secondary text-center">
                    <button
                      className="btn btn-danger"
                      onClick={() => Removehandle(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="d-flex justify-content-center mt-3">
            <BeatLoader color={"#2563EB"} loading={loading} size={10} />
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Home;
