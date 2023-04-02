import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../App.css";
import Chart from 'chart.js/auto';

function Analysis(){

    const [driverList, setDriverList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState("");
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

    const fetchResults = async (driverName) => {
      try {
        const res = await axios.get(`/api/results/?driver=${driverName}`);
        setResultList(res.data);
      } catch (err) {
        console.log(err);
      }
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
        fetchResults(selectedDriver);
      }
    }, [selectedDriver]);
    
    
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
    
    return (
      <>
        <div>
          <label htmlFor="driverSelect"></label>
          <select value={selectedDriver} onChange={handleDriverChange}>
              {driverOptions}
          </select>
        </div>
        {driverList.filter(driver => driver.driver_id === selectedDriver).map((driver) => (
          <tr>
            <td>{driver.driver_name}</td>
            <td>{driver.nationality}</td>
          </tr>
        ))}
        <canvas ref={chartRef} id="myChart"></canvas>
    </>
    )
}

export default Analysis