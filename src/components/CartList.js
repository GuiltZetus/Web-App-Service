import React, { useState, useEffect } from 'react';
import { get, ref, remove, update } from 'firebase/database';
import { db, storage } from '../services/firebase';
import '../styles/ProductList.css';
import Modal from 'react-modal';
import '../styles/MyForm.css';

const CartList = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const fetchData = async () => {
    try {
      const dataRef = ref(db, 'Cart')
      const dataSnapshot = await get(dataRef);

      if (dataSnapshot.exists()) {
        const fetchedData = [];
        dataSnapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          const cartData = {
            id: childSnapshot.key,
            memoryOption : data.memoryOptID,
            productID : data.productID,
            quantity : data.quantity,
            userID : data.userID,
          };
          fetchedData.push(cartData);
        });
        setData(fetchedData);
      }
    } catch (error){
      console.error('Error fetching data: ', error.message);
    }
  };

  // fetch data from database
  useEffect(() => {
    fetchData();
    alert("fetching data");
  }, []);
  // filtered data with searchEngine
  const filteredData = data.filter((item) =>
  item.userID.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="list-container">
      <h1 className="title">Cart Listing</h1>
      <div className="search-bar">
        <input
          type = "text"
          placeholder = "Search by User ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        /> 
      </div>
      <ul className="item-list">
        <div className="item-list-categories">
          <span>Cart ID</span>
          <span>User ID</span>
          <span>Product ID</span>
          <span>Memory Option</span>
          <span>Quantity</span>
        </div>
        {filteredData.map((item) => (
          <li key={item.id} className="list-item">
            <span>{item.id}</span>
            <span>{item.userID}</span>
            <span>{item.productID}</span>
            <span>{item.memoryOption}</span>
            <span>{item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartList;
