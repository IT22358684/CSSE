import React from 'react';
import DoctorNav from '../DoctorNav'; // Make sure the path is correct

const DoctorHome = () => {
  return (
    <div>
      <DoctorNav />
      <h1>Appoinments</h1>
      {/* <p>Welcome to the Doctor's Home Page</p> */}
    </div>
  );
};

export default DoctorHome;