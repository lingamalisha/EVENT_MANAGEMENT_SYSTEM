import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, User, Ticket, X, Printer, Download } from 'lucide-react';

const EventTicket = ({ registration, onClose }) => {
    if (!registration) return null;

    const handlePrint = () => {
        window.print();
    };

    const { event, studentName, studentEmail, studentPhone, _id } = registration;
    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const eventTime = new Date(event.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(12px)', padding: '20px'
        }}>
            <button 
                onClick={onClose}
                style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(255,255,255,0.1)', border: 'none',
                    borderRadius: '50%', padding: '10px', color: 'white',
                    cursor: 'pointer', display: 'flex'
                }}
            >
                <X size={24} />
            </button>

            <div className="ticket-container animate-float">
                <div className="ticket-header">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <div style={{ 
                            width: '50px', height: '50px', background: 'var(--primary-accent)', 
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                            <Ticket color="white" size={28} />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem 0' }}>{event.title}</h2>
                    <p style={{ color: 'var(--primary-accent)', fontWeight: '600', fontSize: '0.875rem' }}>ENTRY PASS</p>
                </div>

                <div className="ticket-body">
                    <div className="ticket-info-grid">
                        <div>
                            <p className="ticket-label">Date</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} color="var(--primary-accent)" />
                                <span className="ticket-value">{eventDate}</span>
                            </div>
                        </div>
                        <div>
                            <p className="ticket-label">Time</p>
                            <span className="ticket-value">{eventTime}</span>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p className="ticket-label">Venue</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={14} color="var(--primary-accent)" />
                                <span className="ticket-value">{event.venue}</span>
                            </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p className="ticket-label">Student Name</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={14} color="var(--primary-accent)" />
                                <span className="ticket-value">{studentName}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                        <div className="ticket-qr">
                            <QRCodeSVG 
                                value={`TICKET-${_id}`} 
                                size={140}
                                level="H"
                                includeMargin={false}
                            />
                        </div>
                        <p style={{ 
                            marginTop: '1rem', fontBasis: 'monospace', 
                            fontSize: '0.75rem', color: 'var(--text-muted)',
                            letterSpacing: '2px'
                        }}>
                            #{_id.slice(-10).toUpperCase()}
                        </p>
                    </div>
                </div>
                
                <div style={{ 
                    padding: '1rem', background: 'rgba(0,0,0,0.2)', 
                    textAlign: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' 
                }}>
                    PLEASE PRESENT THIS QR CODE AT THE ENTRANCE
                </div>
            </div>
        </div>
    );
};

export default EventTicket;
