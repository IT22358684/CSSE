import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Added updateDoc for updating the price
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import NavBar from './pharmacyNav';

function ViewMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null); // State to hold the medicine to edit
  const [newPrice, setNewPrice] = useState(''); // State to hold the new price
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // Fetch medicines from Firestore
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Medicines'));
        const medicinesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMedicines(medicinesList);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Handle Edit Price button click
  const handleEditClick = (medicine) => {
    setSelectedMedicine(medicine);
    setNewPrice(medicine.price); // Prepopulate the field with the current price
    setShowModal(true); // Open the modal
  };

  // Handle price update
  const handleSavePrice = async () => {
    if (selectedMedicine) {
      try {
        const medicineRef = doc(db, 'Medicines', selectedMedicine.id);
        await updateDoc(medicineRef, { price: newPrice }); // Update the price in Firestore
        const updatedMedicines = medicines.map(med =>
          med.id === selectedMedicine.id ? { ...med, price: newPrice } : med
        );
        setMedicines(updatedMedicines); // Update the local state with the new price
        setShowModal(false); // Close the modal
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }
  };

  return (
    <div>
      <div className="issued-prescriptions-container">
        <NavBar />
        <h2 className='topic'>Medicine Inventory</h2>
        <div className='btnContainer text-end'>
          <Link to="/add-medicine" className="btn btn-success">Add New Medicine</Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          medicines.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Medicine Name</th>
                  <th style={{ width: '10%' }}>Dosage</th>
                  <th style={{ width: '15%' }}>Expiration Date</th>
                  <th style={{ width: '15%' }}>Remaining Stock</th>
                  <th style={{ width: '15%' }}>Price</th>
                  <th style={{ width: '10%' }}> </th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td style={{ width: '35%' }}>{medicine.medicineName}</td>
                    <td style={{ width: '10%', textAlign: 'center' }}>{medicine.dosage}</td>
                    <td style={{ width: '15%', textAlign: 'center' }}>{medicine.expirationDate}</td>
                    <td style={{ width: '15%', textAlign: 'center' }}>{medicine.remainingStock}</td>
                    <td style={{ width: '15%', textAlign: 'right' }}>{medicine.price}</td>
                    <td style={{ width: '10%', textAlign: 'center' }}>
                      <button className="btn btn-secondary" onClick={() => handleEditClick(medicine)}>
                        Edit Price
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medicines found in the inventory.</p>
          )
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
              {/* <button type="button1" className="close" onClick={() => setShowModal(false)}>&times;</button> */}
              <br />
                <h5 className="modal-title">Edit Price for {selectedMedicine.medicineName}</h5>
              </div>
              <div className="modal-body">
                <label>New Price:</label>
                <input
                  type="text"
                  className="form-control"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSavePrice}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewMedicines;
