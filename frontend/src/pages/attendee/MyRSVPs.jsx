import React from 'react';
import { useNavigate } from 'react-router-dom';
import AttendeeDashboard from './AttendeeDashboard';

export default function MyRSVPs() {
  // This is just a wrapper component that redirects to the dashboard
  // since the dashboard already contains the RSVP functionality
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate('/attendee/dashboard');
  }, [navigate]);

  return <AttendeeDashboard />;
}