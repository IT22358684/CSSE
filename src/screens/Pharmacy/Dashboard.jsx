import React, { useState } from 'react';
import { db } from '../firebase'; // Assuming firebase.js is correctly exporting db
import { collection, query, where, getDocs } from 'firebase/firestore';
import Nav from './pharmacyNav';
import './phStyle.css';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [healthCardNumber, setHealthCardNumber] = useState('');
  const [error, setError] = useState(null);
  const [patientData, setPatientData] = useState(null);
  // const [patientAge, setPatientAge] = useState(null); // Store age
  const navigate = useNavigate();

  // Function to calculate age based on date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Navigate to patient prescriptions page
  const handlePatientClick = (patient) => {
    navigate(`/PatientPrescriptions/${patient.id}`, { state: { patient } });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setPatientData(null);
    // setPatientAge(null);
    try {
      const patientRef = collection(db, 'Patients');
      const q = query(patientRef, where('patientId', '==', healthCardNumber)); // Change query to search by health card number
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const patient = doc.data();

        // Include the document ID in the patient object
        patient.id = doc.id;  // <-- Add this line to store the ID

        setPatientData(patient);

        // Calculate age based on the 'dateOfBirth' field
        // if (patient.dateOfBirth) {
        //   const age = calculateAge(patient.dateOfBirth);
        //   setPatientAge(age);
        // }
      } else {
        setError('No patient found with this health card number.');
      }
    } catch (err) {
      setError('Error fetching data.');
      console.error(err);
    }
  };

  return (
    <div>
      <Nav />
      <div className='dashboardBg'>
        <div 
          className="searchbar" 
          style={{ padding: '60px', paddingTop: patientData ? '50px' : '250px' }}
        >
          <form className="d-flex" role="search" onSubmit={handleSearch}>
            <input
              className="form-control"
              type="search"
              placeholder="Enter health card number..."
              aria-label="Search"
              id="patienID"
              name="patienID"
              value={healthCardNumber}
              onChange={(e) => setHealthCardNumber(e.target.value)}
              style={{ width: '700px', padding: '10px' }}
            />
            <button className="searchbtn" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {patientData && (
          <div className="patient-detailsph">
            <h2 className="topic">PATIENT DETAILS</h2>
            <p><strong>Name</strong>: {patientData.Name}</p>
            <p><strong>Health card number</strong>: {patientData.patientId}</p>
            {/* <p><strong>Age</strong>: {patientAge ? patientAge : 'N/A'}</p> Display calculated age */}
            <p><strong>Gender</strong>: {patientData.gender}</p>
            <button 
              className="btn btn-primary phbtn"
              onClick={() => handlePatientClick(patientData)}
            >
              View Prescriptions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;