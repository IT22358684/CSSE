import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './claim.css';

const Claim = () => {
  const [insuranceClaims, setInsuranceClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Fetch insurance claims from the Insurance collection
  useEffect(() => {
    const fetchInsuranceClaims = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Insurance'));
        const claims = [];

        querySnapshot.forEach(doc => {
          claims.push({ id: doc.id, ...doc.data() });
        });

        setInsuranceClaims(claims);
      } catch (error) {
        console.error('Error fetching insurance claims:', error);
      }
    };

    fetchInsuranceClaims();
  }, []);

  // Handle claim selection and open modal
  const handleClaimClick = (claim) => {
    setSelectedClaim(claim);
    setNewStatus(claim.status); // Set current status in the dropdown
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (selectedClaim) {
      try {
        const claimRef = doc(db, 'Insurance', selectedClaim.id);
        await updateDoc(claimRef, { status: newStatus });

        setInsuranceClaims(prevClaims =>
          prevClaims.map(claim =>
            claim.id === selectedClaim.id ? { ...claim, status: newStatus } : claim
          )
        );

        // Close modal after updating
        setSelectedClaim(null);
        setNewStatus('');
      } catch (error) {
        console.error('Error updating status:', error);
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedClaim(null);
  };

  return (
    <div className="claim-container">
      <h1>Insurance Claims Review</h1>
      <table className="claims-table">
        <thead>
          <tr>
            <th>Insurance Name</th>
            <th>Patient Name</th>
            <th>Insurance Type</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {insuranceClaims.map(claim => (
            <tr 
              key={claim.insuranceId} 
              className="claim-row" 
              onClick={() => handleClaimClick(claim)}
            >
              <td>{claim.insuranceName}</td>
              <td>{claim.patientName}</td>
              <td>{claim.insuranceType}</td>
              <td>{claim.reason}</td>
              <td>{claim.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedClaim && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Insurance Status for {selectedClaim.patientName}</h2>
            <p>Insurance ID: {selectedClaim.insuranceId}</p>
            <p>Current Status: {selectedClaim.status}</p>

            <label htmlFor="status">New Status:</label>
            <select 
              id="status" 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Claimed">Claimed</option>
              <option value="Rejected">Rejected</option>
              <option value="Under Review">Under Review</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleStatusUpdate}>Update Status</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Claim;
