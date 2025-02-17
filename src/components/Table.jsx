import React from 'react';
import { useState, useEffect } from 'react';
import './Table.css'; 

const Table = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        // Fetch data from your API
        fetch('http://127.0.0.1:5000')
            .then(response => response.json())
            .then(data => setRows(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const [data, setData] = useState([]);

    useEffect(() => {
      fetch('http://127.0.0.1:500/api/genesis')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  


    const columns = ["Data", "Hash", "Index", "Previous Hash", "Timestamp"];

    return (
        <div className="container my-5">
            <table className="styled-table" style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column}</th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }} >
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',  backgroundColor: 'lightblue' }} ><a href={`http://127.0.0.1:5000/api/genesis/${row.index}`} > Transaction Data </a></td>
                            <td>{row.hash}</td>
                            <td style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',  backgroundColor: 'lightblue' }} >{row.index}</td>
                            <td>{row.previous_hash}</td>
                            <td style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',  backgroundColor: 'lightblue' }} >{row.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
