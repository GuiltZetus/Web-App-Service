import React, { useState } from 'react';

const UpdateForm = ({ data, onUpdate }) => {
  const [updatedData, setUpdatedData] = useState(data);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Update</button>
    </form>
  );
};

export default UpdateForm;
