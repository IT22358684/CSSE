import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

function RegisterUser() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',       
    password: '',
    repassword: '',
    userRole: '',  // Set default userRole to 'admin'
  });

  const registerAdmin = async (e) => {
    e.preventDefault();
    try {
      if (data.password !== data.repassword) {
        toast.error('Passwords do not match');
        return;
      } else {
        const { name, email, password, userRole } = data;
        await createUserWithEmailAndPassword(auth, email, password);
        const admin = auth.currentUser;
        if (admin) {
          // Save the admin's details and the role in Firestore
          await setDoc(doc(db, "admin_details", admin.uid), {
            name: name,
            email: admin.email,
            userRole: userRole,  // Save user role as 'admin'
          });
        }

        toast.success("Register Successfully!");
        navigate('/adminDashboard');        
      }      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <main>
      <div className="mainlogin">
        <div className="loginphoto"></div>
        <div className="login">
          <div className="loginmid">
            <form onSubmit={registerAdmin}>
              <div className="username">
                <label htmlFor="name" className="logintxt">FULL NAME</label><br/>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name" 
                  className="loginbox" 
                  value={data.name} 
                  onChange={(e) => setData({...data, name: e.target.value})}
                />                        
              </div>  
              <div className="username">
                <label htmlFor="email" className="logintxt">EMAIL</label><br/>
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
              <div className="username">
                <label htmlFor="repassword" className="logintxt">RE-ENTER PASSWORD</label><br/>
                <input 
                  type="password" 
                  id="repassword" 
                  name="repassword" 
                  placeholder="Enter your password again" 
                  className="loginbox" 
                  value={data.repassword} 
                  onChange={(e) => setData({...data, repassword: e.target.value})}
                />
              </div>
              <div className="username">
                <label htmlFor="userRole" className="logintxt">USER ROLE</label><br/>
                <select id="userRole" name="userRole" required onChange={(e) => setData({...data, userRole: e.target.value})} className='form-control'>
                                <option value="">Select</option>
                                <option value="doctor">Doctor</option>
                                <option value="pharmacist">Pharmacist</option>
                            </select>
              </div>
              <br/>
              <button type="submit" className='btnloging'> Register</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RegisterUser;
