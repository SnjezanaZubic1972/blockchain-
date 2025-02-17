import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import axios from 'axios';
import { PythonProvider, usePython } from 'react-py';
import Table from './components/Table';
import InventoryList from './components/InventoryList';
import AddItemForm from './components/AddItemForm';
import Details from './components/Details';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import TablePage from './TablePage';
import InventoryTable from './components/InventoryTable';

function Codeblock() {
  const { runPython, output, isLoading } = usePython();

  const handleRun = async () => {
    if (!isLoading) {
      try {
        const result = await runPython(`
          def hello():
              return "Hello from Python!"
          hello();
        `);
        console.log("Python code executed:", result);
      } catch (error) {
        console.error("Error executing Python code:", error);
      }
    } else {
      console.log("Pyodide is still loading...");
    }
  };

  useEffect(() => {
    if (isLoading) {
      console.log("Pyodide is loading...");
    } else {
      console.log("Pyodide loaded successfully");
    }
  }, [isLoading]);

  console.log("Python output:", output);

  return (
    <div>
      <a href="http://127.0.0.1:5000" target="_blank">
        <button style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)',  backgroundColor: 'lightblue' }} onClick={handleRun}>Tracked Blocks</button>
        <pre>{output}</pre>
      </a>

    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [genesisData, setGenesisData] = useState({});
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ productName: '',  nameCustomer: '', count: 0, price: 0, description: '' });
  
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const response = await axios.get('http://localhost:5000/api/inventory');
    setInventory(response.data);
  };

  const addIt = async () => {
    await axios.post('http://localhost:5000/api/inventory', newItem);
    fetchInventory(); // Refresh the inventory list
    setNewItem({ productName: '',  nameCustomer: '', count: 0, price: 0, description: '' }); // Reset form
  };

  const deleteItem = async (productName) => {
    await axios.delete(`http://localhost:5000/api/inventory/${productName}`);
    fetchInventory(); // Refresh the inventory list
  };

  useEffect(() => {
    axios.get('http://localhost:5000/chain')
      .then(response => {
        console.log(response);
        setData(response.data.chain);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/genesis') 
    .then(response => { 
      setGenesisData(response.data); 
    }) 
    .catch(error => { 
      console.error('Error fetching genesis data:', error); 
    }); 
  }, []);

  const addItem = (item) => {
    axios.post('http://localhost:5000/api/items', item)
      .then(response => setItems([...items, response.data]))
      .catch(error => console.error('Error adding item:', error));
  };


  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/items/', formData);
    console.log('formData',formData);
    fetchItems();
    setFormData({
      name: '',
      description: '',
      price: ''
    });
  };


  return (
    <>
      <div>
        <a href="http://127.0.0.1:5000" target="_blank">
          <img src={reactLogo} className="logo react" alt="Vite logo" style={{ backgroundColor: 'lightblue', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }} />
        </a>
        <a href="http://127.0.0.1:5000" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" style={{ backgroundColor: 'lightblue', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }} />
        </a>

      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/details/genesis" element={<Details data={genesisData} />} /> 
          <Route path="/details/:id" element={<Details />} />        
          </Routes>
      </Router>
      <PythonProvider>
        <div className="App">
          <ul>
            {data.map((block, index) => (
              <li key={index}>
                <p>Index: {block.index}</p>
                <p>Timestamp: {block.timestamp}</p>
                <p>Data: <a href={`/details/${block.index}`}>{block.data}</a></p>
                <p>Previous Hash: {block.previous_hash}</p>
              </li>
            ))}
          </ul>
          <Codeblock />
        </div>
      </PythonProvider>

      <div>
      <h1>Inventory Management</h1>
      
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <br></br>
              <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Customer Name</th>
                  <th>Count</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
                    <tbody>
                  {inventory.map((item) => (
                    <tr key={item.productName}>
                      <td>{item.productName}</td>
                      <td>{item.nameCustomer}</td>
                      <td>{item.count}</td>
                      <td>${item.price}</td>
                      <td>{item.description}</td>
                      <td>
                        <button style={{ backgroundColor: 'pink' , boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)'}} onClick={() => deleteItem(item.productName)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

        </div>

      <h2>Add New Item</h2>

        <form onSubmit={handleFormSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={newItem.productName}
          onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
          style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }}
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={newItem.nameCustomer}
          onChange={(e) => setNewItem({ ...newItem, nameCustomer: e.target.value })}
          style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.count}
          onChange={(e) => setNewItem({ ...newItem, count: e.target.value })}
          style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }}
        />
        <input
          type="text"
          placeholder="Description"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          style={{ boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }}
        />
        <button type='submit' style={{ backgroundColor: 'lightblue', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize:'16px', boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.5)' }} onClick={addIt}>Add Item</button>

        </form>

    </div>
 
    </>
  );
}

export default App;
