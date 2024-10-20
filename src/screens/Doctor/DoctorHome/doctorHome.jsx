import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import DoctorNav from '../DoctorNav';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DoctorHome.css';

const DoctorHome = () => {
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [user] = useAuthState(auth);
  const [doctorName, setDoctorName] = useState('');

  // Fetch the logged-in doctor's name
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

  // Fetch appointments and filter based on the doctor's name
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

        // Filter appointments based on the doctor's name
        const filtered = allAppointments.filter(appointment => {
          const appointmentDoctorName = appointment.DoctorName.toLowerCase();
          return (
            appointmentDoctorName.includes(doctorName.toLowerCase()) ||
            appointmentDoctorName.includes(`dr ${doctorName.toLowerCase()}`) ||
            appointmentDoctorName.includes(`doctor ${doctorName.toLowerCase()}`)
          );
        });

        setFilteredAppointments(filtered);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorName]);

  return (
    <div className="doctor-home-container">
      <DoctorNav />
      <div className="doctor-home-content">
        <h1 className="doctor-home-title">Welcome Back, Dr. {doctorName}</h1>
        <p className="doctor-home-welcome">Here's a summary of your day.</p>

        <div className="doctor-home-cards-container">
          <div className="doctor-home-card">
            <h2 className="doctor-home-card-title">Upcoming Appointments</h2>
            {filteredAppointments.length > 0 ? (
              <ul className="doctor-home-appointments-list">
                {filteredAppointments.map(appointment => (
                  <li key={appointment.id}>
                    {appointment.PatientName} - {appointment.Time} on {appointment.Date}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming appointments.</p>
            )}
          </div>

          <div className="doctor-home-card doctor-home-calendar-card">
            <h2 className="doctor-home-card-title2">Your Calendar</h2>
            <Calendar className="doctor-home-calendar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
