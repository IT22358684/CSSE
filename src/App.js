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
      </Routes>
    </Router>
  );
}

export default App;
