import React from 'react';
import DoctorNav from '../DoctorNav';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import './DoctorHome.css'; 

const DoctorHome = () => {
  return (
    <div className="doctor-home-container">
      <DoctorNav />
      <h1 className="doctor-home-title">Doctor's Home Screen</h1>
      <p className="doctor-home-welcome">Welcome to the Doctor's Home Page</p>
      
      <div className="doctor-home-cards-container">
        <div className="doctor-home-left-card">
          <h2 className="doctor-home-card-title">Patient Details</h2>
          <p className="doctor-home-card-description">This section contains the patient's details and records.</p>
        </div>

        <div className="doctor-home-right-card">
          <h2 className="doctor-home-card-title">Calendar</h2>
          <Calendar className="doctor-home-calendar" />
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;
