import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import claimService from '../services/claimService';
import styles from './ClaimsPage.module.css';

const ClaimsPage = () => {
    const { user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            if (!user) return;
            try {
                let data;
                if (user.role === 'Taker') {
                    data = await claimService.getMyClaims(user.token);
                } else { // User is a Seller
                    data = await claimService.getReceivedClaims(user.token);
                }
                setClaims(data);
            } catch (error) {
                console.error("Failed to fetch claims:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClaims();
    }, [user]);
    const handleStatusUpdate = async (claimId, newStatus) => {
        try {
            await claimService.updateClaimStatus(claimId, newStatus, user.token);
            setClaims(prevClaims =>
                prevClaims.map(c => (c._id === claimId ? { ...c, status: newStatus } : c))
            );
            alert(`Claim has been ${newStatus.toLowerCase()}.`);
        } catch (error) {
            alert('Failed to update claim status.');
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className={styles.centered}>Loading claims...</div>;
    }
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>
                {user?.role === 'Taker' ? 'My Claims' : 'Received Claims'}
            </h1>
            {claims.length === 0 ? (
                <p className={styles.centered}>You have no claims yet.</p>
            ) : (
                <div className={styles.claimsList}>
                    {claims.map((claim) => (
                        <div key={claim._id} className={styles.claimCard}>
                            <h3>{claim.listing.title}</h3>
                            <p>Status: <span className={`${styles.status} ${styles[claim.status.toLowerCase()]}`}>{claim.status}</span></p>
                            {user.role === 'Seller' && <p>Claimed by: <strong>{claim.taker.name}</strong></p>}
                            <p className={styles.date}>Claimed on: {new Date(claim.createdAt).toLocaleDateString()}</p>
                            {user.role === 'Seller' && claim.status === 'Pending' && (
                                <div className={styles.actions}>
                                    <button onClick={() => handleStatusUpdate(claim._id, 'Confirmed')} className={styles.confirmButton}>Confirm</button>
                                    <button onClick={() => handleStatusUpdate(claim._id, 'Cancelled')} className={styles.cancelButton}>Cancel</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default ClaimsPage;