import { useEffect, useState } from 'react';
import UserRole from './UserRole';
import AdminRole from './AdminRole';
import './EventDashboard.css';

const EventDashboard = () => {
  const [role, setRole] = useState('');
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
    }
  }, []);

  return (
    <div>
      {role === 'user' ? <UserRole/> : <AdminRole/>}
    </div>
  );
};


export default EventDashboard;