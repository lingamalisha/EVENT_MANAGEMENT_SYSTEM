import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api';

const EventCard = ({ event, onDeleteSuccess, onViewTicket }) => {
    const { user } = useAuth();
    const [deleting, setDeleting] = useState(false);

    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) return;
        
        setDeleting(true);
        try {
            await API.delete(`/events/${event._id}`);
            if (onDeleteSuccess) onDeleteSuccess(event._id);
        } catch (err) {
            alert('Failed to delete event');
            setDeleting(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{event.title}</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(109, 99, 255, 0.2)', color: 'var(--primary-accent)', fontWeight: '600' }}>
                        {eventDate}
                    </span>
                    {user?.role === 'admin' && !onViewTicket && (
                        <button 
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{ 
                                background: 'rgba(239, 68, 68, 0.1)', border: 'none', 
                                color: '#ef4444', padding: '4px', borderRadius: '4px', 
                                cursor: 'pointer', display: 'flex', alignItems: 'center'
                            }}
                            title="Delete Event"
                        >
                            {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                        </button>
                    )}
                </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.5rem' }}>
                {event.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <MapPin size={14} />
                    <span>{event.venue}</span>
                </div>
            </div>

            {onViewTicket ? (
                <button
                    onClick={onViewTicket}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: 'auto', padding: '10px', fontSize: '0.875rem' }}
                >
                    View Entry Ticket
                    <ArrowRight size={16} />
                </button>
            ) : (
                <Link
                    to={`/event/${event._id}`}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: 'auto', padding: '10px', fontSize: '0.875rem' }}
                >
                    View Details
                    <ArrowRight size={16} />
                </Link>
            )}
        </div>
    );
};

export default EventCard;
