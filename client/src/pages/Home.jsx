import React from 'react';
import HeroSection from '../components/Hero';
import { useAuth } from '../context/AuthContext';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
const Home = () => {
  const { user } = useAuth();
  return (
    <div>
      <HeroSection />
      {user && user.role === "user" ? (
          <UserDashboard />
        ) : (
          <AdminDashboard />
        )
      }

      
    </div>
  );
};



export default Home;
