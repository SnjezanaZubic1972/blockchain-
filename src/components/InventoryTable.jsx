import React from 'react';
import { Link } from 'react-router-dom';

const InventoryTable = ({ items, deleteItem }) => {
  return (
    <div style={{ margin: '20px', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Inventory List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ color: 'black' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Customer Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Count</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.id}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.productName}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.nameCustomer}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.count}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.price}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.description}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <Link to={`/details/${item.index}`} style={{ marginRight: '10px' }}>View Details</Link>
                <button
                  style={{ backgroundColor: '#FF6666', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  onClick={() => deleteItem(item.productName)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
