import React, { useEffect, useState } from "react";
import { Card, DatePicker } from "antd";
import "../css/Home.css";
import Countdown from "react-countdown";
import axios from "axios";

function Home() {
  const [countdownDate, setCountdownDate] = useState(Date.now() + 1000000);



  const fetchSchedule = async () => {
    try {
      const res = await axios.get("/api/schedule/");
      console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleDateChange = (date, dateString) => {
    if (date) {
      setCountdownDate(date.valueOf());
    }
  };

  return (
    <>
    <h1>Home page!</h1>
    <h3>Time until next race, top 3 of previous race, top 3 constructors, top 3 drivers - all clickable</h3>
    <div className="site-card-border-less-wrapper">
      <Card title="Next race:" bordered={false} style={{ width: 400 }}>
        <h2 className="countdown-title"><Countdown key={countdownDate} date={countdownDate} /></h2>
        <DatePicker onChange={handleDateChange} />
      </Card>
    </div>
    </>
  );
}

export default Home;
