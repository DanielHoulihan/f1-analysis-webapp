import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import RaceResultsTable from './RaceResultsTable'

function Home() {
  return <h1>Welcome to the home page!</h1>;
}

function App() {
  const [resultList, setResultList] = useState([]);
  const [raceList, setRaceList] = useState([]);
  const [selectedRace, setSelectedRace] = useState("");

  useEffect(() => {
    axios
      .get("/api/races/")
      .then((res) => {
        const races = res.data;
        console.log(races)
        setRaceList(races);
        setSelectedRace(races[0].race_name); // set the first race as selected
      })
      .catch((err) => console.log(err));
  }, []);
  
  useEffect(() => {
    if (selectedRace) {
      axios
        .get(`/api/results/?race=${selectedRace}`)
        .then((res) => {
          const resultList = res.data;
          console.log(resultList);
          setResultList(resultList);
        })
        .catch((err) => console.log(err));
    }
  }, [selectedRace]);
  
  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
  };

  const races = {};
  for (const result of resultList) {
    const raceName = result.race.race_name;
    if (!races[raceName]) {
      races[raceName] = [];
    }
    races[raceName].push(result);
  }

  const raceOptions = raceList.map((race) => (
    <option key={race.race_name} value={race.race_name}>
      {race.race_name}
    </option>
  ));

  return (
    <BrowserRouter>
      <div>
        <div className="nav">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/analysis">Analysis</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content" style={{ paddingLeft: '10%',paddingRight: '10%'  }}>
        <Routes>
          <Route
            path="/analysis"
            element={
              <>
                <select value={selectedRace} onChange={handleRaceChange}>
                  {raceOptions}
                </select>
                <RaceResultsTable races={races} selectedRace={selectedRace} />
              </>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );

  function RaceResultsTable({ races, selectedRace }) {
    const raceRows = Object.entries(races).map(([raceName, results]) => {
      if (selectedRace && selectedRace !== raceName) {
        return null;
      }
      return (
        <React.Fragment key={raceName}>
          <tr>
            <td colSpan="10" className="race-header">
              <h1>{raceName}</h1>
              <p>{results[0].race.date}</p>
            </td>
          </tr>
          <tr className="header">
            <th></th>
            <th>Driver</th>
            <th>Constructor</th>
            <th>Points</th>
          </tr>
          {results.map((result, index) => (
          <tr key={result.id}>
            <td>{index + 1}</td>
            <td>{result.driver}</td>
            <td>{result.constructor}</td>
            <td>{result.points}</td>
          </tr>
        ))}
        </React.Fragment>
      );
    });
  
    return <table><tbody>{raceRows}</tbody></table>;
  }
  
}
export default App;