import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PostPage from './pages/PostPage';
import ListingDetailPage from './pages/ListingDetailPage';
const ExplorePage = () => <h1>Explore & Search</h1>;
const ClaimsPage = () => <h1>My Claims</h1>;
const ProfilePage = () => <h1>My Profile</h1>;

function App() {
  return (
    <div style={{ paddingBottom: '70px' }}>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listing/:listingId" element={<ListingDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/post" element={<PostPage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/claims" element={<ClaimsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </main>
      <Navbar />
    </div>
  );
}

export default App;