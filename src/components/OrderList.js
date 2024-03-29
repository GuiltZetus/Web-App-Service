import React, { useState, useEffect } from 'react';
import { get, ref, remove } from 'firebase/database';
import { db } from '../services/firebase';
import Modal from 'react-modal';
import '../styles/MyForm.css';

// Define the OrderList component
const OrderList = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setModalIsOpen(false);
  };

  // Fetch data from Realtime Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRef = ref(db, 'Order');
        const ordersSnapshot = await get(ordersRef);

        if (ordersSnapshot.exists()) {
          const fetchedData = [];
          ordersSnapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const orderData = {
              id: childSnapshot.key,
              buyerId: data.buyer_id,
              orderDate: data.order_date,
              status: data.status,
              totalAmount: data.total_amount,
              paymentMethod: data.paymentMethod,
              shippingAddress: data.shippingAddress,
              phoneNumber : data.phoneNumber,
              deliveryMethod: data.deliveryMethod,
            };
            fetchedData.push(orderData);
          });

          // Update the state to reflect the changes
          setData(fetchedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);


  const handleDelete = async (orderId) => {
    try {
      await remove(ref(db,`Order/${orderId}`));
      setData((prevData) => prevData.filter((item) => item.id !== orderId));
    }
    catch (error) {
      console.error('Error deleting data:', error.message);
    }
  };

  // Filtered data based on search input
  const filteredData = data.filter(
    (item) =>
      item.id.toString().includes(searchInput.toLowerCase())
  );

  return (
    <div className="list-container">
      <h1 className="title">Order Listing</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Order ID or Buyer ID"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={() => openModal('addOrder')}>Add Order</button>
      </div>
      <ul className="item-list">
        <div className="item-list-categories">
          <span>Order ID</span>
          <span>Buyer ID</span>
          <span>Order Date</span>
          <span>Status</span>
          <span>Adress</span>
          <span>Number</span>
          <span>Total Amount</span>
        </div>
        {filteredData.map((item) => (
          <li key={item.id} className="list-item">
            <span>{item.id}</span>
            <span>{item.buyerId}</span>
            <span>{item.orderDate}</span>
            <span>{item.status}</span>
            <span> {item.shippingAddress}</span>
            <span>{item.phoneNumber}</span>
            <span>{item.totalAmount}</span>
            <span>
              <button onClick={() => openModal('updateOrder')}>Update</button>
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
      {/* Add Order Modal */}
      <Modal
        isOpen={modalIsOpen && modalType === 'addOrder'}
        onRequestClose={closeModal}
        contentLabel="Add Order"
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
        {/* Your AddOrderForm component goes here */}
        {/* For simplicity, you can replace this with your actual AddOrderForm component */}
        <div>
          <h2>Add Order Form</h2>
          {/* Add your form fields and logic here */}
        </div>
      </Modal>
      {/* Update Order Modal */}
      <Modal
        isOpen={modalIsOpen && modalType === 'updateOrder'}
        onRequestClose={closeModal}
        contentLabel="Update Order"
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
        {/* Your UpdateOrderForm component goes here */}
        {/* For simplicity, you can replace this with your actual UpdateOrderForm component */}
        <div>
          <h2>Update Order Form</h2>
          {/* Add your form fields and logic here */}
        </div>
      </Modal>
    </div>
  );
};

export default OrderList;

