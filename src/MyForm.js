import React, { useState } from 'react';

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: null, // Holds the selected image file
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      // Handle file input separately
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [name]: file,
      });

      // Perform additional actions if needed, e.g., preview the image
      // You can use FileReader to read the selected file and display a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update state or perform other actions with the preview URL
        // Example: setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle other input types
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, including the image file (formData.image)
    console.log('Form submitted:');
    alert(formData.image);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Upload Image:
        <input
          type="file"
          name="image"
          accept="image/*" // Specify accepted file types
          onChange={handleChange}
        />
      </label>
      <br />
      {formData.image && (
        <img
          src={URL.createObjectURL(formData.image)}
          alt="Preview"
          style={{ maxWidth: '200px', maxHeight: '200px' }}
        />
      )}
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;
