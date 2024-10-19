import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import './Medications.css'; // Import the CSS file

export default function Medications() {
    const { id } = useParams(); // Get the patient ID from route params
    const [patientDetails, setPatientDetails] = useState({
        Name: '',
        Age: '',
        gender: '',
    });

    // Initialize medications and allMedications
    const [medications, setMedications] = useState([{ label: '', dosage: '' }]);
    const [medicationDate, setMedicationDate] = useState('');
    const [allMedications, setAllMedications] = useState([]);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const docRef = doc(db, 'Patients', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPatientDetails({
                        Name: data.Name || '',
                        Age: data.Age || '',
                        gender: data.gender || '',
                    });
                    // Ensure that data.medications is defined and is an array
                    setAllMedications(Array.isArray(data.medications) ? data.medications : []);
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };

        fetchPatientData();
    }, [id]);

    const addNewField = () => {
        setMedications([...medications, { label: '', dosage: '' }]);
    };

    const handleFieldChange = (index, field, text) => {
        const updatedMedications = medications.map((item, idx) => {
            if (idx === index) {
                return { ...item, [field]: text };
            }
            return item;
        });
        setMedications(updatedMedications);
    };

    const saveMedications = async () => {
        try {
            const newMedicationEntry = {
                date: medicationDate,
                medications: medications,
            };
            const updatedMedications = [...allMedications, newMedicationEntry];
            setAllMedications(updatedMedications);

            const patientRef = doc(db, 'Patients', id);
            await updateDoc(patientRef, { medications: updatedMedications });
            alert('Medications saved successfully!');

            setMedications([{ label: '', dosage: '' }]);
            setMedicationDate('');
        } catch (error) {
            console.error('Error saving medications:', error);
        }
    };

    return (
        <div className="medications-container">
            <h1 className="medications-title">Patient Details</h1>
            <div className="medications-detailItem">
                <span className="medications-label">Name:</span>
                <span className="medications-value">{patientDetails.Name}</span>
            </div>
            <div className="medications-detailItem">
                <span className="medications-label">Age:</span>
                <span className="medications-value">{patientDetails.Age}</span>
            </div>
            <div className="medications-detailItem">
                <span className="medications-label">Gender:</span>
                <span className="medications-value">{patientDetails.gender}</span>
            </div>

            <h2 className="medications-records-title">Medication Records</h2>
            {medications.map((medication, index) => (
                <div key={index} className="medications-input-group">
                    <input
                        type="text"
                        className="medications-input"
                        placeholder="Medicine"
                        value={medication.label}
                        onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
                    />
                    <input
                        type="text"
                        className="medications-input"
                        placeholder="Dosage of Medicine"
                        value={medication.dosage}
                        onChange={(e) => handleFieldChange(index, 'dosage', e.target.value)}
                    />
                </div>
            ))}
            <input
                type="date"
                className="medications-date-input"
                placeholder="Date"
                value={medicationDate}
                onChange={(e) => setMedicationDate(e.target.value)}
            />
            <button className="medications-add-button" onClick={addNewField}>Add Medication</button>
            <button className="medications-save-button" onClick={saveMedications}>Save Medications</button>

            {/* Display all medication entries (optional) */}
            {/* Uncomment to display all medication entries */}
            {/* <h3 className="medications-all-records-title">All Medication Entries</h3>
            <ul className="medications-list">
                {allMedications.length > 0 ? (
                    allMedications.map((entry, index) => (
                        <li key={index} className="medications-list-item">
                            <strong>Date:</strong> {entry.date}<br />
                            <strong>Medications:</strong>
                            <ul>
                                {Array.isArray(entry.medications) ? (
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
            </ul> */}
        </div>
    );
}
