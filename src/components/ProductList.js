import React, { useState, useEffect } from 'react';
import { get, ref, remove, update } from 'firebase/database';
import { db, storage } from '../services/firebase';
import '../styles/ProductList.css';
import { ref as storageRef, deleteObject } from 'firebase/storage';
import UpdateProductForm from './UpdateProductForm';
import Modal from 'react-modal';
import AddProductForm from './AddProductForm';
import '../styles/Modal.css';

import TestingForm from './AddProductForm.js';
Modal.setAppElement('#root');

const ProductList = () => {
  const [data, setData] = useState([]);
  const [optionsCount, setOptionsCount] = useState([]);
  const [updateItemId, setUpdateItemId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type, itemID) => {
    setModalType(type);
    setModalIsOpen(true);
    if (type === 'updateProduct') {
      setUpdateItemId(itemID);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setModalIsOpen(false);
  };

  // Fetch data from Realtime Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, 'Products'); // Assuming products are stored under 'Product' node
        const dataSnapshot = await get(dataRef);

        if (dataSnapshot.exists()) {
          const fetchedData = [];
          dataSnapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const productData = {
              id: childSnapshot.key,
              productname: data.product_name,
              description: data.product_description,
              stock: data.product_quantity,
              imageURL: data.product_img, // Update to match your actual data structure
              date: data.product_createdDate,
              memoryOptions: [],
              totalStock : 0,
            }
            // fetch options for procduct
            const optionsSnapshot = childSnapshot.child('product_memoryOptions');
            if (optionsSnapshot.exists()) {
              let optionsTotalStock = 0;
              optionsSnapshot.forEach((childSnapshot) => {
                const options = childSnapshot.val();
                productData.memoryOptions.push({
                  memory : options.memory,
                  price : options.product_price,
                  stock : options.quantity
                })
                optionsTotalStock += options.quantity;
                productData.totalStock = optionsTotalStock;
              })
            }
            fetchedData.push(productData);
          });
          const totalOptionsCount = fetchedData.map((product) => ({
            id: product.id,
            optionsCount : product.memoryOptions.length,
          }));
        setData(fetchedData);
        setOptionsCount(totalOptionsCount);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

    fetchData();
  }, []);

  // Update Data function
  const handleUpdate = async (id, updatedData) => {
    try {
      // Update product information in Realtime Database
      await update(ref(db, `Products/${id}`), updatedData);

      // Fetch updated data
      const dataRef = ref(db, 'Products');
      const dataSnapshot = await get(dataRef);

      if (dataSnapshot.exists()) {
        const updatedDataArray = [];
        dataSnapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          updatedDataArray.push({
            id: childSnapshot.key,
            productname: data.product_name,
            price: data.product_price,
            description: data.product_description,
            stock: data.product_quantity,
            imageURL: data.product_img, // Update to match your actual data structure
          });
        });

        // Update the state to reflect the changes
        setData(updatedDataArray);
        setUpdateItemId(null); // Reset the updateItemId after updating
      }
    } catch (error) {
      console.error('Error updating data:', error.message);
    }
  };

  // Delete Data function
  const handleDelete = async (id, imageURL) => {
    try {
      // Delete product information from Realtime Database
      await remove(ref(db, `Products/${id}`));

      // Delete image from storage
      const imageRef = storageRef(storage, imageURL);
      await deleteObject(imageRef);

      // Update the state to reflect the changes
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  // Filtered data based on search input
  const filteredData = data.filter((item) =>
    item.productname.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="product-list-container">
      <h1 className="title">Product Listing</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Product Name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={() => openModal('addProduct')}>Add Product</button>
      </div>
      <ul className="item-list">
        <div className="item-list-categories">
          <span>ID</span>
          <span>Name</span>
          <span>Price</span>
          <span>Options</span>
          <span>Description</span>
          <span>Add Date</span>
          <span>Stock</span>
          <span>Edit</span>
        </div>
        {filteredData.map((item) => (
          <li key={item.id} className="list-item">
            <span>{item.id}</span>
            <span>{item.productname}</span>
            <span>{item.price}</span>
            <span>{item.memoryOptions.length}</span>
            <span>{item.description}</span>
            <span>{item.date}</span>
            <span>{item.totalStock}</span>
            <span>
              <div className="action-buttons">
                <button onClick={() => handleDelete(item.id, item.imageURL)}>
                  Delete
                </button>
                <button onClick={() => openModal('updateProduct', item.id)}>
                  Update
                </button>
                {updateItemId === item.id && modalType === 'updateProduct'}
                {/* AddProductForm Modal */}
                <Modal
                  isOpen={modalIsOpen && modalType === 'addProduct'}
                  onRequestClose={closeModal}
                  contentLabel="Add Product"
                  overlayClassName="react-modal-overlay"
                  className="react-modal-content"
                >
                  <>
                    <TestingForm setModalIsOpen={closeModal} />
                  </>
                </Modal>
                {/* UpdateForm Modal */}
                <Modal
                  isOpen={modalIsOpen && modalType === 'updateProduct'}
                  onRequestClose={closeModal}
                  contentLabel="Update Product"
                  overlayClassName="react-modal-overlay"
                  className="react-modal-content"
                >
                  <>
                    <UpdateProductForm
                      data={data.find((item) => item.id === updateItemId)}
                      onUpdate={(updatedData) =>
                        handleUpdate(item.id, updatedData)
                      }
                      setModalIsOpen={closeModal}
                    />
                  </>
                </Modal>
              </div>
            </span>
          </li>
        ))}
      </ul>
   </div>
  );
    // function for button
  
};

export default ProductList;

