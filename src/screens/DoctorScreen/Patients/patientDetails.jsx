import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import DoctorNav from '../DoctorNav';
import { Button, Tab } from 'react-bootstrap';
import './PatientDetails.css';

const PatientDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Fetching the ID from the URL
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('general-info'); 

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientDoc = await getDoc(doc(db, "Patients", id));
                if (patientDoc.exists()) {
                    setPatient(patientDoc.data());
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching patient details:", error);
            }
        };

        fetchPatientDetails();
    }, [id]);

    if (!patient) {
        return <div>Loading patient details...</div>;
    }

    const handleConsultationClick = () => {
        navigate(`/consultation/${id}`, { state: { patient } });
    };

    const handleMedicationClick = () => {
        navigate(`/medications/${id}`, { state: { patient } });
    };

    const handleFilesClick = () => {
        navigate(`/files/${id}`);
    };

    return (
        <div>
            <DoctorNav />
            <div className="patient-container">
                <div className="sidebar">
                    <h2>Patient Medical Records</h2>
                    <p><strong>{patient?.Name || 'Patient Name'}</strong></p>
                    <p>{patient?.Age || 'N/A'} years old</p>
                    <p>{patient?.location || 'Location'}</p>
                    <div className="button-group">
                        <Button className="button-home" variant="light" onClick={() => setActiveTab('general-info')}>General Information</Button>
                        <Button className="button-home" variant="light" onClick={() => setActiveTab('summary')}>Summary</Button>
                        <Button className="button-home" variant="light" onClick={handleConsultationClick}>Consultation Notes</Button>
                        <Button className="button-home" variant="light" onClick={handleMedicationClick}>Medication</Button>
                        <Button className="button-home" variant="light" onClick={handleFilesClick}>Files</Button> {/* Updated to navigate to Files */}
                    </div>
                </div>

                <div className="content">
                    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Tab.Content>
                            <Tab.Pane eventKey="general-info">
                                <div className="table-container">
                                    <table className="patient-table">
                                        <tbody>
                                            <tr>
                                                <th>Date of Birth</th>
                                                <td>{patient?.dateOfBirth ? new Date(patient.dateOfBirth.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Gender</th>
                                                <td>{patient?.gender || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Patient ID</th>
                                                <td>{patient?.PatientID || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td>{patient?.ContactInfo?.phone || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{patient?.ContactInfo?.email || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Emergency Contact Name</th>
                                                <td>{patient?.EmergencyContact?.name || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Relationship</th>
                                                <td>{patient?.EmergencyContact?.relationship || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Emergency Contact Phone</th>
                                                <td>{patient?.EmergencyContact?.phone || "N/A"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Pane>

                            <Tab.Pane eventKey="summary">
                                <div className="table-container">
                                    <table className="patient-table">
                                        <tbody>
                                            <tr>
                                                <th>Blood Pressure</th>
                                                <td>{patient?.physicalExam?.bloodPressure || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Pulse</th>
                                                <td>{patient?.physicalExam?.pulse || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Temperature</th>
                                                <td>{patient?.physicalExam?.temperature || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Height</th>
                                                <td>{patient?.height || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Weight</th>
                                                <td>{patient?.weight || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Respiration Rate</th>
                                                <td>{patient?.physicalExam?.respirationRate || "N/A"}</td>
                                            </tr>
                                            <tr>
                                                <th>Oxygen Saturation</th>
                                                <td>{patient?.physicalExam?.oxygenSaturation || "N/A"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Tab.Pane>

                           
                        </Tab.Content>
                    </Tab.Container>
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;
