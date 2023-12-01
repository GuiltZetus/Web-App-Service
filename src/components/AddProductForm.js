import React, { useState } from 'react';
import { ref as databaseRef, push, get, set } from 'firebase/database';
import { ref as storeRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../services/firebase';
import '../styles/MyForm.css'; // Import your CSS file
import Modal from 'react-modal';

const AddProductForm = ({ setModalIsOpen, modalIsOpen }) => {
  const [input, setInputs] = useState({
    productname: '',
    description: '',
    image: null,
    options: [{ memory: '', price: '', stock: '' }],
  });

  const handleChange = (e, index) => {
    const name = e.target.name;
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;

    if (name === 'memory' || name === 'price' || name === 'stock') {
      const newOptions = [...input.options];
      newOptions[index][name] = value;
      setInputs((values) => ({ ...values, options: newOptions }));
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };

  const handleAddOption = () => {
    setInputs((values) => ({
      ...values,
      options: [...values.options, { memory: '', price: '', stock: '' }],
    }));
  };

  const handleRemoveOption = (index) => {
    setInputs((prevInputs) => {
      const updatedOptions = [...prevInputs.options];
      updatedOptions.splice(index, 1);
      return { ...prevInputs, options: updatedOptions };
    });
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const generateProductId = async () => {
    const productsRef = databaseRef(db, 'Products');
    const productsSnapshot = await get(productsRef);
    const productCount = productsSnapshot.exists() ? Object.keys(productsSnapshot.val()).length : 0;
    return `product_${productCount + 2}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productId = await generateProductId();

      const storageRef = storeRef(storage, `images/${input.image.name}`);
      await uploadBytes(storageRef, input.image);

      const imageURL = await getDownloadURL(storageRef);

      const optionsData = input.options.map((option, index) => ({
        [`option_${index + 1}`]: {
          memory: option.memory,
          product_price: Number(option.price),
          quantity: Number(option.stock),
        },
      }));

      await set(databaseRef(db, 'Products/'+ productId), {
        category_id: input.category_id, // Set your desired category_id
        product_name : input.productname,
        product_createdDate: new Date().toLocaleDateString(),
        product_description: input.description,
        product_img: imageURL,
        product_memoryOptions: optionsData.reduce((acc, option) => ({ ...acc, ...option }), {}),
      });

      setInputs({
        productname: '',
        price: '',
        description: '',
        stock: '',
        image: null,
        options: [{ memory: '', price: '', stock: '' }],
      });

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
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
          onChange={(e) => handleChange(e)}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Category ID:
        <input
        type = "text"
        name="categoryid"
        value={input.categoryid}
        onChange={(e) => handleChange(e)}
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
          onChange={(e) => handleChange(e)}
          className="form-input"
        />
      </label>
       {input.options.map((option, index) => (
        <div key={index} className="option-inputs">
          <strong>Options : {index + 1}</strong>
          <label>
            Memory:
            <input
              type="text"
              name="memory"
              value={option.memory}
              onChange={(e) => handleChange(e, index)}
              className="form-input"
            />
          </label>
          <label>
             Price:
            <input
              type="number"
              name="price"
              value={option.price}
              onChange={(e) => handleChange(e, index)}
              className="form-input"
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={option.stock}
              onChange={(e) => handleChange(e, index)}
              className="form-input"
            />
          </label>
          <button
            type="button"
            onClick={() => handleRemoveOption(index)}
            className="remove-option-button"
          >
            Remove Option
          </button>
        </div>
      ))}
      <button className = "form-button" type="button" onClick={handleAddOption}>
        Add More Options
      </button>
      <br/>
      <label className="image-input-container">
        Image:
        <input
          type="file"
          name="image"
          onChange={(e) => handleChange(e)}
          className="form-input"
        />
        {input.image && (
          <img 
            src={URL.createObjectURL(input.image)}
            alt="Preview"
            className="image-preview"
          />
        )}
        
      </label>

      <button type="submit" className="form-button">
        Submit
      </button>
      <button className="form-button" type="button" onClick={handleCloseModal}>
        Cancel
      </button>
    </form>
  );
};

export default AddProductForm;
