import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ListingDetailPage from './pages/ListingDetailPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

// Simple placeholders for now
const ExplorePage = () => <div><h1>Explore Page</h1></div>;
const PostPage = () => <div><h1>Post Page</h1></div>;
const NotificationsPage = () => <div><h1>Notifications Page</h1></div>;

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
      </Route>
    </Routes>
  );
}
export default App;