import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Results from "./Results";
import Home from "./Home";
import Standings from "./Standings";


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
            </ul>
          </nav>
        </div>
        <div className="content" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <Routes>
            <Route path="/results" element={ <Results />}/>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
