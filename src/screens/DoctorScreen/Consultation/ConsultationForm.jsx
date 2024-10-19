import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore'; // Import arrayUnion
import { db } from '../../firebase';
import './ConsultationForm.css'; // Import the CSS file
import DoctorNav from '../DoctorNav';

const ConsultationForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the patient ID from the URL
    const [patient, setPatient] = useState(null); // State to hold patient data

    // State variables for form fields
    const [consultationNotes, setConsultationNotes] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [pulse, setPulse] = useState('');
    const [temperature, setTemperature] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [respirationRate, setRespirationRate] = useState('');
    const [oxygenSaturation, setOxygenSaturation] = useState('');
    const [consultationDate, setConsultationDate] = useState('');
    
    // New fields for diagnosis and symptoms
    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');

    // Fetch patient details when component mounts
    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientDoc = await getDoc(doc(db, "Patients", id));
                if (patientDoc.exists()) {
                    const patientData = patientDoc.data();
                    setPatient(patientData);
                    // Populate form fields with existing patient data
                    setConsultationNotes('');
                    setBloodPressure(patientData.physicalExam?.bloodPressure || '');
                    setPulse(patientData.physicalExam?.pulse || '');
                    setTemperature(patientData.physicalExam?.temperature || '');
                    setHeight(patientData.height || '');
                    setWeight(patientData.weight || '');
                    setRespirationRate(patientData.physicalExam?.respirationRate || '');
                    setOxygenSaturation(patientData.physicalExam?.oxygenSaturation || '');
                    setConsultationDate('');
                    setDiagnosis('');
                    setSymptoms('');
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching patient details:", error);
            }
        };

        fetchPatientDetails();
    }, [id]);

    // Handle form submission to update patient data
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const patientDocRef = doc(db, "Patients", id);

            // Create a new consultation entry
            const newConsultation = {
                consultationNotes,
                consultationDate,
                diagnosis,    // Add diagnosis to the consultation object
                symptoms      // Add symptoms to the consultation object
            };

            // Update the patient's information in Firestore by appending the new consultation record
            await updateDoc(patientDocRef, {
                consultationHistory: arrayUnion(newConsultation), // Add new record to array
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

            alert("Consultation data updated successfully!");
            navigate(`/patient-details/${id}`); // Navigate back to patient details page
        } catch (error) {
            console.error("Error updating consultation data:", error);
            alert("Error updating consultation data. Please try again.");
        }
    };

    // Get today's date in YYYY-MM-DD format for disabling previous dates
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
       
        <div className="consultation-form-container">
             <DoctorNav />
            <h2 className="form-title">Update Consultation for {patient?.Name || 'Patient'}</h2>
            <form onSubmit={handleSubmit} className="consultation-form">
                <div className="form-section">
                    <h3 className="section-title">Consultation Notes</h3>
                    <textarea
                        className="form-input"
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                        placeholder="Enter consultation notes"
                        rows="4"
                    />
                </div>

                <div className="form-section">
                    <h3 className="section-title">Consultation Date</h3>
                    <input
                        className="form-input"
                        type="date"
                        value={consultationDate}
                        onChange={(e) => setConsultationDate(e.target.value)}
                        min={getTodayDate()} // Disable past dates
                    />
                </div>

                {/* New fields for Diagnosis and Symptoms */}
                <div className="form-section">
                    <h3 className="section-title">Diagnosis</h3>
                    <textarea
                        className="form-input"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Enter diagnosis"
                        rows="2"
                    />
                </div>

                <div className="form-section">
                    <h3 className="section-title">Symptoms</h3>
                    <textarea
                        className="form-input"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Enter symptoms"
                        rows="2"
                    />
                </div>

                <div className="form-section">
                    <h3 className="section-title">Physical Examination</h3>
                    <label className="form-label">
                        Blood Pressure:
                        <input
                            className="form-input"
                            type="text"
                            value={bloodPressure}
                            onChange={(e) => setBloodPressure(e.target.value)}
                            placeholder="Enter blood pressure"
                        />
                    </label>
                    <label className="form-label">
                        Pulse:
                        <input
                            className="form-input"
                            type="text"
                            value={pulse}
                            onChange={(e) => setPulse(e.target.value)}
                            placeholder="Enter pulse"
                        />
                    </label>
                    <label className="form-label">
                        Temperature:
                        <input
                            className="form-input"
                            type="text"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            placeholder="Enter temperature"
                        />
                    </label>
                    <label className="form-label">
                        Height:
                        <input
                            className="form-input"
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="Enter height"
                        />
                    </label>
                    <label className="form-label">
                        Weight:
                        <input
                            className="form-input"
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Enter weight"
                        />
                    </label>
                    <label className="form-label">
                        Respiration Rate:
                        <input
                            className="form-input"
                            type="text"
                            value={respirationRate}
                            onChange={(e) => setRespirationRate(e.target.value)}
                            placeholder="Enter respiration rate"
                        />
                    </label>
                    <label className="form-label">
                        Oxygen Saturation:
                        <input
                            className="form-input"
                            type="text"
                            value={oxygenSaturation}
                            onChange={(e) => setOxygenSaturation(e.target.value)}
                            placeholder="Enter oxygen saturation"
                        />
                    </label>
                </div>

                <button className="form-button" type="submit">Update Consultation</button>
            </form>
        </div>
    );
};

export default ConsultationForm;
