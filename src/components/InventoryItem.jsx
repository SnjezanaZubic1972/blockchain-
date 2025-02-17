import React from 'react';
import { Link } from 'react-router-dom';

const InventoryItem = ({ item }) => {
  return (
    <div className="inventory-item">
      <h3>{item.id}</h3>
      <p>Name Customer: {item.nameCustomer}</p>
      <p>Product Name: ${item.productName}</p>
      <Link to={`/details/${item.index}`}>View Details</Link>
    </div>
  );
};

export default InventoryItem;
