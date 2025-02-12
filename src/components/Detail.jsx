import React from 'react';



// Details component
const Detail = ({ data }) => {
  return (
    <div>
      <h2>Details</h2>
      <ul>
        <li><strong>ID:</strong> {data.id}</li>
        <li><strong>NameCustomer:</strong> {data.nameCustomer}</li>
        <li><strong>ProductName:</strong> {data.productName}</li>
        <li><strong>Count:</strong> {data.count}</li>
      </ul>
    </div>
  );
};

// App component to render the Details component
const App = () => {
  return (
    <div>
      <Detail data={data["data"]} />
    </div>
  );
};

export default App;
