import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList'
function App() {
  console.log("app is running now");
  return (
    <Router>
      <div className = "app">
        <Dashboard/>
        <Routes>
          <Route path = "/ProductList" element={<ProductList/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
