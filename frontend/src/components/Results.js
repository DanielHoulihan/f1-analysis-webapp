import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Select } from "antd";
import "../css/Results.css"

const { Option } = Select;

function Results(){

    const [resultList, setResultList] = useState([]);
    const [raceList, setRaceList] = useState([]);
    const [yearList, setYearList] = useState([]); // Add yearList state variable
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedRace, setSelectedRace] = useState("");
  
    const fetchRaces = async () => {
      try {
        const res = await axios.get("/api/races/");
        const uniqueYears = [...new Set(res.data.map(race => race.season))];
        setYearList(uniqueYears);
        console.log("x")
        setSelectedYear(uniqueYears[0]);
        setRaceList(res.data.filter(race => race.season === uniqueYears[0]));
        setSelectedRace(res.data[0].race_name);
      } catch (err) {
        console.log(err);
      }
    };
  
    const fetchResults = async (raceName, year) => {
      try {
        const res = await axios.get(`/api/results/?race=${raceName}&year=${year}`);
        setResultList(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const handleYearChange = (value) => {
      console.log(selectedYear)
      setSelectedYear(value);
      console.log(selectedYear)
      const filteredRaces = raceList.filter(race => race.season === value.toString());
      console.log(filteredRaces)
      setRaceList(filteredRaces);
      console.log(filteredRaces)

      setSelectedRace(filteredRaces[0].race_name);
    }
    
  
    const handleRaceChange = (value) => {
      setSelectedRace(value);
    }
  
    useEffect(() => {
      fetchRaces();
    }, []);
  
    useEffect(() => {
      if (selectedRace && selectedYear) {
        fetchResults(selectedRace, selectedYear);
      }
    }, [selectedRace, selectedYear]);
  
    const races = resultList.reduce((acc, result) => {
      const raceName = result.race.race_name;
      if (!acc[raceName]) {
        acc[raceName] = [];
      }
      acc[raceName].push(result);
      return acc;
    }, {});  

    return (
      <>
        <div className="filters">
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
          >
            {yearList.map(year => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Select
            value={selectedRace}
            onChange={handleRaceChange}
            style={{ width: 240 }}
          >
            {raceList.map(race => (
              <Option key={race.race_name} value={race.race_name}>
                {race.race_name}
              </Option>
            ))}
          </Select>
          <Button type="primary">Search</Button>
        </div>
        <Table
          dataSource={races[selectedRace]}
          rowKey={(record, index) => index}
          pagination={false}
          columns={[
            {
              title: '#',
              dataIndex: '',
              key: 'index',
              width: 40,
              render: (_, __, index) => index + 1,
            },
            {
              title: 'Driver',
              dataIndex: 'driver',
              key: 'driver',
              width: 300,
            },
            {
              title: 'Constructor',
              dataIndex: 'constructor',
              key: 'constructor',
              width: 300,
            },
            {
              title: 'Points',
              dataIndex: 'points',
              key: 'points',
              width: 300,
            },
          ]}
        />
      </>
    );
  }
  
  export default Results;
