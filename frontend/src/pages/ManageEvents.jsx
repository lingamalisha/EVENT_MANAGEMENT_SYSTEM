import React, { useState, useEffect } from 'react';
import API from '../api';
import { Calendar, MapPin, Trash2, Loader2, AlertCircle, Plus, Search, ExternalLink, Edit2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await API.get('/events');
            setEvents(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"? This will also remove all registrations for this event.`)) return;
        
        setDeletingId(id);
        try {
            await API.delete(`/events/${id}`);
            setEvents(events.filter(e => e._id !== id));
        } catch (err) {
            alert('Failed to delete event');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredEvents = events.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary-accent)" />
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                        Manage <span style={{ color: 'var(--primary-accent)' }}>Events</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Administrator control panel for all campus activities.</p>
                </div>
                <Link to="/create-event" className="btn-primary" style={{ textDecoration: 'none' }}>
                    <Plus size={20} /> Add New Event
                </Link>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                    <input 
                        type="text" 
                        placeholder="Filter events..." 
                        className="input-field" 
                        style={{ paddingLeft: '40px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '2rem' }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Event Details</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Location</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Date & Time</th>
                                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length > 0 ? filteredEvents.map(event => (
                                <tr key={event._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s ease' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontWeight: '700', color: 'white', marginBottom: '4px' }}>{event.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {event.description}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem' }}>
                                            <MapPin size={14} color="var(--primary-accent)" />
                                            {event.venue}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ fontSize: '0.875rem' }}>
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                            <Link 
                                                to={`/event/${event._id}`} 
                                                title="View Page"
                                                style={{ color: 'var(--text-muted)' }}
                                            >
                                                <ExternalLink size={18} />
                                            </Link>
                                            <Link 
                                                to={`/edit-event/${event._id}`} 
                                                title="Edit Event"
                                                style={{ color: 'var(--primary-accent)' }}
                                            >
                                                <Edit2 size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(event._id, event.title)}
                                                disabled={deletingId === event._id}
                                                style={{ background: 'none', border: 'none', color: '#ff636d', cursor: 'pointer' }}
                                                title="Delete Event"
                                            >
                                                {deletingId === event._id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No events found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageEvents;
