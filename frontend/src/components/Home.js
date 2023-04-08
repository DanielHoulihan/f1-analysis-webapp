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
      setCountdownDate(new Date(filteredRaces[0].date).valueOf());
      setNextRace(filteredRaces[0].race_name);
    }
  }, [races]);

  const handleDateChange = (date, dateString) => {
    if (date) {
      setCountdownDate(date.valueOf());
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render nothing after the countdown is completed
      return null;
    } else {
      // Render the countdown in the format "x days, y hours, z minutes, w seconds"
      return (
        <span>
          {days > 0 ? `${days} days, ` : ""}
          {hours > 0 ? `${hours} hours, ` : ""}
          {minutes > 0 ? `${minutes} minutes, ` : ""}
          {seconds > 0 ? `${seconds} seconds` : ""}
        </span>
      );
    }
  };

  return (
    <>
      <h1>Home page!</h1>
      <h3>Time until next race: {nextRace}</h3>
      <div className="site-card-border-less-wrapper">
        <Card title="Next race:" bordered={false} style={{ width: 400 }}>
          <h2 className="countdown-title"><Countdown key={countdownDate} date={countdownDate} renderer={renderer} /></h2>
          <DatePicker onChange={handleDateChange} />
        </Card>
      </div>
    </>
  );
}

export default Home;
