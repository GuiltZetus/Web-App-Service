import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from './firebase';
const MyForm = () => {
  const [input, setInputs] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs(values => ({...values, [name]: value}))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const docRef = await addDoc(collection(db, "userInfo"),{
        name : input.name,
        email : input.email
      });
      alert(docRef.id);
    }
    catch (e){
      alert(e);
    }
 
  }; 

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={input.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={input.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
