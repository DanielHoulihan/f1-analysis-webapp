import "../css/Circuits.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";

function RaceCard({ raceName, location, races }) {
    const seasons = [];
  
    // Group consecutive seasons into ranges
    let startSeason = races[0].season;
    let endSeason = races[0].season;
    for (let i = 1; i < races.length; i++) {
      if (races[i].season === endSeason + 1) {
        endSeason = races[i].season;
      } else {
        seasons.push(endSeason === startSeason ? `${startSeason}` : `${startSeason}-${endSeason}`);
        startSeason = races[i].season;
        endSeason = races[i].season;
      }
    }
    seasons.push(endSeason === startSeason ? `${startSeason}` : `${startSeason}-${endSeason}`);
  
    return (
      <Card title={`${raceName} - ${location}`}>
        <p>Seasons: {seasons.join(", ")}</p>
      </Card>
    );
  }
  
  

function Circuits() {
  const [raceList, setRaceList] = useState([]);

  const fetchRaces = async () => {
    try {
      const res = await axios.get("/api/races/");
      setRaceList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch race list on component mount
  useEffect(() => {
    fetchRaces();
  }, []);

  // Create array of unique race names
  const raceNames = [...new Set(raceList.map(race => race.circuit_name))];

  return (
    <>
      <h1>Circuits</h1>
      {raceNames.map(raceName => {
        // Filter raceList to create an array of races that match the current race name
        const races = raceList.filter(race => race.circuit_name === raceName);
        // Get the location of the first race in the races array
        const location = races.length > 0 ? races[0].location : '';
        return <RaceCard key={raceName} raceName={raceName} location={location} races={races} />;
      })}
    </>
  );
  
}

export default Circuits;
