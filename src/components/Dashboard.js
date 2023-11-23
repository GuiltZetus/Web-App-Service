import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import AddProductForm from './AddProductForm'; // Replace with the correct path to your MyForm component
import ProductList from './ProductList'; // Replace with the correct path to your MyList component
import '../styles/Dashboard.css';
const Dashboard = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul >
            <li className='nav-item'>
              <Link to="/addproductform">Add a product</Link>
            </li>
            <li className='nav-item'>
              <Link to="/productlist">Item List</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/addproductform" element={<AddProductForm />} />
          <Route path="/productlist" element={<ProductList />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => {
  return <h2>Welcome to the Dashboard! Choose an option from the navigation.</h2>;
};

export default Dashboard;
