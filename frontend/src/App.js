import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Results from "./components/Results";
import Home from "./components/Home";
import Standings from "./components/Standings";
import Drivers from "./components/Drivers";
import Constructors from "./components/Constructors"
import Circuits from "./components/Circuits"


function App() {
  return (
    <BrowserRouter>
      <div>
        <div className="navbar">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/results">Results</Link>
              </li>
              <li>
                <Link to="/standings">Standings</Link>
              </li>
              <li>
                <Link to="/drivers">Drivers</Link>
              </li>
              <li>
                <Link to="/constructors">Constructors</Link>
              </li>
              <li>
                <Link to="/circuits">Circuits</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <Routes>
            <Route path="/results" element={ <Results />}/>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/constructors" element={<Constructors />} />
            <Route path="/circuits" element={<Circuits />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
