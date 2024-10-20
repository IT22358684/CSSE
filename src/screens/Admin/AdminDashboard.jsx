import React from 'react';
import './admin.css'; // Import the CSS file

function AdminDashboard() {
    return (
        <div className="admin-dashboard">
            <nav className="navbar">
                <ul className="nav-list">
                    <li className="nav-item">
                        <a href="adminPayments" className="nav-link">Payments</a>
                    </li>
                    <li className="nav-item">
                        <a href="registerUser" className="nav-link">Add User</a>
                    </li>
                    <li className="nav-item">
                        <a href="claim" className="nav-link">Claim Insurance</a>
                    </li>
                    <li className="nav-item">
                        <a href="messages" className="nav-link">Doctor Issues</a>
                    </li>
                </ul>
            </nav>
            {/* <div className="col-3">
                <button className="add-user-btn">
                    <a href="registerUser" className="btn btn-primary" style={{ width: '18rem' }}>
                        Add User
                    </a>
                </button>
            </div> */}
        </div>
    );
}

export default AdminDashboard;
