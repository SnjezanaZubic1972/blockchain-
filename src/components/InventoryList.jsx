import React from 'react';
import InventoryItem from './InventoryItem';

const InventoryList = ({ items }) => {
  return (
    <div>
      <h2>Inventory List</h2>
      {items.map((items, index) => (
        <InventoryItem key={index} item={items} />
      ))}
    </div>
  );
};

export default InventoryList;
