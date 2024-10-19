import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Firebase configuration
import NavBar from './pharmacyNav';

function AddMedicine() {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [remainingStock, setRemainingStock] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'Medicines'), {
        medicineName,
        dosage,
        expirationDate,
        remainingStock,
        price,
      });
      alert('Medicine added successfully!');
      // Reset form fields
      setMedicineName('');
      setDosage('');
      setExpirationDate('');
      setRemainingStock('');
      setPrice('');
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Error adding medicine, please try again.');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container">

        <h2 className='topic'>Add New Medicine</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Medicine Name</label>
            <input type="text" className="form-control" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Dosage</label>
            <input type="text" className="form-control" value={dosage} onChange={(e) => setDosage(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Expiration Date</label>
            <input type="date" className="form-control" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Remaining Stock</label>
            <input type="text" className="form-control" value={remainingStock} onChange={(e) => setRemainingStock(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Price</label>
            <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Add Medicine</button>
        </form>
      </div>
    </div>

  );
}

export default AddMedicine;
