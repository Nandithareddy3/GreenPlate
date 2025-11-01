import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotificationCard.module.css';
import { BiBell } from 'react-icons/bi';

const NotificationCard = ({ notification }) => {
  // Use a 'read' class if the notification is read
  const cardClasses = `${styles.card} ${notification.isRead ? styles.read : ''}`;

  return (
    <Link to={notification.link || '#'} className={styles.cardLink}>
      <div className={cardClasses}>
        <div className={styles.iconWrapper}>
          <BiBell size={20} />
        </div>
        <div className={styles.content}>
          <p className={styles.message}>{notification.message}</p>
          <span className={styles.time}>
            {new Date(notification.createdAt).toLocaleString()}
          </span>
        </div>
        {!notification.isRead && <div className={styles.unreadDot}></div>}
      </div>
    </Link>
  );
};

export default NotificationCard;