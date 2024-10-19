import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './phStyle.css'; // Ensure this CSS file is created for styles
import NavBar from './pharmacyNav';

const IssuedPrescriptions = () => {
    const [issuedPrescriptions, setIssuedPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false); // Track modal open state

    useEffect(() => {
        const fetchIssuedPrescriptions = async () => {
            setLoading(true);
            try {
                const issuedPrescriptionsCollection = collection(db, 'IssuedPrescriptions');
                const snapshot = await getDocs(issuedPrescriptionsCollection);
                const prescriptionsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setIssuedPrescriptions(prescriptionsList);
            } catch (error) {
                console.error("Error fetching issued prescriptions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssuedPrescriptions();
    }, []);

    const handlePrescriptionClick = (prescription) => {
        setSelectedPrescription(prescription);
        setModalOpen(true); // Open the modal when a prescription is clicked
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedPrescription(null); // Reset selected prescription on modal close
    };

    if (loading) {
        return <div>Loading issued prescriptions...</div>;
    }

    return (
        <div className="issued-prescriptions-container">
            <NavBar />
            <h2  className='topic'>Issued Prescriptions</h2>
            <table className="table presTable">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Health Card Number</th>
                        <th>Issued Date</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    {issuedPrescriptions.map((prescription) => (
                        <tr key={prescription.id} onClick={() => handlePrescriptionClick(prescription)}>
                            <td>{prescription.patientName}</td>
                            <td>{prescription.healthCardNumber}</td>
                            <td>{new Date(prescription.date).toLocaleDateString()}</td>
                            <td style={{textAlign: 'right' }}>Rs. {prescription.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for Prescription Details */}
            {modalOpen && selectedPrescription && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="topic">Prescription Details</h3>
                        <div>
                            <strong>Patient Name:</strong> {selectedPrescription.patientName}
                        </div>
                        <div>
                            <strong>Health Card Number:</strong> {selectedPrescription.healthCardNumber}
                        </div>
                        <div>
                            <strong>Issued Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Total Price:</strong> Rs. {selectedPrescription.totalPrice}
                        </div>
                        <h4  className='topic'>Medications</h4>
                        <table className="medications-table">
                            <thead>
                                <tr>
                                    <th>Medicine Name</th>
                                    <th>Dosage</th>
                                    <th>Unit Price</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPrescription.medications && selectedPrescription.medications.map((med, index) => (
                                    <tr key={index}>
                                        <td>{med.name}</td>
                                        <td>{med.prescribedDosage}</td>
                                        <td>{med.unitPrice}</td>
                                        <td>{med.totalPrice}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={closeModal} className="close-modal-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IssuedPrescriptions;
