import { useEffect, useState } from 'react';
import axios from 'axios';
import './EventDashboard.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserRole = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');


    

    useEffect(() => {
        const fetchEvents = async () => {
            try{
                let response = await axios.get('https://client-management-backend.onrender.com/api/v1/get-events');
                const formattedEvents = response.data.events.map(event => ({
                    id: event._id,  // Using _id from API response
                    title: event.EventName,
                    date: event.Date, 
                    category: event.TypeOfEvent, // Fix category field
                    description: event.Description,
                }));
    
                setEvents(formattedEvents);
            }
            catch(err){
                console.log("Error in fetching events",err);
            }
        }

        fetchEvents();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
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


    
    const handleCardClick = (eventId) => {
        navigate(`/event-details/${eventId}`);
    };
    

    const HandleLogout = () => {
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/');
    }

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
        </div>
    );
};

export default UserRole;
