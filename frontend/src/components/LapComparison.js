import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Skeleton } from 'antd';
import { Line, Scatter } from 'react-chartjs-2';

const Plot = () => {
  const [plotData, setPlotData] = useState(null);
  const [plotData2, setPlotData2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2021);
  const [race, setRace] = useState('Spanish Grand Prix');
  const [raceSession, setRaceSession] = useState('Q');
  const [driver1, setDriver1] = useState('HAM');
  const [driver2, setDriver2] = useState('VER');

  function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`/api/get-plot2?year=${year}&race=${race}&race_session=${raceSession}&driver1=${driver1}&driver2=${driver2}`);
      setPlotData(response.data['plot2']);
      const blob = new Blob([base64ToArrayBuffer(response.data['plot1'])], { type: 'image/png' });

      // const blob = new Blob([response.data['plot1']], { type: 'image/png' });
      const url = URL.createObjectURL(blob);
      setPlotData2(url);
      console.log(response.data['plot2'])
      console.log(response.data['plot1'])
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const chartData = {
    type: 'scatter',
    datasets: [
      {
        label: driver1,
        data: plotData ? plotData.line1: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        showLine: true,
        // borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: driver2,
        data: plotData ? plotData.line2: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        showLine: true,
        // borderWidth: 1,
        pointRadius: 0,
      },
    ]
    // options: {
    //   scales: {
    //     xAxes: [{
    //       stacked: true,
    //     }],
    //     yAxes: [{
    //       stacked: true,
    //     }],
    //   },
    // },
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Year:
          <input
            type="text"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </label>
        <label>
          Race:
          <input
            type="text"
            value={race}
            onChange={(event) => setRace(event.target.value)}
          />
        </label>
        <label>
          Race Session:
          <input
            type="text"
            value={raceSession}
            onChange={(event) => setRaceSession(event.target.value)}
          />
        </label>
        <label>
          Driver 1:
          <input
            type="text"
            value={driver1}
            onChange={(event) => setDriver1(event.target.value)}
          />
        </label>
        <label>
          Driver 2:
          <input
            type="text"
            value={driver2}
            onChange={(event) => setDriver2(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {loading ? (
        <Card style={{ width: 600, marginTop: 16 }}>
          <Skeleton loading={loading} active />
        </Card>
      ) : (
        <Card style={{ width: 600, marginTop: 16 }}>
          <Scatter data={chartData} />
        </Card>
      )}
              {loading ? (
        <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={loading} avatar active />
        </Card>
        ) : (
        <Card style={{ width: 300, marginTop: 16 }}>
            <img src={plotData2} alt="Plot" style={{ width: '100%', height: 'auto' }} />
        </Card>
      )}
    </div>
  );
};

export default Plot;
