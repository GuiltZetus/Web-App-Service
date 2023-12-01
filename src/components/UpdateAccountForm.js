import React, { useState, useEffect } from 'react';
import { get, ref, update } from 'firebase/database';
import { db } from '../services/firebase';

const UpdateAccountForm = ({ accountId, setModalIsOpen, onAccountUpdate }) => {
  const [error, setError] = useState('');
  const [updatedAccount, setUpdatedAccount] = useState({});

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const accountRef = ref(db, `User/${accountId}`);
        const snapshot = await get(accountRef);

        if (snapshot.exists()) {
          setUpdatedAccount(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching account data:', error.message);
      }
    };

    fetchAccountData();
  }, [accountId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAccount((prevAccount) => ({ ...prevAccount, [name]: value }));
  };
  
  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update account information in Realtime Database
      await update(ref(db, `User/${accountId}`), updatedAccount);

      // Close the modal
      setModalIsOpen(false);
      onAccountUpdate();
    } catch (error) {
      setError('Error updating account:', error.message);
    }
  };

  return (
    <form className="my-form" onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          name="user_email"
          value={updatedAccount.user_email || ''}
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
          value={updatedAccount.user_name || ''}
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
          value={updatedAccount.user_password || ''}
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
          value={updatedAccount.user_phone || ''}
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
          value={updatedAccount.user_address || ''}
          onChange={handleChange}
          className="form-input"
        />
      </label>
      <br />
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Update Account</button>
      <button type="button" onClick={handleCloseModal}>
        Cancel
      </button>
    </form>
  );
};

export default UpdateAccountForm;

