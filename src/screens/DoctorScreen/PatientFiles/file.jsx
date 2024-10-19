import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import DoctorNav from '../DoctorNav';
import './File.css';

const File = () => {
    const { id } = useParams(); // Fetching the ID from the URL
    const [allMedications, setAllMedications] = useState([]); // Array for medications
    const [consultationHistory, setConsultationHistory] = useState([]); // Array for consultations
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log(`Fetching data for Patient ID: ${id}`); // Log the ID being fetched

                // Fetch patient data
                const patientDoc = await getDoc(doc(db, 'Patients', id));
                console.log("Patient document:", patientDoc.data()); // Log the patient document
                if (patientDoc.exists()) {
                    const patientData = patientDoc.data();
                    // Fetch medications and consultation history
                    setAllMedications(patientData.medications || []); // Ensure this is an array
                    setConsultationHistory(patientData.consultationHistory || []); // Ensure this is an array
                } else {
                    console.log("Patient document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div>Loading files, medications, and consultation history...</div>;
    }

    return (
        <div>
            <DoctorNav />
            <div className="file-container">
                <h2>Files for Patient ID: {id}</h2>

                {/* Flex container for medications and consultations */}
                <div className="records-container">
                    {/* Medication Entries */}
                    <div className="medications">
                        <h3>All Medication Entries</h3>
                        <ul className="medication-list">
                            {allMedications.length > 0 ? (
                                allMedications.map((entry, index) => (
                                    <li key={index} className="card">
                                        <strong>Date:</strong> {entry.date ? new Date(entry.date.seconds * 1000).toLocaleDateString() : 'N/A'}<br />
                                        <strong>Medications:</strong>
                                        <ul>
                                            {Array.isArray(entry.medications) && entry.medications.length > 0 ? (
                                                entry.medications.map((med, idx) => (
                                                    <li key={idx}>
                                                        {med.label} - {med.dosage}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>No medications recorded.</li>
                                            )}
                                        </ul>
                                    </li>
                                ))
                            ) : (
                                <li>No medication entries available.</li>
                            )}
                        </ul>
                    </div>

                    {/* Consultation History */}
                    <div className="consultations">
                        <h3>Consultation History</h3>
                        <ul className="consultation-list">
                            {consultationHistory.length > 0 ? (
                                consultationHistory.map((consultation, index) => ( // Use .map() to iterate over consultation history
                                    <li key={index} className="card">
                                        <p><strong>Date:</strong> {consultation?.consultationDate || 'N/A'}</p>
                                        <p><strong>Notes:</strong> {consultation?.consultationNotes || 'N/A'}</p>
                                        <p><strong>Diagnosis:</strong> {consultation?.diagnosis || 'N/A'}</p>
                                        <p><strong>Symptoms:</strong> {consultation?.symptoms || 'N/A'}</p>
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
