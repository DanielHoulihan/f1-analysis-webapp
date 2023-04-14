import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Select, Button } from "antd";
// import "antd/dist/antd.css";
import "../css/Standings.css";

const { Option } = Select;

function Standings() {
  const [resultList, setResultList] = useState([]);
  const [raceList, setRaceList] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTable, setSelectedTable] = useState("driver");

  const fetchRaces = async () => {
    try {
      const res = await axios.get("/api/races/");
      setRaceList(res.data);
      setSelectedYear(res.data[0].season);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`/api/standings/?year=${selectedYear}`);
      setResultList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRaces();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchResults();
    }
  }, [selectedYear]);

  const years = new Set(raceList.map((race) => race.season));
  const yearOptions = Array.from(years).map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));
  

  const resultsByDriverAndConstructor = resultList.reduce(
    (accumulator, result) => {
      const { driver, constructor, points } = result;
      const driverKey = `${driver}_${constructor}`;
      const constructorKey = constructor;
      accumulator.driver[driverKey] =
        accumulator.driver[driverKey] || { driver, constructor, points: 0 };
      accumulator.driver[driverKey].points += parseFloat(points);
      accumulator.constructor[constructorKey] =
        accumulator.constructor[constructorKey] || { constructor, points: 0 };
      accumulator.constructor[constructorKey].points += parseFloat(points);
      return accumulator;
    },
    { driver: {}, constructor: {} }
  );

  const driverResults = Object.values(resultsByDriverAndConstructor.driver);
  driverResults.sort((a, b) => b.points - a.points);

  const constructorResults = Object.values(
    resultsByDriverAndConstructor.constructor
  );
  constructorResults.sort((a, b) => b.points - a.points);

  const toggleTable = () => {
    setSelectedTable((prevTable) =>
      prevTable === "driver" ? "constructor" : "driver"
    );
  };

  const tableToDisplay =
    selectedTable === "driver" ? driverResults : constructorResults;

  const columns = [
    {
      title: selectedTable === "driver" ? "Driver" : "Constructor",
      dataIndex: selectedTable === "driver" ? "driver" : "constructor",
    },
    {
      title: "Points",
      dataIndex: "points",
      sorter: (a, b) => a.points - b.points,
      sortDirections: ["descend", "ascend"],
    },
  ];

  return (
    <>
      <div className="standings-header">
        <Select
          className="year-select"
          value={selectedYear}
          onChange={setSelectedYear}
        >
          {yearOptions}
        </Select>
        <Button onClick={toggleTable}>
          View {selectedTable === "driver" ? "Constructors" : "Drivers"}
        </Button>
      </div>
      {/* <div className=" */}

      <Table
        dataSource={tableToDisplay}
        rowKey={record => selectedTable === "driver" ? `${record.driver}_${record.constructor}` : record.constructor}
        pagination={false}

        columns={[
          {
            title: '#',
            dataIndex: '',
            key: 'index',
            width: 40,
            render: (_, __, index) => index + 1,
          },
          selectedTable === "driver" && {
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
          }
        ].filter(Boolean)}
      />


        </>
    );
  }


  export default Standings;
