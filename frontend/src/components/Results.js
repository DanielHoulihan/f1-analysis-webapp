import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "antd";
import "../css/Results.css"
function Results(){

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
  
    const raceButtons = raceList.map((race) => {
      if (race.season === selectedYear) {
        return (
          <li key={race.race_name}>
            <Button
              className={"button2" + (race.race_name === selectedRace ? " selected" : "")}
              onClick={() => {
                setSelectedRace(race.race_name);
              }}
            >
              {race.race_name}
            </Button>
          </li>
        );
      } else {
        return null;
      }
    });
    
      
  
    const yearButtons = Array.from(new Set(raceList.map((race) => race.season))).map((year) => (
      <li>
        <Button
          key={year}
          className={"button1" + (parseInt(year) === selectedYear ? " selected" : "")}
          onClick={() => {
            const racesOfYear = raceList.filter((race) => race.season === parseInt(year));
            if (racesOfYear.length > 0) {
              setSelectedRace(racesOfYear[0].race_name);
              setSelectedYear(parseInt(year));
              fetchResults(racesOfYear[0].race_name, year);
            } else {
              setSelectedRace("");
              setSelectedYear("");
              setResultList([]);
            }
          }}
        >
          {year}
        </Button>
      </li>
    ));
    

    return (
      <div className="container">
        <div className="buttons">
          <div>
            <div className="scrollable-container1">
              <ul>{yearButtons}</ul>
            </div>
          </div>
          {selectedYear && (
            <div>
              <div className="scrollable-container2">
                <ul>{raceButtons}</ul>
              </div>
            </div>
          )}
        </div>
        {/* <h1>{selectedRace} {selectedYear}</h1> */}
        <Table
          dataSource={races[selectedRace]}
          rowKey={(record, index) => index}
          className="results-table"
          columns={[
            {
              title: '#',
              dataIndex: '',
              key: 'index',
              width: 100,
              render: (_, __, index) => index + 1,
            },
            {
              title: 'Driver',
              dataIndex: 'driver',
              key: 'driver',
              width: 200,

            },
            {
              title: 'Constructor',
              dataIndex: 'constructor',
              key: 'constructor',
              width: 200,

            },
            {
              title: 'Points',
              dataIndex: 'points',
              key: 'points',
              width: 200,

            },
            
          ]}
          
        />
      </div>
    );
  }
  
  export default Results;