// UpdateForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import '../styles/MyForm.css';

const UpdateForm = ({ data, onUpdate, onCancel, setModalIsOpen, modalIsOpen }) => {
  const [updatedData, setUpdatedData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedData);
  };

  const handleCloseModal = () => {
      setModalIsOpen(false);
  };


  return (
    <div className="update-form-container">
      <form className="my-form" onSubmit={handleSubmit}>
        <label>
          Product Name:
          <input
            type="text"
            name="productname"
            value={updatedData.productname}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="text"
            name="price"
            value={updatedData.price}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={updatedData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Stock:
          <input
          type = "text"
          name = "stock"
          value = {updatedData.stock}
          onChange={handleChange}
          />
        </label>
        <button type="submit">Update</button>
        <button type="button" onClick={handleCloseModal}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateForm;
