import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Menu } from 'antd';
import { HomeOutlined, TrophyOutlined, TeamOutlined, CarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import "./App.css";
import Results from "./components/Results";
import Home from "./components/Home";
import Standings from "./components/Standings";
import Drivers from "./components/Drivers";
import Constructors from "./components/Constructors"
import Circuits from "./components/Circuits"

function App() {
  return (
    <BrowserRouter>
      <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="results" icon={<TrophyOutlined />}>
            <Link to="/results">Results</Link>
          </Menu.Item>
          <Menu.Item key="standings" icon={<TeamOutlined />}>
            <Link to="/standings">Standings</Link>
          </Menu.Item>
          <Menu.Item key="drivers" icon={<CarOutlined />}>
            <Link to="/drivers">Drivers</Link>
          </Menu.Item>
          <Menu.Item key="constructors" icon={<TeamOutlined />}>
            <Link to="/constructors">Constructors</Link>
          </Menu.Item>
          <Menu.Item key="circuits" icon={<EnvironmentOutlined />}>
            <Link to="/circuits">Circuits</Link>
          </Menu.Item>
        </Menu>
        <div className="content" style={{ paddingLeft: "10%", paddingRight: "10%" }}>
          <Routes>
            <Route path="/results" element={ <Results />}/>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/constructors" element={<Constructors />} />
            <Route path="/circuits" element={<Circuits />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
