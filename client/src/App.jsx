import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ListingDetailPage from './pages/ListingDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PostPage from './pages/PostPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
export default App;