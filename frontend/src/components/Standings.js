import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function Standings(){

    const [resultList, setResultList] = useState([]);
    const [raceList, setRaceList] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedTable, setSelectedTable] = useState("driver"); // Add state variable for selected table

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
      
    // Function to toggle between driver and constructor tables
    const toggleTable = () => {
        setSelectedTable(selectedTable === "driver" ? "constructor" : "driver");
    };

    const tableToDisplay = selectedTable === "driver" ? driverResults : constructorResults; // Determine which table to display based on selectedTable state
      
    return (
        <>
            <div>
                <label htmlFor="yearSelect">Select year</label>
                <select value={selectedYear} onChange={handleYearChange}>
                    {yearOptions}
                </select>
            </div>
            <button onClick={toggleTable}> {/* Add button to toggle between driver and constructor tables */}
                        {selectedTable === "driver" ? "View Constructors" : "View Drivers"}
            </button>

            <div style={{display: "flex", gap:"40px"}}>
                <div style={{flex: 1}}>
                    <h2>{selectedTable === "driver" ? "Driver" : "Constructor"} Standings</h2> {/* Use selectedTable state to determine which table header to display */}
                    <table>
                        <thead>
                            <tr>
                                {selectedTable === "driver" && <th>Driver</th>} {/* Display driver column header if selectedTable is driver */}
                                <th>Constructor</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableToDisplay.map((result) => (
                                <tr key={selectedTable === "driver" ? `${result.driver}_${result.constructor}` : result.constructor}>
                                    {selectedTable === "driver" && <td>{result.driver}</td>} {/* Display driver column if selectedTable is driver */}
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
