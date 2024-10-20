import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on your project structure
import './ConsultationForm.css'; // Import the CSS file
import DoctorNav from '../DoctorNav';

const ConsultationForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // State variables
    const [patient, setPatient] = useState(null);
    const [consultationNotes, setConsultationNotes] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [pulse, setPulse] = useState('');
    const [temperature, setTemperature] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [respirationRate, setRespirationRate] = useState('');
    const [oxygenSaturation, setOxygenSaturation] = useState('');
    const [consultationDate, setConsultationDate] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch patient details on component mount
    useEffect(() => {
        const fetchPatientDetails = async () => {
            setLoading(true); // Set loading to true before fetching
            try {
                const patientDoc = await getDoc(doc(db, "Patients", id));
                if (patientDoc.exists()) {
                    const patientData = patientDoc.data();
                    setPatient(patientData);
                    // Populate form fields with existing patient data
                    setBloodPressure(patientData.physicalExam?.bloodPressure || '');
                    setPulse(patientData.physicalExam?.pulse || '');
                    setTemperature(patientData.physicalExam?.temperature || '');
                    setHeight(patientData.height || '');
                    setWeight(patientData.weight || '');
                    setRespirationRate(patientData.physicalExam?.respirationRate || '');
                    setOxygenSaturation(patientData.physicalExam?.oxygenSaturation || '');
                } else {
                    setError("Patient document does not exist."); // Updated error message
                }
            } catch (error) {
                console.error("Error fetching patient details:", error);
                setError("Error fetching patient details. Please try again.");
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchPatientDetails();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if consultation notes are provided
        if (!consultationNotes) {
            setError('Consultation notes are required.');
            return;
        }

        try {
            // Reference to the patient document in Firestore
            const patientDocRef = doc(db, "Patients", id);
            const newConsultation = {
                consultationNotes,
                consultationDate,
                diagnosis,
                symptoms,
            };

            // Update the patient's consultation data in Firestore
            await updateDoc(patientDocRef, {
                consultationHistory: arrayUnion(newConsultation),
                height,
                weight,
                physicalExam: {
                    bloodPressure,
                    pulse,
                    temperature,
                    respirationRate,
                    oxygenSaturation,
                },
            });

            // Optionally reset the form or provide feedback to the user here
            setSuccessMessage("Consultation updated successfully!"); // Set success message
            setError(''); // Clear any existing error message

        } catch (error) {
            console.error("Error updating document: ", error);
            setError("An error occurred while updating the consultation.");
        }
    };

    return (
        <div className="consultation-form-container">
            <DoctorNav />
            <h2 className="form-title">Update Consultation for {patient?.Name || 'Patient'}</h2>
            {loading && <p>Loading patient data...</p>} {/* Display loading message */}
            {error && <p className="error-message">{error}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className="consultation-form">
                {/* Input fields */}
                <label className="form-label">
                    Consultation Notes:
                    <textarea
                        className="form-input"
                        value={consultationNotes}
                        onChange={(e) => {
                            setConsultationNotes(e.target.value);
                            setError(''); // Clear error when typing
                        }}
                        placeholder="Enter consultation notes"
                        required
                    />
                </label>
                <label className="form-label">
                    Consultation Date:
                    <input
                        className="form-input"
                        value={consultationDate}
                        onChange={(e) => {
                            setConsultationDate(e.target.value);
                            setError(''); // Clear error when typing
                        }}
                        type="date"
                        required
                    />
                </label>
                <label className="form-label">
                    Diagnosis:
                    <input
                        className="form-input"
                        value={diagnosis}
                        onChange={(e) => {
                            setDiagnosis(e.target.value);
                            setError(''); // Clear error when typing
                        }}
                        placeholder="Enter diagnosis"
                        type="text"
                        required
                    />
                </label>
                <label className="form-label">
                    Symptoms:
                    <input
                        className="form-input"
                        value={symptoms}
                        onChange={(e) => {
                            setSymptoms(e.target.value);
                            setError(''); // Clear error when typing
                        }}
                        placeholder="Enter symptoms"
                        type="text"
                        required
                    />
                </label>
                <label className="form-label">
                    Blood Pressure:
                    <input
                        className="form-input"
                        value={bloodPressure}
                        onChange={(e) => setBloodPressure(e.target.value)}
                        placeholder="Enter blood pressure"
                        type="text"
                    />
                </label>
                <label className="form-label">
                    Pulse:
                    <input
                        className="form-input"
                        value={pulse}
                        onChange={(e) => setPulse(e.target.value)}
                        placeholder="Enter pulse"
                        type="text"
                    />
                </label>
                <label className="form-label">
                    Temperature:
                    <input
                        className="form-input"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="Enter temperature"
                        type="text"
                    />
                </label>
                <label className="form-label">
                    Height:
                    <input
                        className="form-input"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Enter height"
                        type="text"
                    />
                </label>
                <label className="form-label">
                    Weight:
                    <input
                        className="form-input"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Enter weight"
                        type="text"
                    />
                </label>
                <label className="form-label">
                    Respiration Rate:
                    <input
                        className="form-input"
                        value={respirationRate}
                        onChange={(e) => setRespirationRate(e.target.value)}
                        placeholder="Enter respiration rate"
                        type="text"
                    />
                </label>
                <label className="form-label">
                    Oxygen Saturation:
                    <input
                        className="form-input"
                        value={oxygenSaturation}
                        onChange={(e) => setOxygenSaturation(e.target.value)}
                        placeholder="Enter oxygen saturation"
                        type="text"
                    />
                </label>

                <button className="form-submit" type="submit">
                    Submit
                </button>
                {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message */}
            </form>
        </div>
    );
};

export default ConsultationForm;
