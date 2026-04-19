import React, { useState, useEffect } from 'react';
import API from '../api';
import EventCard from '../components/EventCard';
import EventTicket from '../components/EventTicket';
import { Calendar, Loader2, Sparkles, AlertCircle } from 'lucide-react';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const { data } = await API.get('/registrations/my');
                setRegistrations(data);
                setError('');
            } catch (err) {
                console.error('Failed to fetch registrations', err);
                setError('Could not load your registrations. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            {selectedRegistration && (
                <EventTicket 
                    registration={selectedRegistration} 
                    onClose={() => setSelectedRegistration(null)} 
                />
            )}

            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    My <span style={{ color: 'var(--primary-accent)' }}>Registrations</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Here are the events you've signed up for. Get ready to have a blast!
                </p>
            </div>

            {error && (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)', marginBottom: '2rem' }}>
                    <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Sync Issue</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '1.5rem', background: 'none', border: '1px solid var(--primary-accent)', color: 'var(--primary-accent)' }}>Retry Sync</button>
                </div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={48} color="var(--primary-accent)" />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {registrations.length > 0 ? (
                        registrations.map(reg => (
                            <EventCard 
                                key={reg._id} 
                                event={reg.event} 
                                onViewTicket={() => setSelectedRegistration(reg)}
                                onDeleteSuccess={(id) => setRegistrations(registrations.filter(r => r.event._id !== id))}
                            />
                        ))
                    ) : (
                        !error && (
                            <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                <Sparkles size={48} color="var(--primary-accent)" style={{ opacity: 0.5 }} />
                                <div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>No registrations yet</h3>
                                    <p style={{ color: 'var(--text-muted)' }}>You haven't registered for any events. Start exploring!</p>
                                </div>
                                <button onClick={() => window.location.href = '/'} className="btn-primary">Explore Events</button>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default MyRegistrations;
