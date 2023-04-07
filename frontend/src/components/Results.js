import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Results.css";
import { Table, Select, Button } from "antd";

const { Option } = Select;

function Results() {
  const [resultList, setResultList] = useState([]);
  const [raceList, setRaceList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedRace, setSelectedRace] = useState("");

  const fetchRaces = async () => {
    try {
      const res = await axios.get("/api/races/");
      setRaceList(res.data);
      setSelectedRace(res.data[0].race_name);
      setSelectedYear(res.data[0].season);
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

  // Fetch race list on component mount
  useEffect(() => {
    fetchRaces();
  }, []);

  // Fetch results on selected year and race change
  useEffect(() => {
    if (selectedRace && selectedYear) {
      fetchResults(selectedRace, selectedYear);
    }
  }, [selectedRace, selectedYear]);

  // Group results by race
  const races = resultList.reduce((acc, result) => {
    const raceName = result.race.race_name;
    if (!acc[raceName]) {
      acc[raceName] = [];
    }
    acc[raceName].push(result);
    return acc;
  }, {});

  const handleYearChange = (value) => {
    setSelectedYear(value);
    const racesOfYear = raceList.filter((race) => race.season === parseInt(value));
    if (racesOfYear.length > 0) {
      setSelectedRace(racesOfYear[0].race_name);
      fetchResults(racesOfYear[0].race_name, value);
    } else {
      setSelectedRace("");
      setResultList([]);
    }
  };

  const handleRaceChange = (value) => {
    setSelectedRace(value);
    fetchResults(value, selectedYear);
  };

  const yearOptions = Array.from(new Set(raceList.map((race) => race.season))).map((year) => {
    console.log('year:', year);
    return (
      <Option key={year} value={year}>
        {year}
      </Option>
    );
  });
  
  const raceOptions =
    selectedYear &&
    raceList
      .filter((race) => race.season.toString() === selectedYear)
      .map((race) => {
        console.log('race:', race.race_name);
        return (
          <Option key={race.race_name} value={race.race_name}>
            {race.race_name}
          </Option>
        );
      });
  

  
  
  return (
    <div className="container">
      <div className="buttons">
        <div>
          <Select defaultValue={selectedYear} onChange={handleYearChange}>
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </div>
        {selectedYear && (
          <div>
            <Select defaultValue={selectedRace} onChange={handleRaceChange}>
              {raceOptions
                .filter((race) => race.season === selectedYear)
                .map((race) => (
                  <Option key={race.race_name} value={race.race_name}>                    
                    {race.race_name}
                  </Option>
                ))}
            </Select>
          </div>
        )}
      </div>

      {selectedRace && (
      <div className="results">
      <h1>{selectedRace} {selectedYear}</h1>
      
        <Table
          dataSource={races[selectedRace]}
          rowKey={(record, index) => index}
          columns={[
            {
              title: '#',
              dataIndex: '',
              key: 'index',
              render: (_, __, index) => index + 1,
            },
            {
              title: 'Driver',
              dataIndex: 'driver',
              key: 'driver',
            },
            {
              title: 'Constructor',
              dataIndex: 'constructor',
              key: 'constructor',
            },
            {
              title: 'Points',
              dataIndex: 'points',
              key: 'points',
            },
          ]}
        />
      </div>
    )}
  </div>
);
}
  
export default Results;