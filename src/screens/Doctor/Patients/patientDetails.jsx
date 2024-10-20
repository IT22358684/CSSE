import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import DoctorNav from '../DoctorNav';
import { Button, Tab } from 'react-bootstrap';
import './PatientDetails.css'; // Updated styles

const TABS = {
    GENERAL_INFO: 'general-info',
    SUMMARY: 'summary'
};

const PatientDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [age, setAge] = useState(null);
    const [activeTab, setActiveTab] = useState(TABS.GENERAL_INFO);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob.seconds * 1000);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        return calculatedAge;
    };

    const fetchPatientDetails = async () => {
        try {
            const patientDoc = await getDoc(doc(db, "Patients", id));
            if (patientDoc.exists()) {
                const patientData = patientDoc.data();
                setPatient(patientData);
                if (patientData.dateOfBirth) {
                    const calculatedAge = calculateAge(patientData.dateOfBirth);
                    setAge(calculatedAge);
                }
            } else {
                throw new Error("No such document!");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, [id]);

    const handleNavigation = (path) => {
        navigate(path, { state: { patient } });
    };

    if (loading) {
        return <div>Loading patient details...</div>;
    }

    if (error) {
        return <div>Error fetching patient details: {error}</div>;
    }

    return (
        <div className="patient-details-container">
            <DoctorNav />
            <div className="patient-details">
                <div className="patient-sidebar">
                    <h2>Patient Medical Records</h2>
                    <p><strong>{patient?.Name || 'Patient Name'}</strong></p>
                    <p>{age !== null ? `${age} years old` : 'N/A'}</p>
                    <p>{patient?.location || 'Location'}</p>
                    <div className="patient-button-group">
                        <Button className="patient-button" variant="light" onClick={() => setActiveTab(TABS.GENERAL_INFO)}>General Information</Button>
                        <Button className="patient-button" variant="light" onClick={() => setActiveTab(TABS.SUMMARY)}>Summary</Button>
                        <Button className="patient-button" variant="light" onClick={() => handleNavigation(`/consultation/${id}`)}>Consultation Notes</Button>
                        <Button className="patient-button" variant="light" onClick={() => handleNavigation(`/medications/${id}`)}>Medication</Button>
                        <Button className="patient-button" variant="light" onClick={() => handleNavigation(`/files/${id}`)}>Files</Button>
                    </div>
                </div>

                <div className="patient-content">
                    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Tab.Content>
                            <Tab.Pane eventKey={TABS.GENERAL_INFO}>
                                <div className="patient-table-container">
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
                                                <td>{patient?.patientId || "N/A"}</td>
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

                            <Tab.Pane eventKey={TABS.SUMMARY}>
                                <div className="patient-table-container">
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
