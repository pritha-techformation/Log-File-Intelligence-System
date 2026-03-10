import React from 'react';
import HeroSection from '../components/Hero';
import { useAuth } from '../context/AuthContext';
import UserDashboard from './user/UserDashboard';
import AdminDashboard from './admin/AdminDashboard';

// Home component
const Home = () => {
  // Access user data
  const { user } = useAuth();
  return (
    <div>
      {/* Hero section */}
      <HeroSection />
      {/* User or admin dashboard */}
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
