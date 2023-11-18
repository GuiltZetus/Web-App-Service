import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, deleteObject } from 'firebase/storage';
import UpdateForm from './UpdateForm';
import './MyList.css';

const MyList = () => {
  const [data, setData] = useState([]);
  const [updateItemId, setUpdateItemId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'userInfo'));
        const fetchedData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            productname: data.productname,
            price: data.price,
            description: data.description,
            imageURL: data.image,
          };
        });
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id, imageURL) => {
    try {
      await deleteDoc(doc(db, 'userInfo', id));

      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef);

      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  const handleUpdate = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'userInfo', id), updatedData);

      const querySnapshot = await getDocs(collection(db, 'userInfo'));
      const updatedDataArray = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          productname: data.productname,
          price: data.price,
          description: data.description,
          imageURL: data.image,
        };
      });

      setData(updatedDataArray);
      setUpdateItemId(null);
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  return (
    <div className="my-list-container">
      <h1 className="title">User Information List</h1>
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
              <UpdateForm data={item} onUpdate={(updatedData) => handleUpdate(item.id, updatedData)} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;
