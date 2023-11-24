import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import AddProductForm from './AddProductForm'; // Replace with the correct path to your MyForm component
import ProductList from './ProductList'; // Replace with the correct path to your MyList component
import '../styles/Dashboard.css';
const Dashboard = () => {
  return (
      <div className = "navbar">
        <ul>
          <li className='nav-item'>
            <Link to="/productlist">Item List</Link>
          </li> 
        </ul>
      </div>
  );
};


export default Dashboard;
