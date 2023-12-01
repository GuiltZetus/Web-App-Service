import React, { useState, useEffect } from 'react';
import { get, ref, remove, update } from 'firebase/database';
import { db, storage } from '../services/firebase';
import '../styles/ProductList.css';
import AddAccountForm from '../components/AddAccountForm.js';
import Modal from 'react-modal';
import '../styles/MyForm.css';

Modal.setAppElement('#root');

const AccountList = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type, itemID) => {
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
        const dataRef = ref(db, 'User');
        const dataSnapshot = await get(dataRef);

        if (dataSnapshot.exists()) {
          const fetchedData = [];
          dataSnapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const accountData = {
              id: childSnapshot.key,
              email: data.user_email,
              name: data.user_name,
              password: data.user_password,
              phone: data.user_phone,
              address : data.user_address,
            };
            fetchedData.push(accountData);
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

  // Filtered data based on search input
  const filteredData = data.filter((item) =>
    item.id.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="list-container">
      <h1 className="title">User Account Listing</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Email or Name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={() => openModal('addAccount')}>Add Account</button>
      </div>
      <ul className="item-list">
        <div className="item-list-categories">
          <span>ID</span>
          <span>Email</span>
          <span>Name</span>
          <span>Password</span>
          <span>Phone Number</span>
          <span>Adress</span>
          <span>Edit</span>
        </div>
        {filteredData.map((item) => (
          <li key={item.id} className="list-item">
            <span>{item.id}</span>
            <span>{item.email}</span>
            <span>{item.name}</span>
            <span>{item.password}</span>
            <span>{item.phone}</span>
            <span>{item.adress}</span>
            <span>
              <button>
                Delete
              </button>
              <button>
                Update
              </button>
              <Modal
                isOpen = {modalIsOpen && modalType === 'addAccount'}
                onRequestClost = {closeModal}
                contentLabel="Add Account"
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
              >
                <>
                  <AddAccountForm setModalIsOpen={closeModal} />
                </>
              </Modal>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;

