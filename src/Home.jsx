import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Blockchain in Warehouse Tracking</h1>
            <br></br>

            <Link to="/table">Go to Table</Link>
            <br></br>

            <Link to="/inventory">Go to Inventory Table</Link>
            <br></br>

        </div>
    );
};

export default Home;
