// MyList.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../services/firebase';
import '../styles/MyList.css';
import { ref, deleteObject } from 'firebase/storage';
import UpdateProductForm from './UpdateProductForm';

const MyList = () => {
  const [data, setData] = useState([]);
  const [updateItemId, setUpdateItemId] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Fetch data from db
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'userInfo'));
        const fetchedData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
            id: doc.id,
            productname: data.productname,
            price: data.price,
            description: data.description,
            imageURL: data.imageURL,
          });
        });

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, []);

  // Update Data function
  const handleUpdate = async (id, updatedData) => {
    try {
      // Update user information in Firestore
      await updateDoc(doc(db, 'userInfo', id), updatedData);

      // Fetch updated data
      const querySnapshot = await getDocs(collection(db, 'userInfo'));
      const updatedDataArray = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        updatedDataArray.push({
          id: doc.id,
          productname: data.productname,
          price: data.price,
          description: data.description,
          imageURL: data.image,
        });
      });

      // Update the state to reflect the changes
      setData(updatedDataArray);
      setUpdateItemId(null); // Reset the updateItemId after updating
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  // Delete Data function
  const handleDelete = async (id, imageURL) => {
    try {
      // Delete user information from Firestore
      await deleteDoc(doc(db, 'userInfo', id));

      // Delete image from storage
      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef);

      // Update the state to reflect the changes
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  // Filtered data based on search input
  const filteredData = data.filter((item) =>
    item.productname.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="my-list-container">
      <h1 className="title">User Information List</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <ul className='item-list'>
        {filteredData.map((item) => (
          <li key={item.id} className="list-item">
            <div className="user-info">
              <strong>Product Name:</strong> {item.productname}
            </div>
            <div className="user-info">
              <strong>Price:</strong> {item.price}
            </div>
            <div>
              <strong>Description:</strong> {item.description}
            </div>
            <div>
              <img
                src={item.imageURL}
                alt={`User ${item.productname} Image`}
                className="user-image"
              />
            </div>
            <div className="action-buttons">
              <button onClick={() => handleDelete(item.id, item.imageURL)}>
                Delete
              </button>
              <button onClick={() => setUpdateItemId(item.id)}>Update</button>
            </div>
            {updateItemId === item.id && (
              <UpdateProductForm data={item} onUpdate={(updatedData) => handleUpdate(item.id, updatedData)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;
