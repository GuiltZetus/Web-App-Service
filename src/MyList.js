// MyList.js

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './MyList.css';

const MyList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'userInfo'));
        const fetchedData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedData.push({
            id: doc.id,
            name: data.name,
            email: data.email,
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

  return (
    <div className="my-list-container">
      <h1>User Information List</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id} className="list-item">
            <div className="user-info">
              <strong>Name:</strong> {item.name}
            </div>
            <div className="user-info">
              <strong>Email:</strong> {item.email}
            </div>
            <div>
              <img
                src={item.imageURL}
                alt={`User ${item.name} Image`}
                className="user-image"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;
