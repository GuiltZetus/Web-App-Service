import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import AccountList from './components/AccountList';
import OrderList from './components/OrderList.js';
import CartList from './components/CartList.js';

function App() {
  console.log("app is running now");
  return (
    <Router>
      <div className = "app">
        <Dashboard/>
        <Routes>
          <Route path = "/ProductList" element={<ProductList/>}/>
          <Route path = "/AccountList" element={<AccountList/>}/>
          <Route path = "/OrderList" element={<OrderList/>}/>
          <Route path = "/CartList" element={<CartList/>}/>
        </Routes>
        </div>
    </Router>
  );
}

export default App;
