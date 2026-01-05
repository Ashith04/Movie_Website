import React from 'react';
import { CheckCircle, Info, X } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/Notification.css';

const Notification = () => {
    const { notification, showNotification } = useGlobalContext();

    if (!notification) return null;

    const { message, type } = notification;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return <CheckCircle size={20} />;
        }
    };

    const handleClose = () => {
        showNotification(null);
    };

    return (
        <div className={`notification notification-${type}`}>
            <div className="notification-content">
                <div className="notification-icon">
                    {getIcon()}
                </div>
                <span className="notification-message">{message}</span>
                <button 
                    className="notification-close"
                    onClick={handleClose}
                    aria-label="Close notification"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};

export default Notification;