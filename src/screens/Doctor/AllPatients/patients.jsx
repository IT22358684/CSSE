import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 
import DoctorNav from '../DoctorNav';
import { useNavigate } from 'react-router-dom';
import { Card, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import './patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch patients from Firestore on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Patients"));
        const patientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPatients(patientsList);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

 // Filter patients based on the search term
const filteredPatients = patients.filter(patient => 
  patient.patientId && patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
);


  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';

    // If dateOfBirth is a Firestore Timestamp
    if (dateOfBirth.seconds) {
      const birthDate = new Date(dateOfBirth.seconds * 1000);
      const ageDiff = Date.now() - birthDate.getTime();
      return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
    }

    // If dateOfBirth is a standard date string
    const birthDate = new Date(dateOfBirth);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
  };

  // Navigate to patient details
  const handlePatientClick = (patient) => {
    navigate(`/patientDetails/${patient.id}`, { state: { patient } });
  };

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Messages"), {
        subject: subject,
        message: message,
        timestamp: new Date(),
      });
      resetForm();
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error storing message:', error);
    }
  };

  // Reset the message form fields
  const resetForm = () => {
    setSubject('');
    setMessage('');
    setShowForm(false);
  };

  const noPatientsFound = filteredPatients.length === 0 && searchTerm.length > 0;

  return (
    <div>
      <DoctorNav />
      <h1 className="patients-title">Patient's Details</h1>

      {/* Search Input */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by Patient ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </InputGroup>

      {/* Patient Cards */}
      <div className="scrollable-container">
        {filteredPatients.map(patient => (
          <Card
            key={patient.id}
            onClick={() => handlePatientClick(patient)}
            className="patient-card"
          >
            <Card.Body>
              <Card.Title className="card-title">{patient.Name}</Card.Title>
              <Card.Text className="card-text">Age: {calculateAge(patient.dateOfBirth)}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* No Patients Found Message */}
      {noPatientsFound && (
        <div className="no-patients-message">
          <p>No patients found. Please send a message:</p>
          <Button onClick={() => setShowForm(true)}>Open Message Form</Button>
        </div>
      )}

      {/* Message Modal */}
      <Modal show={showForm} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>Send a Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Send</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Patients;
