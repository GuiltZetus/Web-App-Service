import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import '../styles/MyForm.css'; // Import your CSS file

const MyForm = () => {
  const [input, setInputs] = useState({});

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storageRef = ref(storage, `images/${input.image.name}`);
      await uploadBytes(storageRef, input.image);

      const imageURL = await getDownloadURL(storageRef);

      const docRef = await addDoc(collection(db, 'userInfo'), {
        productname: input.productname,
        price: input.price,
        description: input.description,
        imageURL: imageURL,
      });

      setInputs({
        productname: '',
        price: '',
        description: '',
        image: null,
      });

      alert(input.image);
    } catch (e) {
      alert(e);
    }
  };

  return (
    <form className="my-form" onSubmit={handleSubmit}>
      <label>
        Product Name:
        <input
          type="text"
          name="productname"
          value={input.productname}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Price:
        <input
          type="text"
          name="price"
          value={input.price}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={input.description}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <label>
        Image:
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <button type="submit" className="form-button" >
        Submit
      </button>

    </form>
  );
};

export default MyForm;
