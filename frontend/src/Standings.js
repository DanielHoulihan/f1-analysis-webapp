import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function Standings(){

    const [resultList, setResultList] = useState([]);
    const [raceList, setRaceList] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
  
    const fetchRaces = async () => {
      try {
        const res = await axios.get("/api/races/");
        setRaceList(res.data);
        setSelectedYear(res.data[0].season);
      } catch (err) {
        console.log(err);
      }
    };
  
    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/standings/?year=${selectedYear}`);
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
      if (selectedYear) {
        fetchResults();
      }
    }, [selectedYear]);
  
    // Generate year options for select input
    const yearOptions = Array.from(new Set(raceList.map((race) => race.season))).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  
    // Handle year select input change
    const handleYearChange = async (event) => {
      const newSelectedYear = event.target.value;
      setSelectedYear(newSelectedYear);
    };
  
    const resultsByDriverAndConstructor = resultList.reduce((accumulator, result) => {
        const { driver, constructor, points } = result;
        const driverKey = `${driver}_${constructor}`;
        const constructorKey = constructor;
        accumulator.driver[driverKey] = accumulator.driver[driverKey] || { driver, constructor, points: 0 };
        accumulator.driver[driverKey].points += parseFloat(points);
        accumulator.constructor[constructorKey] = accumulator.constructor[constructorKey] || { constructor, points: 0 };
        accumulator.constructor[constructorKey].points += parseFloat(points);
        return accumulator;
      }, { driver: {}, constructor: {} });
      
    const driverResults = Object.values(resultsByDriverAndConstructor.driver);
    driverResults.sort((a, b) => b.points - a.points);

    const constructorResults = Object.values(resultsByDriverAndConstructor.constructor);
    constructorResults.sort((a, b) => b.points - a.points);
      

      
    return (
        <>
<div>
  <label htmlFor="yearSelect">Select year:</label>
  <select value={selectedYear} onChange={handleYearChange}>
    {yearOptions}
  </select>
</div>

<div style={{display: "flex", gap:"40px"}}>
  <div style={{flex: 1}}>
    <h2>Driver Standings:</h2>
    <table>
      <thead>
        <tr>
          <th>Driver</th>
          <th>Constructor</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {driverResults.map((result) => (
          <tr key={`${result.driver}_${result.constructor}`}>
            <td>{result.driver}</td>
            <td>{result.constructor}</td>
            <td>{result.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div style={{flex: 1}}>
    <h2>Constructor Standings:</h2>
    <table>
      <thead>
        <tr>
          <th>Constructor</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {constructorResults.map((result) => (
          <tr key={result.constructor}>
            <td>{result.constructor}</td>
            <td>{result.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </>
      );
  }


  export default Standings;
