import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Drivers.css";
import Chart from 'chart.js/auto';
import { Slider, Card, Select } from 'antd';

const { Option } = Select;

function Constructors(){

  const [driverList, setDriverList] = useState([]);
  const [resultList, setResultList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [chartInstance, setChartInstance] = useState(null);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("/api/constructors/");
      setDriverList(res.data);
      setSelectedDriver(res.data[0].constructor_id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchResults = async (driverName, startYear = "", endYear = "") => {
    try {
      const res = await axios.get(`/api/results/?constructor=${driverName}&start_year=${startYear}&end_year=${endYear}`);
      setResultList(res.data);
      const years = res.data.map(result => result.year);
      return {
        minYear: Math.min(...years),
        maxYear: Math.max(...years),
      };
    } catch (err) {
      console.log(err);
    }
  };
  
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = 1980; i <= currentYear; i++) {
    yearOptions.push(<option key={i} value={i}>{i}</option>);
  }

  const driverOptions = Array.from(new Set(driverList.map((race) => race.constructor_id))).map((driver) => (
    <Option key={driver} value={driver}>
      {driver}
    </Option>
  ));

  const handleDriverChange = async (event) => {
    const newSelectedDriver = event;
    setSelectedDriver(newSelectedDriver);
  };

  const chartRef = useRef(null);

  useEffect(() => {
    if (selectedDriver !== "") {
      fetchResults(selectedDriver, startYear, endYear);
    }
  }, [selectedDriver, startYear, endYear]);
  
  
  useEffect(() => {
    if (resultList.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      const labels = resultList.map((result) => result.race.race_name + ' ' + result.race.season);
      const data = resultList.map((result) => result.points);
      if (chartInstance) {
        chartInstance.destroy();
      }
      const newChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Points",
              data: data,
              fill: false,
              tension: 0.1,
            },
          ],
        }
      });
      setChartInstance(newChartInstance);
    }
  
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [resultList]);

  const totalPoints = resultList.reduce((acc, result) => acc + parseInt(result.points), 0);
  const countFirstPositions = resultList.filter(result => result.position === 1).length;
  const countPodiums = resultList.filter(result => parseInt(result.position) === 1 || parseInt(result.position) === 2 || parseInt(result.position) === 3).length;
  const sumPositions = resultList.reduce((acc, result) => acc + result.position, 0);
  const avgPosition = sumPositions / resultList.length;
  const roundedMeanPosition = avgPosition.toFixed(1);

  const gridStyle = {
    width: '15%',
    textAlign: 'center',
    height: '15px',
    color: '#112a45'
  };

  return (
    <>
      <div>
      <Select
          value={selectedDriver}
          onChange={handleDriverChange}
          id="driverSelect">
          {driverOptions}
      </Select>

      </div>
      <Card bordered={false} style={{ width: 400}}>
        <Slider
          range
          defaultValue={[1980, currentYear]}
          min={1980}
          max={currentYear}
          onChange={(values) => {
            setStartYear(values[0]);
            setEndYear(values[1]);
          }}
        />
      </Card>
      {driverList.filter(driver => driver.constructor_id === selectedDriver).map((driver) => (
      <Card >
        <Card.Grid style={gridStyle}>{driver.constructor_name}</Card.Grid>
        <Card.Grid style={gridStyle}>{driver.nationality}</Card.Grid>
        <Card.Grid style={gridStyle}>Wins: {countFirstPositions}</Card.Grid>
        <Card.Grid style={gridStyle}>Total points: {totalPoints}</Card.Grid>
        <Card.Grid style={gridStyle}>Podiums: {countPodiums}</Card.Grid>
        <Card.Grid style={gridStyle}>Average Position: {roundedMeanPosition}</Card.Grid>
      </Card>
      ))}
      <div className="graph-content">
        <canvas ref={chartRef} id="myChart"></canvas>
      </div>
    </>
  );
  
}

export default Constructors