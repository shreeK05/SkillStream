import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import AssignTraining from './pages/admin/AssignTraining';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AssetManagement from './pages/admin/AssetManagement';
import Analytics from './pages/admin/Analytics';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyLearning from './pages/employee/MyLearning';
import CoursePlayer from './pages/employee/CoursePlayer';
import MyProgress from './pages/employee/MyProgress';
import Library from './pages/employee/Library';
import UserProfile from './pages/employee/UserProfile';
import LandingPage from './pages/LandingPage';

// Wrapper for Protected Routes
const ProtectedRoute = () => {
    const { isAuthenticated } = useAppContext();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

const AppRoutes = () => {
    const { isAuthenticated, currentUser } = useAppContext();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={isAuthenticated ? <Navigate to={currentUser?.role === 'Admin' ? "/admin/dashboard" : "/employee/dashboard"} /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to={currentUser?.role === 'Admin' ? "/admin/dashboard" : "/employee/dashboard"} /> : <Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/employees" element={<EmployeeManagement />} />
                <Route path="/admin/assets" element={<AssetManagement />} />
                <Route path="/admin/assign" element={<AssignTraining />} />
                <Route path="/admin/analytics" element={<Analytics />} />

                {/* Employee Routes */}
                <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                <Route path="/employee/learning" element={<MyLearning />} />
                <Route path="/employee/learning/:id" element={<CoursePlayer />} />
                <Route path="/employee/library" element={<Library />} />
                <Route path="/employee/progress" element={<MyProgress />} />
                <Route path="/employee/profile" element={<UserProfile />} />
            </Route>

            {/* Default Redirect */}
            {/* Landing Page as Default */}
            <Route path="/" element={<LandingPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <AppProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AppProvider>
    );
}

export default App;