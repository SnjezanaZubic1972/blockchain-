import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Details = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/api/data/${id}`)
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  if (!data) {
    return <div>Loading...</div>;
  }
 
  return (
    <div>
      <h1>Data Details</h1>
      <pre>{json.stringify(data["data"]["nameCustomer"])}</pre>
    </div>
  );

};

export default Details;
