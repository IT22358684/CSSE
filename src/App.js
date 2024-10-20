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

import AdminPayments from './screens/Admin/Admin_check/PatientPayments/Payment'
import ClaimInsuarance from './screens/Admin/Admin_check/InsuaranceClaim/Claim'
import Messages from './screens/Admin/Admin_check/DoctorMessages/messages'

import DoctorHome from './screens/Doctor/DoctorHome/doctorHome'
import Patients from './screens/Doctor/AllPatients/patients'
import ConsultationForm from './screens/Doctor/Consultation/ConsultationForm'; // Correct import path
import Medications from './screens/Doctor/Medications/medications'
import File from './screens/Doctor/PatientFiles/file'
import Appoinments from './screens/Doctor/Appoinment/appoinments'
import DoctorNav from './screens/Doctor/DoctorNav'
import PatientDetails from './screens/Doctor/Patients/patientDetails'

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
        <Route path="/PatientPrescriptions/:id" element={<PatientPrescriptions />} />
        <Route path="/doctorHome" element={<DoctorHome />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appoinments />} />
        <Route path="/doctoNav" element={<DoctorNav />} />
        <Route path="/patientDetails/:id" element={<PatientDetails />} />
        <Route path="/consultation/:id" element={<ConsultationForm />} />
        <Route path="/medications/:id" element={<Medications />} />
        <Route path="/files/:id" element={<File />} />

        <Route path="/adminPayments" element={<AdminPayments />} />
        <Route path="/claim" element={<ClaimInsuarance />} />
        <Route path="/messages" element={<Messages />} />

      </Routes>
    </Router>
  );
}

export default App;
