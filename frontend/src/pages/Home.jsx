import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { Calendar, Search, Loader2, Plus, AlertCircle } from 'lucide-react';

const Home = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await API.get('/events');
                setEvents(data);
                setError('');
            } catch (err) {
                console.error('Failed to fetch events', err);
                setError('Could not connect to the server. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Discover <span style={{ color: 'var(--primary-accent)' }}>College</span> Events
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
                    Stay connected with everything happening on campus. From tech fests to sports meets, find it all here.
                </p>

                <div style={{ marginTop: '2rem', position: 'relative', maxWidth: '500px', margin: '2rem auto 0' }}>
                    <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                    <input
                        type="text"
                        placeholder="Search for events..."
                        className="input-field"
                        style={{ paddingLeft: '48px', fontSize: '1rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {user?.role === 'admin' && (
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link to="/create-event" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
                        <Plus size={20} />
                        Add New Event
                    </Link>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)', marginBottom: '2rem' }}>
                    <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Connection Issue</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '1.5rem', background: 'none', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)' }}>Retry Connection</button>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={48} color="var(--primary-accent)" />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <EventCard 
                                key={event._id} 
                                event={event} 
                                onDeleteSuccess={(id) => setEvents(events.filter(e => e._id !== id))}
                            />
                        ))
                    ) : (
                        !error && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                No events found. Try searching for something else.
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
