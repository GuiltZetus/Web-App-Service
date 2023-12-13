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
        Name:
        <input
          type="text"
          name="userName"
          value={updatedAccount.userName || ''}
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

