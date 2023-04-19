import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Select } from "antd";
import "../css/Results.css"

const { Option } = Select;

function Results(){

    const [resultList, setResultList] = useState([]);
    const [raceList, setRaceList] = useState([]);
    const [filteredRaceList, setFilteredRaceList] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedRace, setSelectedRace] = useState("");
    const [allYears, setAllYears] = useState([]);

    const fetchRaces = async () => {
      try {
        // const res = await axios.get('/api/races');
        const res = await axios.get('https://dhoulihan.pythonanywhere.com/api/races/');
        
        setRaceList(res.data);
        setFilteredRaceList(res.data.filter(race => race.season.toString() === res.data[0].season.toString()));
        setSelectedYear(res.data[0].season.toString());
        setSelectedRace(res.data[0].race_name);
        const seasons = res.data.map(item => item.season);
        setAllYears([...new Set(seasons)]);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchResults = async (race_name, year) => {
      try {
        // const res = await axios.get(`/api/results/?race=${race_name}&year=${year}`);
        const res = await axios.get(`https://dhoulihan.pythonanywhere.com/api/results/?race=${race_name}&year=${year}`);
        
        setResultList(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const handleYearChange = (value) => {
      setSelectedYear(value);
      const filteredRaces = raceList.filter(race => race.season.toString() === value.toString());
      if (filteredRaces.length > 0) {
        setFilteredRaceList(filteredRaces);
        setSelectedRace(filteredRaces[0].race_name);
      } else {
        setFilteredRaceList([]);
        setSelectedRace("");
      }
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
          {allYears.map(year => (
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
            {filteredRaceList.map(race => (
              <Option key={race.race_name} value={race.race_name}>
                {race.race_name}
              </Option>
            ))}
          </Select>
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
