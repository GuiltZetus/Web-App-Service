import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import MyForm from './MyForm'; // Replace with the correct path to your MyForm component
import MyList from './MyList'; // Replace with the correct path to your MyList component
import '../styles/Dashboard.css';
const Dashboard = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul >
            <li className='nav-item'>
              <Link to="/myform">Add a product</Link>
            </li>
            <li className='nav-item'>
              <Link to="/mylist">Item List</Link>
            </li>
          </ul>
        </nav>

        <hr />

        <Routes>
          <Route path="/myform" element={<MyForm />} />
          <Route path="/mylist" element={<MyList />} />
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
