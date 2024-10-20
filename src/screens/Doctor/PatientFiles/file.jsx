import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import DoctorNav from '../DoctorNav';
import './File.css';

const File = () => {
    const { id } = useParams(); // Fetching the ID from the URL
    const [allMedications, setAllMedications] = useState([]); // State for medications
    const [consultationHistory, setConsultationHistory] = useState([]); // State for consultations
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch patient data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading to true before fetching data
            try {
                console.log(`Fetching data for Patient ID: ${id}`);

                // Fetch patient data from Firestore
                const patientDoc = await getDoc(doc(db, 'Patients', id));
                if (patientDoc.exists()) {
                    const patientData = patientDoc.data();
                    setAllMedications(patientData.medications || []); // Set medications
                    setConsultationHistory(patientData.consultationHistory || []); // Set consultation history
                } else {
                    console.log("Patient document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchData(); // Invoke the fetch function
    }, [id]);

    // Function to delete a medication entry
    const deleteMedication = async (medicationIndex) => {
        const updatedMedications = [...allMedications];
        updatedMedications.splice(medicationIndex, 1); // Remove the selected medication

        try {
            // Update the Firestore document with the new medications list
            await updateDoc(doc(db, 'Patients', id), {
                medications: updatedMedications
            });
            setAllMedications(updatedMedications); // Update state after deletion
        } catch (error) {
            console.error("Error deleting medication:", error);
        }
    };

    // Function to delete a consultation entry
    const deleteConsultation = async (consultationIndex) => {
        const updatedConsultations = [...consultationHistory];
        updatedConsultations.splice(consultationIndex, 1); // Remove the selected consultation

        try {
            // Update the Firestore document with the new consultation history
            await updateDoc(doc(db, 'Patients', id), {
                consultationHistory: updatedConsultations
            });
            setConsultationHistory(updatedConsultations); // Update state after deletion
        } catch (error) {
            console.error("Error deleting consultation:", error);
        }
    };

    // Loading state handling
    if (loading) {
        return <div>Loading files, medications, and consultation history...</div>;
    }

    return (
        <div>
            <DoctorNav />
            <div className="file-details-container">
                {/* Flex container for medications and consultations */}
                <div className="file-records-container">
                    {/* Medication Entries */}
                    <div className="file-medications">
                        <h3>All Medication Entries</h3>
                        <ul className="file-medication-list">
                            {allMedications.length > 0 
                                ? allMedications.map((medicationEntry, index) => (
                                    <div key={index}>
                                        <strong>Date:</strong> 
                                        {medicationEntry.date ? new Date(medicationEntry.date).toLocaleDateString() : 'N/A'}
                                        <br />
                                        <strong>Medications:</strong>
                                        {medicationEntry.medications && medicationEntry.medications.length > 0 ? (
                                            medicationEntry.medications.map((medication, medicationIndex) => (
                                                <div key={medicationIndex}>
                                                    <p>Label: {medication.label}</p>
                                                    <p>Dosage: {medication.dosage}</p>
                                                    <button onClick={() => deleteMedication(index)} className="delete-button">Delete Medication</button>
                                                </div>
                                                
                                            ))
                                        ) : (
                                            <p>No medications available.</p>
                                        )}
                                    </div>
                                ))
                                : 'N/A'}
                        </ul>
                    </div>
                    {/* Consultation History */}
                    <div className="file-consultations">
                        <h3>Consultation History</h3>
                        <ul className="file-consultation-list">
                            {consultationHistory.length > 0 ? (
                                consultationHistory.map((consultation, index) => (
                                    <li key={index} className="file-card">
                                        <p><strong>Date:</strong> {consultation?.consultationDate || 'N/A'}</p>
                                        <p><strong>Notes:</strong> {consultation?.consultationNotes || 'N/A'}</p>
                                        <p><strong>Diagnosis:</strong> {consultation?.diagnosis || 'N/A'}</p>
                                        <p><strong>Symptoms:</strong> {consultation?.symptoms || 'N/A'}</p>
                                        <button onClick={() => deleteConsultation(index)} className="delete-button">Delete Consultation</button>
                                    </li>
                                ))
                            ) : (
                                <p>No consultation history found for this patient.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default File;
