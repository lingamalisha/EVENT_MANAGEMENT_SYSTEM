import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { Calendar, MapPin, Type, AlignLeft, Loader2, Send } from 'lucide-react';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        venue: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await API.post('/events', formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Create <span style={{ color: 'var(--primary-accent)' }}>New Event</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Fill in the details to host a new event on campus.</p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Type size={16} /> Event Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Annual Tech Symposium"
                            className="input-field"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={16} /> Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                name="date"
                                className="input-field"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} /> Venue
                            </label>
                            <input
                                type="text"
                                name="venue"
                                placeholder="e.g. Main Auditorium"
                                className="input-field"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlignLeft size={16} /> Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Provide a detailed description of the event..."
                            className="input-field"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                        {loading ? 'Creating Event...' : 'Launch Event'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
