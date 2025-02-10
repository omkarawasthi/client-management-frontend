import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDetails.css';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState({});
  const [attendees, setAttendees] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    console.log("Event ID:", eventId);

    const fetchEvent = async () => {
      let response = await axios.get(`https://client-management-backend.onrender.com/api/v1/get-event/${eventId}`);
      // console.log(response.data);
      setEvent(response.data.event);
      let attendeeId = event.Attendees
      let attendeesResponse = await axios.get(`https://client-management-backend.onrender.com/api/v1/events/attendees/${eventId}`);
      setAttendees(attendeesResponse.data.user);
    }

    fetchEvent();

  }, []);

  const handleRegister = async () => {
    try {
        const userDetails =localStorage.getItem('user');
        const user = JSON.parse(userDetails);
        console.log("User Details: ",user._id)
        const userId = user._id;
        await axios.post(`https://client-management-backend.onrender.com/api/v1/register-events/${eventId}`, { userId });
        toast.success('Regitered For Event successfully');
        
        // Update attendees list dynamically
        setAttendees([...attendees, { _id: user._id, name: user.name, email: user.email }]);
        setIsRegistered(true);
      } catch (error) {
      toast.error('Already Regitered For Event successfully');
        console.error("Error registering for event:", error);
    }
};


  return (
    <div className="event-details">
      <div className="event-card-details">
        <h2>{event.EventName}</h2>
        <p className="event-description">{event.Description}</p>
        <p><strong>Date:</strong> {new Date(event.Date).toDateString()}</p>
        <p><strong>Category:</strong> {event.TypeOfEvent}</p>
        {!isRegistered ? (
          <button className="register-button" onClick={handleRegister}>Register for Event</button>
        ) : (
          <p className='already-registered'>You are already registered for this event.</p>
        )}
      </div>


      <div className="attendees-section">
        <h3>Attendees ({attendees?.length === 0 ? "No attendees" : attendees?.length})</h3>
        <ul>
          {attendees?.map(attendee => (
            <li key={attendee._id}>
              <span className="attendee-name">{attendee.Name}</span> - {attendee.Email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventDetails;
