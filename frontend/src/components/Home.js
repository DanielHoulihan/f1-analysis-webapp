import React, { useEffect, useState } from "react";
import { Card, DatePicker } from "antd";
import "../css/Home.css";
import Countdown from "react-countdown";
import axios from "axios";

function Home() {
  const [countdownDate, setCountdownDate] = useState(Date.now() + 1000000);
  const [nextRace, setNextRace] = useState(null);
  const [races, setRaces] = useState([]);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get("/api/schedule/");
      setRaces(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  useEffect(() => {
    // Filter and sort the races by date
    const filteredRaces = races.filter(race => new Date(race.date) > new Date());
    filteredRaces.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    // Set the countdown date and race name to the date and name of the first race
    if (filteredRaces.length > 0) {
      const firstRace = filteredRaces[0];
      const countdownDate = new Date(firstRace.date + 'T' + firstRace.time);
      setCountdownDate(countdownDate.valueOf());
      setNextRace({
        race_name: firstRace.race_name,
        time: countdownDate
      });
    }
  }, [races]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render nothing after the countdown is completed
      return null;
    } else {
      // Pad single-digit numbers with leading zeros
      const formatNumber = num => String(num).padStart(2, '0');
    
      // Render the countdown in the format "x days, y hours, z minutes, w seconds, at hh:mm:ss"
      // const timeString = nextRace ? `at ${nextRace.time.toLocaleTimeString()}` : "";
      return (
        <span>
          <div className="countdown-wrapper">
            <div>
            <span id="days">{days > 0 ? (days < 10 ? `0${days}` : days) : "00"}</span>
              <small>Days</small>
            </div>
            <div>
            <span id="hours">{hours > 0 ? (hours < 10 ? `0${hours}` : hours) : "00"}</span>
              <small>Hours</small>
            </div>
            <div>
              <span id="minutes">{minutes > 0 ? (minutes < 10 ? `0${minutes}` : minutes) : "00"}</span>
              <small>Minutes</small>
            </div>
            <div>
              <span id="seconds">{seconds > 0 ? (seconds < 10 ? `0${seconds}` : seconds) : "00"}</span>
              <small>Seconds</small>
            </div>
          </div>
        </span>
      );
    }
  };
  
  
  

  return (
    <>
      <h1>Home page!</h1>
      <div className="site-card-border-less-wrapper">
        <Card title={`Next race: ${nextRace ? nextRace.race_name : ''}`} bordered={false} style={{ width: 400 }}>
          <h2 className="countdown-title"><Countdown key={countdownDate} date={countdownDate} renderer={renderer} /></h2>
        </Card>
      </div>
    </>
  );

  
}

export default Home;
