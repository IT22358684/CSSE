import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
// import { toast } from 'react-hot-toast';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth, db } from '../firebase'; // import your Firestore database

import { doc, getDoc } from 'firebase/firestore'; // Firestore methods

function AdminLogin() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = data;
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch the user's role from Firestore
      const userDoc = await getDoc(doc(db, "admin_details", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.userRole; // Assuming role is stored as 'role'

        // Navigate based on userRole
        if (userRole === 'admin') {
          navigate('/adminDashboard');
        } else if (userRole === 'doctor') {
          navigate('/doctorHome');
        } else if (userRole === 'pharmacist') {
          navigate('/dashboard');
        } else {
          // Default case if the role doesn't match any specific case
          console.log('Unknown user role');
          navigate('/');
        }
      } else {
        console.log('No user document found');
      }

      // toast.success('Login Successfully!');
    } catch (error) {
      console.log(error);
      // toast.error(error.message);
    }
  };

  return (
    <main>
      <div className="mainlogin">
        <div className="loginphoto">
          {/* <img src={loginimg} alt='loginimage' className='loginimg' /> */}
        </div>
        <div className="login">
          {/* <img src={logofull} alt='loginimage' /> */}
          <p className="wel">Welcome</p>
          <div className="loginmid">
            <form className="login" onSubmit={loginAdmin}>
              <div className="username">
                <label htmlFor="username" className="logintxt">EMAIL</label><br/>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="loginbox"
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                />
              </div>
              <div className="username">
                <label htmlFor="password" className="logintxt">PASSWORD</label><br/>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="loginbox"
                  value={data.password}
                  onChange={(e) => setData({...data, password: e.target.value})}
                />
              </div>
              <a href="/studentforgetpassword"><p className="forget">Forgot Password?<br/></p></a>
              <button type="submit" className='btnloging'>LOGIN</button>
              {/* <a href="/register"><p className="register">Admin <b>REGISTER</b></p></a> */}
            </form>
          </div>  
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
