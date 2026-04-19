import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { Calendar, MapPin, Type, AlignLeft, Loader2, Save, ArrowLeft } from 'lucide-react';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        venue: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await API.get(`/events/${id}`);
                // Format date for datetime-local input
                const formattedDate = new Date(data.date).toISOString().slice(0, 16);
                setFormData({
                    title: data.title,
                    description: data.description,
                    date: formattedDate,
                    venue: data.venue
                });
            } catch (err) {
                setError('Failed to load event details');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await API.put(`/events/${id}`, formData);
            navigate('/manage-events');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update event');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary-accent)" />
        </div>
    );

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <button
                onClick={() => navigate('/manage-events')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2rem' }}
            >
                <ArrowLeft size={18} />
                Back to Manage Events
            </button>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="glass-card" style={{ padding: '3rem', width: '100%', maxWidth: '600px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Edit <span style={{ color: 'var(--primary-accent)' }}>Event</span></h1>
                        <p style={{ color: 'var(--text-muted)' }}>Update the details for this event below.</p>
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
                                className="input-field"
                                style={{ minHeight: '120px', resize: 'vertical' }}
                                value={formData.description}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'Saving Changes...' : 'Update Event'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
