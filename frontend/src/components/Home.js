import React, { useState } from "react";
import { Card, DatePicker } from "antd";
import "../css/Home.css";
import Countdown from "react-countdown";

function Home() {
  const [countdownDate, setCountdownDate] = useState(Date.now() + 1000000);

  const handleDateChange = (date, dateString) => {
    if (date) {
      setCountdownDate(date.valueOf());
    }
  };

  return (
    <>
    <h1>Home page!</h1>
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
