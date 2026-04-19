import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import EventTicket from '../components/EventTicket';
import { Calendar, MapPin, User, CheckCircle, Loader2, ArrowLeft, Trash2, Phone, Mail, UserCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        studentName: user?.name || '',
        studentEmail: user?.email || '',
        studentPhone: ''
    });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await API.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                console.error('Failed to fetch event', err);
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                studentName: user.name,
                studentEmail: user.email
            }));
        }
    }, [user]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegistering(true);
        setError('');
        try {
            const { data } = await API.post('/registrations', {
                eventId: id,
                ...formData
            });
            // Ensure the event object is present for the ticket display
            const completeRegData = { ...data, event: event };
            setRegistrationData(completeRegData);
            setRegistered(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register for event');
        } finally {
            setRegistering(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
        
        setDeleting(true);
        try {
            await API.delete(`/events/${id}`);
            navigate('/');
        } catch (err) {
            setError('Failed to delete event');
            setDeleting(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary-accent)" />
        </div>
    );

    if (error && !event) return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ color: '#ef4444' }}>{error}</h2>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ margin: '2rem auto' }}>Go Back Home</button>
        </div>
    );

    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="container" style={{ position: 'relative' }}>
            {/* Success Event Card / Ticket Overlay */}
            {registered && registrationData && (
                <EventTicket 
                    registration={registrationData} 
                    onClose={() => setRegistered(false)} 
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowLeft size={18} />
                    Back to Events
                </button>

                {user?.role === 'admin' && (
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', 
                            color: '#ef4444', padding: '8px 16px', borderRadius: '8px', 
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        Delete Event
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: 'white' }}>{event.title}</h1>

                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={20} color="var(--primary-accent)" />
                            <span>{eventDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={20} color="var(--primary-accent)" />
                            <span>{event.venue}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'white' }}>Description</h3>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            {event.description}
                        </p>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'white' }}>Register Now</h3>

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <UserCircle size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="text"
                                    className="input-field"
                                    style={{ paddingLeft: '35px', paddingTop: '10px', paddingBottom: '10px' }}
                                    placeholder="Enter your name"
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="email"
                                    className="input-field"
                                    style={{ paddingLeft: '35px' }}
                                    placeholder="your@email.com"
                                    value={formData.studentEmail}
                                    onChange={(e) => setFormData({...formData, studentEmail: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Phone Number</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="tel"
                                    className="input-field"
                                    style={{ paddingLeft: '35px' }}
                                    placeholder="Enter mobile number"
                                    value={formData.studentPhone}
                                    onChange={(e) => setFormData({...formData, studentPhone: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p style={{ color: '#ef4444', fontSize: '0.8125rem' }}>{error}</p>}

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={registering}
                        >
                            {registering ? <Loader2 className="animate-spin" /> : 'Confirm Registration'}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                        <User size={14} />
                        <span>Organized by {event.createdBy?.name || 'Admin'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
