import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import RaceResultsTable from "./RaceResultsTable";
import "./App.css";

function Home() {
  return <h1>Welcome to the home page!</h1>;
}

function App() {
  const [resultList, setResultList] = useState([]);
  const [raceList, setRaceList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRace, setSelectedRace] = useState("");

  const fetchRaces = async () => {
    try {
      const res = await axios.get("/api/races/");
      setRaceList(res.data);
      setSelectedRace(res.data[0].race_name);
      setSelectedYear(res.data[0].season);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch race list on component mount
  useEffect(() => {

    fetchRaces();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`/api/results/?race=${selectedRace}&year=${selectedYear}`);
      setResultList(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // Fetch results on selected year and race change
  useEffect(() => {

    if (selectedRace && selectedYear) {
      fetchResults();
    }
  }, [selectedRace, selectedYear]);

  // Group results by race
  const races = resultList.reduce((acc, result) => {
    const raceName = result.race.race_name;
    if (!acc[raceName]) {
      acc[raceName] = [];
    }
    acc[raceName].push(result);
    return acc;
  }, {});

  // Generate year options for select input
  const yearOptions = Array.from(new Set(raceList.map((race) => race.season))).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));

  // Generate race options for select input
  const raceOptions = raceList
    .filter((race) => race.season === parseInt(selectedYear))
    .map((race) => (
      <option key={race.race_name} value={race.race_name}>
        {race.race_name}
      </option>
    ));

  // Handle year select input change
  const handleYearChange = async (event) => {
    const newSelectedYear = event.target.value;
    setSelectedYear(newSelectedYear);
    const racesOfYear = raceList.filter((race) => race.season === parseInt(newSelectedYear));
    if (racesOfYear.length > 0) {
      setSelectedRace(racesOfYear[0].race_name);
      const res = await axios.get(`/api/results/?race=${racesOfYear[0].race_name}&year=${newSelectedYear}`);
      setResultList(res.data);
    } else {
      setSelectedRace("");
      setResultList([]);
    }
  };

  // Handle race select input change
  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
  };

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
            <Route
              path="/results"
              element={
                <>
                  <div>
                    <label htmlFor="yearSelect">Select year:</label>
                    <select value={selectedYear} onChange={handleYearChange}>
                      {yearOptions}
                    </select>
                  </div>
                  {selectedYear && (
                    <div>
                      <label htmlFor="raceSelect">Select race:</label>
                      <select id="raceSelect" value={selectedRace} onChange={handleRaceChange}>
                        {raceOptions}
                      </select>
                    </div>
                  )}
                  {selectedRace && (
                    <RaceResultsTable races={races} selectedRace={selectedRace} />
                  )}
                </>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Home />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
  
}

export default App;
