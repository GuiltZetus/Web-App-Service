// MyList.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from './firebase';
import './MyList.css';
import {ref , deleteObject} from 'firebase/storage';

const MyList = () => {
  const [data, setData] = useState([]);

  // fetch data from db 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'userInfo'));
        const fetchedData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
            id: doc.id,
            name: data.productname,
            price: data.price,
            description : data.description,
            imageURL: data.image,
          });
        });

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchData();
  }, []);
   
  //delete Data func
  const handleDelete = async (id, imageURL) => {
    alert(id);
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

  return (
    <div className="my-list-container">
      <h1 className = "title">User Information List</h1>
      <ul>
        {data.map((item) => (
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
                alt={`User ${item.name} Image`}
                className="user-image"
              />
            </div>
            <button onClick={() => handleDelete(item.id, item.imageURL)}>
                Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;