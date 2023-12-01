import React, { useState } from 'react';
import { push, ref } from 'firebase/database';
import { db } from '../services/firebase';
import '../styles/MyForm.css';

const AddAccountForm = ({ setModalIsOpen }) => {
  const [newAccount, setNewAccount] = useState({
    user_email: '',
    user_name: '',
    user_password: '',
    user_phone: '',
    verificationCode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prevAccount) => ({ ...prevAccount, [name]: value }));
  };

  const isUsernameExists = async (username) => {
    const accountsRef = ref(db, 'User');
    const usernameQuery = query(accountsRef, orderByChild('username').equalTo(username));
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
          required
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
        />
      </label>
      <br />
      <label>
        Adress:
        <input
          type="text"
          name="user_adress"
          value={newAccount.user_adress}
          onChange={handleChange}
        />
      </label>

      <br />
      <button type="submit">Add Account</button>
    </form>
  );
};

export default AddAccountForm;
