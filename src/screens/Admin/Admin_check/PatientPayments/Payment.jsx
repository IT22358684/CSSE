import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import './payment.css';

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Payment'));
        const paymentsData = [];

        querySnapshot.forEach(doc => {
          const payment = doc.data();
          paymentsData.push({
            id: doc.id,
            ...payment
          });
        });

        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  // Open the modal and set the selected payment
  const handlePaymentClick = (payment) => {
    setSelectedPayment(payment);
    setNewStatus(payment.status); // Set current status as default
    setShowModal(true);
  };

  // Update the payment status
  const handleStatusUpdate = async () => {
    if (selectedPayment) {
      try {
        const paymentDoc = doc(db, 'Payment', selectedPayment.id);
        await updateDoc(paymentDoc, { status: newStatus });

        // Update the local state after updating Firestore
        setPayments(payments.map(p => p.id === selectedPayment.id ? { ...p, status: newStatus } : p));
        setShowModal(false); // Close the modal after updating
        setSelectedPayment(null); // Reset selected payment
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    }
  };

  return (
    <div className="payment-review-container">
      <h1 className="payment-review-title">Payments Review</h1>
      <table className="payment-review-table">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Date & Time</th>
            <th>Phone</th>
            <th>Payment Type</th>
            <th>Hospital Fee</th>
            <th>Price</th>
            <th>Total Fee</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map(payment => (
              <tr key={payment.id} onClick={() => handlePaymentClick(payment)}>
                <td>{payment.name}</td>
                <td>{payment.doctorName}</td>
                <td>{payment.dateTime}</td>
                <td>{payment.phone}</td>
                <td>{payment.paymentType}</td>
                <td>{payment.hospitalFee}</td>
                <td>{payment.price}</td>
                <td>{payment.totalFee}</td>
                <td className={`status-${payment.status.toLowerCase()}`}>{payment.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No payments available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for updating status */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Payment Status</h2>
            <p>Current Status: {selectedPayment.status}</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleStatusUpdate} className="update-button">Update</button>
              <button onClick={() => setShowModal(false)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
