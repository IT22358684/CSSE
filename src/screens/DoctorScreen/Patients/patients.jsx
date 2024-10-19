import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 
import DoctorNav from '../DoctorNav';
import { useNavigate } from 'react-router-dom';
import { Card, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import './report.css'; // Make sure this file includes the updated CSS

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false); // State for showing form
  const [subject, setSubject] = useState(''); // State for subject input
  const [message, setMessage] = useState(''); // State for message input
  const navigate = useNavigate();

  // Fetch Patients data from Firebase
  useEffect(() => {
    const fetchPatients = async () => {
      const querySnapshot = await getDocs(collection(db, "Patients"));
      const patientsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPatients(patientsList);
    };

    fetchPatients();
  }, []);

  // Filtered list based on search term
  const filteredPatients = patients.filter((patient) =>
    patient.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Navigate to patient details page
  const handlePatientClick = (patient) => {
    navigate(`/patientDetails/${patient.id}`, { state: { patient } });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Store the message in Firebase
      await addDoc(collection(db, "Messages"), {
        subject: subject,
        message: message,
        timestamp: new Date(),
      });

      // Reset the form and close it
      setSubject('');
      setMessage('');
      setShowForm(false);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error storing message:', error);
    }
  };

  // Show form if no patients are found after filtering
  const noPatientsFound = filteredPatients.length === 0 && searchTerm.length > 0;

  return (
    <div>
      <DoctorNav />
      <h1>Patient's Details</h1>

      {/* Search Bar */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Scrollable Cards */}
      <div className="scrollable-container">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            onClick={() => handlePatientClick(patient)}
            className="card"
          >
            <Card.Body>
              <Card.Title className="card-title">{patient.Name}</Card.Title>
              <Card.Text className="card-text">
                Age: {patient.Age}
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Show form if no patients found after searching */}
      {noPatientsFound && (
        <div className="no-patients-message">
          <p>No patients found. Please send a message:</p>
          <Button onClick={() => setShowForm(true)}>Open Message Form</Button>
        </div>
      )}

      {/* Modal for sending message */}
      <Modal show={showForm} onHide={() => setShowForm(false)}>
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
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Patients;
