import React from 'react';
import { Link } from 'react-router-dom';
import './DoctorNav.css'; // You can use this file to style the navbar

const DoctorNav = () => {
  return (
    <nav className="doctor-nav">
      <ul>
        <li>
          <Link to="/doctorHome">Home</Link>
        </li>
        <li>
          <Link to="/patients">Patients Details</Link>
        </li>
        {/* <li>
          <Link to="/consultation">Consultation</Link>
        </li> */}
        <li>
          <Link to="/appointments">Appointments</Link>
        </li>
      </ul>
    </nav>
  );
};

export default DoctorNav;
