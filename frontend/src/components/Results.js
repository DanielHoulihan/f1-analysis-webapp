import React, { useState, useEffect } from "react";
import axios from "axios";
import RaceResultsTable from "./RaceResultsTable";
import "../App.css";

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
                className={selectedRace === race.race_name ? "selected" : ""}
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
                className={selectedYear === year ? "selected" : ""}
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
  
    return (
        <>
          <div className="return-container">
            <div>
                <label>Year</label>
                <div className="scrollable-container">
                <ul>{yearButtons}</ul>
                </div>
            </div>
            {selectedYear && (
                <div>
                <label>Race</label>
                <div className="scrollable-container">
                <ul>{raceButtons}</ul>
                </div>
                </div>
            )}
            </div>
          {selectedRace && (
            <RaceResultsTable races={races} selectedRace={selectedRace} />
          )}
        </>
      );
      
  }
  
  export default Results;
  