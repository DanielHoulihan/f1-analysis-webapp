import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Results.css";

function Results(){

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
  
    const fetchResults = async (raceName, year) => {
      try {
        const res = await axios.get(`/api/results/?race=${raceName}&year=${year}`);
        setResultList(res.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    // Fetch race list on component mount
    useEffect(() => {
      fetchRaces();
    }, []);
  
    // Fetch results on selected year and race change
    useEffect(() => {
      if (selectedRace && selectedYear) {
        fetchResults(selectedRace, selectedYear);
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
  
    const raceButtons = raceList.map((race) => {
        if (race.season === parseInt(selectedYear)) {
          return (
            <li key={race.race_name}>
              <button
                className="button2"
                onClick={() => {
                  setSelectedRace(race.race_name);
                }}
              >
                {race.race_name}
              </button>
            </li>
          );
        } else {
          return null;
        }
      });
      
  
    const yearButtons = Array.from(new Set(raceList.map((race) => race.season))).map((year) => (
        <li>
            <button
                key={year}
                className="button1"
                onClick={() => {
                const racesOfYear = raceList.filter((race) => race.season === parseInt(year));
                if (racesOfYear.length > 0) {
                    setSelectedRace(racesOfYear[0].race_name);
                    setSelectedYear(year);
                    fetchResults(racesOfYear[0].race_name, year);
                } else {
                    setSelectedRace("");
                    setSelectedYear("");
                    setResultList([]);
                }
                }}
            > {year}
            </button>
            </li>
    ));

    function RaceResultsTable({ races, selectedRace }) {
      const raceRows = Object.entries(races).map(([raceName, results]) => {
        if (selectedRace && selectedRace !== raceName) {
          return null;
        }
        return (
          <React.Fragment key={raceName}>
          <tr>
            <td colSpan="10" className="race-header">
              <h2>{raceName} {results[0].race.date}</h2>
              {/* <p>{results[0].race.date}</p> */}
            </td>
          </tr>
          <tr className="header">
            <th>#</th>
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
    
      return (
        <table className="styled_table">
          <tbody>
            {raceRows}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container">
        <div className="buttons">
          <div>
            {/* <label>Year</label> */}
            <div className="scrollable-container1">
              <ul>{yearButtons}</ul>
            </div>
          </div>
          {selectedYear && (
            <div>
              {/* <label>Race</label> */}
              <div className="scrollable-container2">
                <ul>{raceButtons}</ul>
              </div>
            </div>
          )}
        </div>
        {selectedRace && (
          <div className="results">
            <RaceResultsTable races={races} selectedRace={selectedRace} />
          </div>
        )}
      </div>
    );
    
      
  }
  
  export default Results;
  