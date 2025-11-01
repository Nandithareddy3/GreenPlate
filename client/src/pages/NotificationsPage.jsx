import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import NotificationCard from '../components/NotificationCard.jsx';
import styles from './NotificationsPage.module.css';

const NotificationsPage = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(data);

        // After fetching, mark them all as read
        await axios.put('http://localhost:5000/api/notifications/read', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Notifications</h1>
      
      <div className={styles.feed}>
        {loading ? (
          <p>Loading...</p>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <NotificationCard key={notif._id} notification={notif} />
          ))
        ) : (
          <p className={styles.emptyMessage}>You have no notifications.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;