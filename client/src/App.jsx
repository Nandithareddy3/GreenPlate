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
import UserProfilePage from './pages/UserProfilePage.jsx';
import InboxPage from './pages/InboxPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx'; 
import EditListingPage from './pages/EditListingPage.jsx';
import CreateStoryPage from './pages/CreateStoryPage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';

function App() {
  return (
    <Routes>
      {/* Routes WITHOUT the navbar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Chat page is outside MainLayout for full-screen */}
      <Route path="/chat/:id" element={<ChatPage />} />

      {/* Routes WITH the navbar (wrapped in MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/listing/:id" element={<ListingDetailPage />} /> 
        <Route path="/explore" element={<ExplorePage />} /> 
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/inbox" element={<InboxPage />} /> 
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
        <Route path="/edit/:id" element={<EditListingPage />} />
        <Route path="/create-story" element={<CreateStoryPage />} />
      </Route>
    </Routes>
  );
}
export default App;