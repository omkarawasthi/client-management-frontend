import { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDashboard.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminRole = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState({});
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        category: 'Technology',
        date: '',
    });


    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let response = await axios.get('https://client-management-backend.onrender.com/api/v1/get-events');
                const formattedEvents = response.data.events.map(event => ({
                    id: event._id,
                    title: event.EventName,
                    date: event.Date,
                    category: event.TypeOfEvent,
                    description: event.Description,
                }));

                setEvents(formattedEvents);
            }
            catch (err) {
                console.log("Error in fetching events", err);
            }
        }

        fetchEvents();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        else{
            console.log("stored User hai hi nhi")
        }
    }, []);

    const categories = ['all', ...new Set(events.map(event => event.category || "Unknown"))];


    const filterEvents = (event) => {
        const today = new Date();
        const eventDate = new Date(event.date);
        const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;

        if (dateFilter === 'upcoming') {
            return categoryMatch && eventDate >= today;
        } else if (dateFilter === 'past') {
            return categoryMatch && eventDate < today;
        }
        return categoryMatch;
    };

    const filteredEvents = events.filter(filterEvents);
    const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
    const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

    const handleAddEvent = () => {
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setNewEvent({ title: '', description: '', category: 'Technology', date: '' });
    };

    const handleInputChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };


    const handleCardClick = (eventId) => {
        navigate(`/event-details/${eventId}`);
    };

    const HandleLogout = () => {
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
    }

    const handleFormSubmit = async (e) => {
        try {
            let response = await axios.post('https://client-management-backend.onrender.com/api/v1/create-event', newEvent);
            if (!newEvent.title || !newEvent.description || !newEvent.date) {
                alert("Please fill all fields.");
                return;
            }
            setEvents([...events, { id: events.length + 1, ...newEvent }]);
            handleFormClose();
        } catch (err) {
            console.log("Error in creating event", err);
        }

    };

    return (
        <div className="event-dashboard">
            <header className="dashboard-header">
                <p className='display-user'>Hi, {user.Name}</p>
                <h1>Event Dashboard</h1>
                <button onClick={() => HandleLogout()} className='logout'>Logout</button>
                <div className="filters">
                    <select
                        className="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        className="date-filter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="all">All Dates</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>

                    <button className="add-event" onClick={handleAddEvent}>Add Event</button>
                </div>
            </header>

            <div className="events-container">
                <section className="upcoming-events">
                    <h2>Upcoming Events ({upcomingEvents.length})</h2>
                    <div className="events-grid">
                        {upcomingEvents.map(event => (
                            <div onClick={() => handleCardClick(event.id)} key={event.id} className="event-card">
                                <div className="event-date">
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    <span> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h3>{event.title}</h3>
                                <p className="event-description">{event.description}</p>
                                <span className="event-category">{event.category}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="past-events">
                    <h2>Past Events ({pastEvents.length})</h2>
                    <div className="events-grid">
                        {pastEvents.map(event => (
                            <div key={event.id} className="event-card past">
                                <div className="event-date">
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    <span> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h3>{event.title}</h3>
                                <p className="event-description">{event.description}</p>
                                <span className="event-category">{event.category}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Create New Event</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label>Event Name</label>
                                <input type="text" name="title" value={newEvent.title} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Event Description</label>
                                <textarea name="description" value={newEvent.description} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Type of Event</label>
                                <select name="category" value={newEvent.category} onChange={handleInputChange}>
                                    <option value="Technology">Technology</option>
                                    <option value="Music">Music</option>
                                    <option value="Business">Business</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Event Date & Time</label>
                                <input type="datetime-local" name="date" value={newEvent.date} onChange={handleInputChange} required />
                            </div>
                            <div className="form-actions">
                                <button type="submit">Save Event</button>
                                <button type="button" className="cancel-btn" onClick={handleFormClose}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRole;
