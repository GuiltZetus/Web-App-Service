import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref,  uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage} from './firebase';


const MyForm = () => {
  const [input, setInputs] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

    setInputs(values => ({...values, [name]: value}))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const storageRef = ref(storage, `images/${input.image.name}`);
      await uploadBytes(storageRef, input.image);

      const imageURL = await getDownloadURL(storageRef);



      const docRef = await addDoc(collection(db, "userInfo"),{
        name : input.name,
        email : input.email,
        image : imageURL
      });
      alert(input.image);
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
      <label>
        Image:
        <input
        type = "file"
        name = "image"
        onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
