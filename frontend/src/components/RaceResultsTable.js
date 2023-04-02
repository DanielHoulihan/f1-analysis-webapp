import React, { useEffect, useState } from "react";
import '../App.css';


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
              {/* <td>{result.grid}</td> */}
              <td>{result.points}</td>
            </tr>
          ))}
        </React.Fragment>
      );
    });
  
    return (
      <table>
        <tbody>
          {raceRows}
        </tbody>
      </table>
    );
  }

  export default RaceResultsTable;
