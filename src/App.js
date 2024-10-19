import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


import Login from './screens/Auth/Login';
import Register from './screens/Auth/Register';

import AdminDashboard from './screens/Admin/AdminDashboard';
import RegisterUser from './screens/Admin/RegisterUser';

import Dashboard from './screens/Pharmacy/Dashboard';
import ViewPrescriptions from './screens/Pharmacy/ViewPrescriptons';
import AddMedicine from './screens/Pharmacy/AddMedicine';
import ViewInventory from './screens/Pharmacy/ViewInventory';
import PatientPrescriptions from './screens/Pharmacy/PatientDetails';

import DoctorHome from './screens/DoctorScreen/DoctorHome/doctorHome'
import Patients from './screens/DoctorScreen/Patients/patients'
import ConsultationForm from './screens/DoctorScreen/Consultation/ConsultationForm'; // Correct import path
import Medications from './screens/DoctorScreen/Medications/medications'
import File from './screens/DoctorScreen/PatientFiles/file'
import Appoinments from './screens/DoctorScreen/Appoinment/appoinments'
import DoctorNav from './screens/DoctorScreen/DoctorNav'
import PatientDetails from './screens/DoctorScreen/Patients/patientDetails'

import DoctorDashboard from './screens/Doctor/DoctorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="ViewPrescriptions" element={<ViewPrescriptions />} />
        <Route path="ViewInventory" element={<ViewInventory />} />
        <Route path="add-medicine" element={<AddMedicine />} />
        <Route path="doctorDashboard" element={<DoctorDashboard />} />
        <Route path="/PatientPrescriptions/:id" element={<PatientPrescriptions />} />

        <Route path="/doctorHome" element={<DoctorHome />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appoinments />} />
        <Route path="/doctoNav" element={<DoctorNav />} />
        <Route path="/patientDetails/:id" element={<PatientDetails />} />
        <Route path="/consultation/:id" element={<ConsultationForm />} />
        <Route path="/medications/:id" element={<Medications />} />
        <Route path="/files/:id" element={<File />} />

      </Routes>
    </Router>
  );
}

export default App;
