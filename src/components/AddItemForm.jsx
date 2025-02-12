import React, { useState } from 'react';
import axios from 'axios';

const AddItemForm = ({ addItem }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState(''); 
  const [count, setQuantity] = useState(''); 
  const [price, setPrice] = useState(''); 
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => { e.preventDefault(); 
    const newItem = { name, count: parseInt(count), price: parseFloat(price), description }; 
    // Log the new item 
    console.log('Adding item:', newItem); 
    try { 
      const response = await axios.post('http://localhost:5000/api/inventory', newItem); 
      console.log('Item added:', response.data); addItem(response.data); 
    } 
      catch (error) { console.error('Error adding item:', error); } // Reset form fields
       setName(''); 
       setQuantity(''); 
       setPrice(''); 
       setDescription(''); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID:</label>
        <input type="number" value={id} onChange={(e) => setId(e.target.value)} required />
      </div>
      <div>
        <label>Name Customer:</label>
        <input type="text" value={nameCustomer} onChange={(e) => setNameCustomer(e.target.value)} required />
      </div>
      <div>
        <label>Product Name:</label>
        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required />
      </div>
      <div>
        <label>Count:</label>
        <input type="text" value={count} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div>
        <label>/Price:</label>
        <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;
