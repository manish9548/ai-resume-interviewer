import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import ResumeHistory from "./pages/ResumeHistory";
import StartInterview from "./pages/StartInterview";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
            
            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
                }
                /> 

            

            <Route path="/resume/upload" element={<ResumeUpload />} />

            <Route path="/resume/history" element={<ResumeHistory />} />

            <Route path="/interview/start" element={<StartInterview />} />

            <Route path="/interview/:id" element={<Interview />} />

            <Route path="/result/:id" element={<Result />} />

            <Route path="/profile" element={<Profile />} />

        </Routes>

    );
}

export default App;