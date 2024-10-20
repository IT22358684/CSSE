import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useParams } from 'react-router-dom';
import './Medications.css';

const PatientDetails = ({ patientDetails, calculateAge }) => (
    <div>
        <h1 className="medications-title">Patient Details</h1>
        <div className="medications-detailItem">
            <span className="medications-label">Name:</span>
            <span className="medications-value">{patientDetails.Name}</span>
        </div>
        <div className="medications-detailItem">
            <span className="medications-label">Age:</span>
            <span className="medications-value">
                {patientDetails.dateOfBirth ? calculateAge(patientDetails.dateOfBirth) : 'N/A'}
            </span>
        </div>
        <div className="medications-detailItem">
            <span className="medications-label">Gender:</span>
            <span className="medications-value">{patientDetails.gender}</span>
        </div>
    </div>
);

const MedicationEntry = ({ index, medication, handleFieldChange, allMedicines }) => (
    <div className="medications-input-group" key={index}>
        <select
            className="medications-select"
            value={medication.label}
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
        >
            <option value="">Select Medicine</option>
            {allMedicines.map((medicine, idx) => (
                <option key={idx} value={medicine}>
                    {medicine}
                </option>
            ))}
        </select>
        <input
            type="text"
            className="medications-input"
            placeholder="Dosage of Medicine"
            value={medication.dosage}
            onChange={(e) => handleFieldChange(index, 'dosage', e.target.value)}
        />
    </div>
);

export default function Medications() {
    const { id } = useParams();

    const [patientDetails, setPatientDetails] = useState({
        Name: '',
        dateOfBirth: null,
        gender: '',
    });

    const [medications, setMedications] = useState([{ label: '', dosage: '' }]);
    const [medicationDate, setMedicationDate] = useState('');
    const [allMedications, setAllMedications] = useState([]);
    const [allMedicines, setAllMedicines] = useState([]); // Added state for medicines
    const [error, setError] = useState(''); // Error state
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const docRef = doc(db, 'Patients', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPatientDetails({
                        Name: data.Name || '',
                        dateOfBirth: data.dateOfBirth || null,
                        gender: data.gender || '',
                    });
                    setAllMedications(Array.isArray(data.medications) ? data.medications : []);
                } else {
                    setError('Patient document does not exist.');
                }
            } catch (error) {
                setError('Error fetching patient details: ' + error.message);
                console.error('Error fetching patient details:', error);
            } finally {
                setLoading(false); // Stop loading after fetch completes
            }
        };

        const fetchMedicines = async () => {
            try {
                const medicinesSnapshot = await getDocs(collection(db, 'Medicines'));
                const medicinesList = medicinesSnapshot.docs.map(doc => doc.data().medicineName); // Extract medicine names
                setAllMedicines(medicinesList); // Update state with medicine names
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };

        fetchPatientData();
        fetchMedicines(); // Fetch medicines when component mounts
    }, [id]);

    const addNewField = () => {
        setMedications([...medications, { label: '', dosage: '' }]);
    };

    const handleFieldChange = (index, field, value) => {
        const updatedMedications = medications.map((med, idx) =>
            idx === index ? { ...med, [field]: value } : med
        );
        setMedications(updatedMedications);
    };

    const saveMedications = async () => {
        // Check if any medication has an empty dosage
        const hasEmptyDosage = medications.some(med => !med.dosage);
        if (hasEmptyDosage) {
            alert('All dosage fields must be filled.'); // Alert if any dosage is empty
            return;
        }
    
        try {
            const newMedicationEntry = { date: medicationDate, medications };
            const updatedMedications = [...allMedications, newMedicationEntry];
    
            await updateDoc(doc(db, 'Patients', id), { medications: updatedMedications });
            setAllMedications(updatedMedications);
    
            setMedications([{ label: '', dosage: '' }]);
            setMedicationDate('');
            alert('Medications saved successfully!');
        } catch (error) {
            setError('Error saving medications: ' + error.message);
            console.error('Error saving medications:', error);
        }
    };
    
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const birthDate = new Date(dateOfBirth.seconds * 1000);
        const ageDiff = Date.now() - birthDate.getTime();
        return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
    };

    return (
        <div className="medications-container">
            {loading ? (
                <div className="loading-message">Loading patient data...</div> // Show loading message
            ) : error ? (
                <div className="error-message">{error}</div> // Display error if exists
            ) : (
                <>
                    <PatientDetails patientDetails={patientDetails} calculateAge={calculateAge} />
                    
                    <h2 className="medications-records-title">Medication Records</h2>
    
                    {/* Medication input form for adding new records */}
                    {medications.map((medication, index) => (
                        <MedicationEntry
                            key={index}
                            index={index}
                            medication={medication}
                            handleFieldChange={handleFieldChange}
                            allMedicines={allMedicines} // Pass medicines list to entry
                        />
                    ))}
    
                    <input
                        type="date"
                        className="medications-date-input"
                        placeholder="Date"
                        value={medicationDate}
                        onChange={(e) => setMedicationDate(e.target.value)}
                    />
                    <button className="medications-add-button" onClick={addNewField}>Add Medication</button>
                    <button className="medications-save-button" onClick={saveMedications}>Submit</button>
                </>
            )}
        </div>
    );
}
