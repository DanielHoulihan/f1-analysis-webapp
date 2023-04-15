import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Skeleton } from 'antd';

const Plot = () => {
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/get-plot2', {
          responseType: 'arraybuffer', 
        });
        const blob = new Blob([response.data], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        setPlotData(url);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
        {loading ? (
        <Card style={{ width: 300, marginTop: 16 }}>
            <Skeleton loading={loading} avatar active />
        </Card>
        ) : (
        <Card style={{ width: 300, marginTop: 16 }}>
            <img src={plotData} alt="Plot" style={{ width: '100%', height: 'auto' }} />
        </Card>
      )}
    </div>
  );
};

export default Plot;