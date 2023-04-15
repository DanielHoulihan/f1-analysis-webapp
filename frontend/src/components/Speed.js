// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const Plot = () => {
//   const [plotData, setPlotData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await axios.get('/api/plot-data');
//       setPlotData(response.data);
//     };
//     fetchData();
//   }, []);

//   return (
//     <div>
//       {plotData ? (
//         <img src={`data:image/png;base64,${plotData}`} alt="Plot" />
//       ) : (
//         <p>Loading plot...</p>
//       )}
//     </div>
//   );
// };

// export default Plot;
