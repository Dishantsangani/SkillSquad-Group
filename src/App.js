import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Page/Home";
import Student from "./Page/Student";
import Grade from "./Page/Grade";
import Result from "./Page/Result";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<Student />} />
          <Route path="/grade" element={<Grade />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
