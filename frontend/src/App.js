// import React from "react";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { Menu } from 'antd';
// import { HomeOutlined, TrophyOutlined, TeamOutlined, CarOutlined, EnvironmentOutlined } from '@ant-design/icons';
// import "./App.css";
// import Results from "./components/Results";
// import Home from "./components/Home";
// import Standings from "./components/Standings";
// import Drivers from "./components/Drivers";
// import Constructors from "./components/Constructors"
// import Circuits from "./components/Circuits"
// import Schedule from "./components/Schedule"

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app-container">
//         <div className="menu-container">
//           <Menu theme="dark" mode="inline" defaultSelectedKeys={['home']}>
//             <Menu.Item key="home" icon={<HomeOutlined />}>
//               <Link to="/">Home</Link>
//             </Menu.Item>
//             <Menu.Item key="schedule" icon={<EnvironmentOutlined />}>
//               <Link to="/schedule">Schedule</Link>
//             </Menu.Item>
//             <Menu.Item key="results" icon={<TrophyOutlined />}>
//               <Link to="/results">Results</Link>
//             </Menu.Item>
//             <Menu.Item key="standings" icon={<TeamOutlined />}>
//               <Link to="/standings">Standings</Link>
//             </Menu.Item>
//             <Menu.Item key="drivers" icon={<CarOutlined />}>
//               <Link to="/drivers">Drivers</Link>
//             </Menu.Item>
//             <Menu.Item key="constructors" icon={<TeamOutlined />}>
//               <Link to="/constructors">Constructors</Link>
//             </Menu.Item>
//             <Menu.Item key="circuits" icon={<EnvironmentOutlined />}>
//               <Link to="/circuits">Circuits</Link>
//             </Menu.Item>
//           </Menu>
//         </div>
//         <div className="content-container">
//           <Routes>
//             <Route path="/results" element={<Results />} />
//             <Route path="/" element={<Home />} />
//             <Route path="/standings" element={<Standings />} />
//             <Route path="/drivers" element={<Drivers />} />
//             <Route path="/constructors" element={<Constructors />} />
//             <Route path="/circuits" element={<Circuits />} />
//             <Route path="/schedule" element={<Schedule />} />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }


// export default App;


import { EnvironmentOutlined, HomeOutlined, TeamOutlined, CarOutlined, TrophyOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Results from "./components/Results";
import Home from "./components/Home";
import Standings from "./components/Standings";
import Drivers from "./components/Drivers";
import Constructors from "./components/Constructors";
import Circuits from "./components/Circuits";
import Schedule from "./components/Schedule";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, link, children) {
  return {
    key,
    icon,
    children,
    label,
    link
  };
}

const items = [
  getItem('Home', 'home', <HomeOutlined />, '/', []),
  getItem('Schedule', 'schedule', <EnvironmentOutlined />, '/schedule', []),
  getItem('Results', 'results', <TrophyOutlined />, '/results', []),
  getItem('Standings', 'standings', <TeamOutlined />, '/standings', []),
  getItem('Drivers', 'drivers', <CarOutlined />, '/drivers', []),
  getItem('Constructors', 'constructors', <TeamOutlined />, '/constructors', []),
  getItem('Circuits', 'circuits', <EnvironmentOutlined />, '/circuits', []),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)'}} />
          <Menu theme="dark" defaultSelectedKeys={['home']} mode="inline">
            {items.map(item => {
              if (item.children.length === 0) {
                return (
                  <Menu.Item key={item.key} icon={item.icon}>
                    <Link to={item.link}>{item.label}</Link>
                  </Menu.Item>
                );
              } else {
                return (
                  <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.children.map(childItem => (
                      <Menu.Item key={childItem.key}>
                        <Link to={`/${childItem.link}`}>{childItem.label}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>
                );
              }
            })}
          </Menu>
        </Sider>
        <Layout className="site-layout">
        <Header style={{ color: 'rgb(255, 99, 71)', paddingLeft: 20, background: colorBgContainer }}>
          <p>This website is still in development - only desktop version is supported</p>
        </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} />
            <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            <Routes>
              <Route path="/results" element={<Results />} />
              <Route path="/" element={<Home />} />
              <Route path="/standings" element={<Standings />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/constructors" element={<Constructors />} />
              <Route path="/circuits" element={<Circuits />} />
              <Route path="/schedule" element={<Schedule />} />
            </Routes>
            </div>
            </Content>
            </Layout>
            </Layout>
            </BrowserRouter>
  );
}
export default App;
