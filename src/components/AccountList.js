import React, { useState, useEffect } from 'react';
import { get, ref, remove, update } from 'firebase/database';
import { db, storage } from '../services/firebase';
import '../styles/ProductList.css';
import AddAccountForm from '../components/AddAccountForm.js';
import UpdateAccountForm from '../components/UpdateAccountForm.js';
import Modal from 'react-modal';
import '../styles/MyForm.css';

Modal.setAppElement('#root');

const AccountList = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [updateAccountId, setUpdateAccountId] = useState(null);

  const openModal = (type, accountId) => {
    setModalType(type);
    setModalIsOpen(true);
    if (type === 'updateAccount') {
      setUpdateAccountId(accountId);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setModalIsOpen(false);
  };

  const handleAccountUpdated = () =>{
    fetchData();
  };

  const handleAccountAdded = () =>{
    fetchData();
  };

  const handleDelete = async (accountId) => {
    try{
      await remove(ref(db,`User/${accountId}`));
      setData((prevData) => prevData.filter((item) => item.id !==accountId));
    }
    catch (error){
      console.error('Error deleting data:', error.message);
    }
  };

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
            name: data.userName,
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

  // Fetch data from Realtime Database
  useEffect(() => {
    fetchData();
  }, [handleAccountAdded, handleAccountUpdated]);

  // Filtered data based on search input
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="list-container">
      <h1 className="title">User Account Listing</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Username"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={() => openModal('addAccount')}>Add Account</button>
      </div>
      <ul className="item-list">
        <div className="item-list-categories">
          <span>ID</span>
          <span>Name</span>
          <span>Edit</span>
        </div>
        {filteredData.map((item) => (
          <li key={item.id} className="list-item">
            <span>{item.id}</span>
            <span>{item.name}</span>
            <span>
              <button onClick={() => handleDelete(item.id)}>
                Delete
              </button>
              <button onClick={() => openModal('updateAccount', item.id)}>
                Update
              </button>
              {/* Add Account Modal */}
              <Modal
                isOpen = {modalIsOpen && modalType === 'addAccount'}
                onRequestClose = {closeModal}
                contentLabel="Add Account"
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
              >
                <>
                  <AddAccountForm setModalIsOpen={closeModal} />
                </>
              </Modal>
              {/* Update Account Modal */}
              <Modal
                isOpen = {modalIsOpen && modalType === 'updateAccount'}
                onRequestClose = {closeModal}
                contentLabel="Add Account"
                overlayClassName="react-modal-overlay"
                className="react-modal-content"
              >
                <>
                  <UpdateAccountForm 
                    setModalIsOpen={closeModal}
                    accountId={updateAccountId}
                  />
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

