import "../css/Schedule.css"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "antd";
import testImage from '../circuits/bahrain2023.png';


function Schedule() {
  const [raceList, setRaceList] = useState([]);

  const fetchRaces = async () => {
    try {
      const res = await axios.get("/api/schedule/");
      setRaceList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch race list on component mount
  useEffect(() => {
    fetchRaces();
  }, []);

  return (
    <div className="card-container">

      {raceList.map((race) => (
        <Card 
        className="c" title={`Round ${race.round}`} 
        >
            <p>{race.circuit_name}</p>
            <p>Location: {race.location}</p>
            <p>Date: {race.date} {race.time}</p>
            <img src={testImage} alt="Bahrain Circuit" style={{ width: "50%", height: "auto"}}/>
        </Card>
      ))}
    </div>
  );
  
}

export default Schedule;
