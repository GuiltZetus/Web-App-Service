import React, { useState } from 'react';
import { push, ref, get, set, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../services/firebase';
import '../styles/MyForm.css';
import Modal from 'react-modal';

const AddAccountForm = ({ setModalIsOpen, onAccountAdded }) => {
  const [error, setError] = useState('');
  const [newAccount, setNewAccount] = useState({
    user_email: '',
    user_name: '',
    user_password: '',
    user_phone: '',
    user_address: '',
  });

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prevAccount) => ({ ...prevAccount, [name]: value }));
  };

  const isUsernameExists = async (username) => {
    const accountsRef = ref(db, 'User');
    const usernameQuery = query(accountsRef, equalTo('user_name', username));
    const snapshot = await get(usernameQuery); 

    return snapshot.exists();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check pass length 
    if (newAccount.user_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return ;
    }
    
    //check if uername already exist
    const usernameExists = await isUsernameExists(newAccount.user_name);

    if (usernameExists){
      setError('Username already exist, please choose another username.');
      return ;
    }

    try {
      // Add new account to the Realtime Database
      const newAccountRef = ref(db, 'User');
      const newAccountSnapshot = await push(newAccountRef, newAccount);

      if (newAccountSnapshot.key) {
        console.log('Account added successfully!');
        setModalIsOpen(false);
        onAccountAdded();
      } else {
        console.error('Error adding account.');
      }
    } catch (error) {
      console.error('Error adding account:', error.message);
    }
  };

  return (
    <form className="my-form" onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          name="user_email"
          value={newAccount.user_email}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Name:
        <input
          type="text"
          name="user_name"
          value={newAccount.user_name}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="user_password"
          value={newAccount.user_password}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Phone:
        <input
          type="tel"
          name="user_phone"
          value={newAccount.user_phone}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      <label>
        Address:
        <input
          type="text"
          name="user_address"
          value={newAccount.user_address}
          onChange={handleChange}
          className="form-input"
        />
      </label>

      <br />
      <button className="form-button" type="submit" >Add Account</button>
      <button className="form-button" type="button" onClick={handleCloseModal}>
        Cancel
      </button>
    </form>
  );
};

export default AddAccountForm;
