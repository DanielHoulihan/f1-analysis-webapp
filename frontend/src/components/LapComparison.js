import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Skeleton } from 'antd';
import { Scatter } from 'react-chartjs-2';

const Plot = () => {
  const [plotData, setPlotData] = useState(null);
  const [plotData2, setPlotData2] = useState(null);
  const [plotData3, setPlotData3] = useState(null);
  const [plotData4, setPlotData4] = useState(null);
  const [plotData5, setPlotData5] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2021);
  const [race, setRace] = useState('Spanish Grand Prix');
  const [raceSession, setRaceSession] = useState('Q');
  const [driver1, setDriver1] = useState('HAM');
  const [driver2, setDriver2] = useState('VER');

  const gridStyle = {
    width: '50%',
    textAlign: 'center',
    color: '#112a45'
  };

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
      // const response = await axios.get(`https://dhoulihan.pythonanywhere.com/api/get-plot2?year=${year}&race=${race}&race_session=${raceSession}&driver1=${driver1}&driver2=${driver2}/`);
      setPlotData(response.data['plot2']);


      const blob1 = new Blob([base64ToArrayBuffer(response.data['plot1'])], { type: 'image/png' });
      const url1 = URL.createObjectURL(blob1);
      setPlotData2(url1);

      const blob2 = new Blob([base64ToArrayBuffer(response.data['plot3'])], { type: 'image/png' });
      const url2 = URL.createObjectURL(blob2);
      setPlotData3(url2);

      const blob3 = new Blob([base64ToArrayBuffer(response.data['plot4'])], { type: 'image/png' });
      const url3 = URL.createObjectURL(blob3);
      setPlotData4(url3);

      const blob4 = new Blob([base64ToArrayBuffer(response.data['plot5'])], { type: 'image/png' });
      const url4 = URL.createObjectURL(blob4);
      setPlotData5(url4);

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
        pointRadius: 0,
      },
      {
        label: driver2,
        data: plotData ? plotData.line2: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        showLine: true,
        pointRadius: 0,
      },
    ]
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
        <Card style={{ width: '100%', marginTop: 16}}>
          <Skeleton loading={loading} active />
        </Card>
      ) : (
        <Card style={{ width: '100%', marginTop: 16}}>
          <Scatter data={chartData} />
        </Card>
      )}

      <Card >
        <Card.Grid style={gridStyle}>
        {loading ? (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <Skeleton loading={loading} active />
          </Card>
          ) : (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <img src={plotData2} alt="Plot" style={{ width: '100%', height: 'auto' }} />
          </Card>
        )}
        </Card.Grid>

        <Card.Grid style={gridStyle}>
        {loading ? (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <Skeleton loading={loading} active />
          </Card>
          ) : (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <img src={plotData3} alt="Plot" style={{ width: '100%', height: 'auto' }} />
          </Card>
        )}
        </Card.Grid>
        </Card>


        <Card>
        <Card.Grid style={gridStyle}>
        {loading ? (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <Skeleton loading={loading} active />
          </Card>
          ) : (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <img src={plotData4} alt="Plot" style={{ width: '100%', height: 'auto' }} />
          </Card>
        )}
        </Card.Grid>


        <Card.Grid style={gridStyle}>
        {loading ? (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <Skeleton loading={loading} active />
          </Card>
          ) : (
          <Card style={{ width: '100%', marginTop: 16 }}>
              <img src={plotData5} alt="Plot" style={{ width: '100%', height: 'auto' }} />
          </Card>
        )}
        </Card.Grid>
      </Card>

{/* 
      {loading ? (
        <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={loading} active />
        </Card>
        ) : (
        <Card style={{ width: 300, marginTop: 16 }}>
            <img src={plotData3} alt="Plot2" style={{ width: '100%', height: 'auto' }} />
        </Card>
      )}

      {loading ? (
        <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={loading} active />
        </Card>
        ) : (
        <Card style={{ width: 300, marginTop: 16 }}>
            <img src={plotData4} alt="Plot4" style={{ width: '100%', height: 'auto' }} />
        </Card>
      )}
      {loading ? (
        <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={loading} active />
        </Card>
        ) : (
        <Card style={{ width: 300, marginTop: 16 }}>
            <img src={plotData5} alt="Plot5" style={{ width: '100%', height: 'auto' }} />
        </Card>
      )} */}


    </div>
  );
};

export default Plot;
