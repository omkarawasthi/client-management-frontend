import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDetails.css';
import { toast } from 'react-toastify';

const EventDetails = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState({});
  const [attendees, setAttendees] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({
    EventName: '',
    Description: '',
    Date: '',
    TypeOfEvent: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://client-management-backend.onrender.com/api/v1/get-event/${eventId}`);
        setEvent(response.data.event);
        // Pre-populate update form data with current event details.
        setUpdateData({
          EventName: response.data.event.EventName,
          Description: response.data.event.Description,
          Date: response.data.event.Date, // Expecting an ISO date string
          TypeOfEvent: response.data.event.TypeOfEvent
        });
        const attendeesResponse = await axios.get(`https://client-management-backend.onrender.com/api/v1/events/attendees/${eventId}`);
        setAttendees(attendeesResponse.data.user);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`https://client-management-backend.onrender.com/api/v1/delete-event/${eventId}`);
      toast.success("Event deleted successfully!");
      navigate('/event-dashboard');
    } catch (err) {
      console.error("Error deleting event", err);
      toast.error("Failed to delete event.");
    }
  };

  const handleRegister = async () => {
    try {
      const userDetails = localStorage.getItem('user');
      const user = JSON.parse(userDetails);
      const userId = user._id;
      await axios.post(`https://client-management-backend.onrender.com/api/v1/register-events/${eventId}`, { userId });
      toast.success('Registered for event successfully');
      // Update attendees list dynamically.
      setAttendees([...attendees, { _id: user._id, Name: user.name, Email: user.email }]);
      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error('Already registered for event');
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateData({
      ...updateData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://client-management-backend.onrender.com/api/v1/update-event/${eventId}`, updateData);
      toast.success('Event updated successfully');
      setEvent(response.data.event);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating event", error);
      toast.error("Failed to update event");
    }
  };

  return (
    <div className="event-details">
      <div className="event-card-details">
        <h2>{event.EventName}</h2>
        <p className="event-description">{event.Description}</p>
        <p><strong>Date:</strong> {new Date(event.Date).toDateString()}</p>
        <p><strong>Category:</strong> {event.TypeOfEvent}</p>
        <button className="delete-btn" onClick={handleDeleteEvent}>Delete</button>
        {!isRegistered ? (
          <button className="register-button" onClick={handleRegister}>Register for Event</button>
        ) : (
          <p className="already-registered">You are already registered for this event.</p>
        )}
        {/* Toggle Update Form */}
        <button className="update-btn" onClick={() => setShowUpdateForm(!showUpdateForm)}>
          {showUpdateForm ? "Cancel Update" : "Update Event"}
        </button>
        {showUpdateForm && (
          <form className="update-form" onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              name="EventName"
              value={updateData.EventName}
              onChange={handleUpdateChange}
              placeholder="Event Name"
              required
            />
            <textarea
              name="Description"
              value={updateData.Description}
              onChange={handleUpdateChange}
              placeholder="Description"
              required
            />
            <input
              type="date"
              name="Date"
              value={updateData.Date ? updateData.Date.split('T')[0] : ''}
              onChange={handleUpdateChange}
              required
            />
            <input
              type="text"
              name="TypeOfEvent"
              value={updateData.TypeOfEvent}
              onChange={handleUpdateChange}
              placeholder="Event Category"
              required
            />
            <button type="submit" className="update-submit-btn">Update Event</button>
          </form>
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