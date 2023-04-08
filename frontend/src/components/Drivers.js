import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Drivers.css";
import Chart from 'chart.js/auto';
import { Slider } from 'antd';

function Drivers(){

  const [driverList, setDriverList] = useState([]);
  const [resultList, setResultList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [chartInstance, setChartInstance] = useState(null);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get("/api/drivers/");
      setDriverList(res.data);
      setSelectedDriver(res.data[0].driver_id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchResults = async (driverName, startYear = "", endYear = "") => {
    try {
      const res = await axios.get(`/api/results/?driver=${driverName}&start_year=${startYear}&end_year=${endYear}`);
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
  for (let i = 1950; i <= currentYear; i++) {
    yearOptions.push(<option key={i} value={i}>{i}</option>);
  }


  const handleStartYearChange = async (event) => {
    const newStartYear = event.target.value;
    setStartYear(newStartYear);
  };

  const handleEndYearChange = async (event) => {
    const newEndYear = event.target.value;
    setEndYear(newEndYear);
  };
     

  const driverOptions = Array.from(new Set(driverList.map((race) => race.driver_id))).map((driver) => (
    <option key={driver} value={driver}>
      {driver}
    </option>
  ));

  const handleDriverChange = async (event) => {
    const newSelectedDriver = event.target.value;
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
        },
        options: {
          legend: {
            display: false
          }
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

  return (
    <>
      <div>
        <label htmlFor="driverSelect"><h3>Select a driver:</h3></label>
        <select value={selectedDriver} onChange={handleDriverChange} id="driverSelect">
          {driverOptions}
        </select>
      </div>
      <Slider
  range
  defaultValue={[1950, currentYear]}
  min={1950}
  max={currentYear}
  onChange={(values) => {
    setStartYear(values[0]);
    setEndYear(values[1]);
  }}
/>


      {driverList.filter(driver => driver.driver_id === selectedDriver).map((driver) => (
        <tr key={driver.driver_id}>
          <td>{driver.driver_name}</td>
          <td>{driver.nationality}</td>
          <td>Total points: {totalPoints}</td>
          <td>Wins: {countFirstPositions}</td>
          <td>Podiums: {countPodiums}</td>
          <td>Average Position: {roundedMeanPosition}</td>
        </tr>
      ))}
      <div className="graph-content">
        <canvas ref={chartRef} id="myChart"></canvas>
      </div>
    </>
  );
  
}

export default Drivers