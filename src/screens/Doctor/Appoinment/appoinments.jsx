import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import DoctorNav from '../DoctorNav';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './appoinments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [user] = useAuthState(auth);
  const [doctorName, setDoctorName] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch the logged-in doctor's details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (user) {
        const userDoc = await getDocs(collection(db, 'admin_details'));
        const doctor = userDoc.docs.find(doc => doc.id === user.uid);

        if (doctor && doctor.exists()) {
          const doctorData = doctor.data();
          setDoctorName(doctorData.name);
        }
      }
    };

    fetchDoctorDetails();
  }, [user]);

  // Fetch appointments from the Patients collection
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Patients'));
        const allAppointments = [];

        querySnapshot.forEach(doc => {
          const patientData = doc.data();
          if (patientData.appointments && Array.isArray(patientData.appointments)) {
            patientData.appointments.forEach(appointment => {
              allAppointments.push({
                id: doc.id, // Use patient document ID
                PatientName: patientData.Name, // Get patient's name
                ...appointment // Spread appointment data
              });
            });
          }
        });

        setAppointments(allAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on the doctor's name
  useEffect(() => {
    if (doctorName && appointments.length > 0) {
      const filtered = appointments.filter(appointment => {
        const appointmentDoctorName = appointment.DoctorName.toLowerCase();
        return (
          appointmentDoctorName.includes(doctorName.toLowerCase()) ||
          appointmentDoctorName.includes(`dr ${doctorName.toLowerCase()}`) ||
          appointmentDoctorName.includes(`doctor ${doctorName.toLowerCase()}`)
        );
      });

      setFilteredAppointments(filtered);
    }
  }, [doctorName, appointments]);

  // Handle appointment card click
  const handleCardClick = (patientId) => {
    navigate(`/patientDetails/${patientId}`); // Navigate to patient details page
  };

  return (
    <div>
       <div className='doctordashboardBg'>
      <DoctorNav />
     
      <h1 className="appointments-title">Your Appointments</h1>

      <div className="appointments-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <div 
              key={appointment.id} 
              className="appointment-card"
              onClick={() => handleCardClick(appointment.id)} // Add onClick handler
            >
              <h2>{appointment.PatientName}</h2>
              <p>Age: {appointment.Age}</p>
              <p>Date: {appointment.Date}</p>
              <p>Time: {appointment.Time}</p>
              <p>Reason: {appointment.Problem}</p>
            </div>
          ))
        ) : (
          <p>No appointments found for Dr. {doctorName}</p>
        )}
      </div>
      </div>
    </div>

  
  );
  
};

export default Appointments;
