import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts and Pages
import MainLayout from './components/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ListingDetailPage from './pages/ListingDetailPage.jsx';
import PostPage from './pages/PostPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx'; // <-- ⭐️ THIS IS THE MISSING LINE

// Simple placeholder for now
const ExplorePage = () => <div style={{ padding: '1rem' }}><h1>Explore Page</h1></div>;

function App() {
  return (
    <Routes>
      {/* Routes WITHOUT the navbar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Routes WITH the navbar (wrapped in MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} /> 
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} /> {/* This line was erroring */}
      </Route>
    </Routes>
  );
}
export default App;