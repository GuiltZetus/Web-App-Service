import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import AccountList from './components/AccountList';

function App() {
  console.log("app is running now");
  return (
    <Router>
      <div className = "app">
        <Dashboard/>
        <Routes>
          <Route path = "/ProductList" element={<ProductList/>}/>
          <Route path = "/AccountList" element={<AccountList/>}/>
        </Routes>
        </div>
    </Router>
  );
}

export default App;
