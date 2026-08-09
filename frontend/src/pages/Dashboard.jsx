import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaFileAlt,
    FaRobot,
    FaChartLine,
    FaUpload,
    FaPlayCircle,
    FaHistory,
    FaUser,
} from "react-icons/fa";

import DashboardCard from "../components/DashboardCard";
import Button from "../components/Button";
import { getDashboard } from "../services/interviewService";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const data = await getDashboard();

            setDashboard(data);

        } catch (error) {

            console.log(error);

            alert("Failed to load dashboard.");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h1 className="text-3xl font-bold">

                    Loading Dashboard...

                </h1>

            </div>

        );

    }
    if (!dashboard) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <h1 className="text-2xl font-bold">
                Failed to load dashboard
            </h1>
        </div>
    );
}

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Header */}

            <div className="bg-white shadow">

                <div className="max-w-7xl mx-auto px-8 py-8">

                    <h1 className="text-4xl font-bold">

                        👋 Welcome Back

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Ready to crack your next interview?

                    </p>

                </div>

            </div>

            <div className="max-w-7xl mx-auto px-8 py-10">

                {/* Dashboard Cards */}

                <div className="grid md:grid-cols-5 gap-6">

                    <DashboardCard
                        icon={<FaFileAlt />}
                        title="Resumes"
                        value={dashboard.totalResumes}
                        color="bg-blue-600"
                    />

                    <DashboardCard
                        icon={<FaRobot />}
                        title="Interviews"
                        value={dashboard.totalInterviews}
                        color="bg-green-600"
                    />

                    <DashboardCard
                        icon={<FaRobot />}
                        title="Completed"
                        value={dashboard.completedInterviews}
                        color="bg-purple-600"
                    />

                    <DashboardCard
                        icon={<FaChartLine />}
                        title="Average Score"
                        value={`${dashboard.averageScore.toFixed(1)}%`}
                        color="bg-orange-600"
                    />

                    <DashboardCard
                        icon={<FaChartLine />}
                        title="Best Score"
                        value={dashboard.bestScore}
                        color="bg-red-600"
                    />

                </div>

                {/* Latest Interview */}

                <div className="bg-white rounded-xl shadow p-6 mt-10">

                    <h2 className="text-2xl font-bold mb-4">

                        📌 Latest Interview

                    </h2>

                    <p className="text-lg">

                        {
                            dashboard.latestInterviewType
                                ? dashboard.latestInterviewType
                                : "No Interview Yet"
                        }

                    </p>

                </div>

                {/* Quick Actions */}

                <div className="mt-12">

                    <h2 className="text-3xl font-bold mb-6">

                        ⚡ Quick Actions

                    </h2>

                    <div className="grid md:grid-cols-5 gap-6">

                        <Button
                            onClick={() => navigate("/resume/upload")}
                            className="py-5 text-lg"
                        >
                            <FaUpload className="inline mr-2" />
                            Upload Resume
                        </Button>
                        <Button
    onClick={() => navigate("/interview/history")}
    className="py-5 text-lg"
>
    Interview History
</Button>

                        <Button
                            onClick={() => navigate("/interview/start")}
                            className="py-5 text-lg"
                        >
                            <FaPlayCircle className="inline mr-2" />
                            Start Interview
                        </Button>

                        <Button
                            onClick={() => navigate("/resume/history")}
                            className="py-5 text-lg"
                        >
                            <FaHistory className="inline mr-2" />
                            Resume History
                        </Button>

                        <Button
                            onClick={() => navigate("/interview/history")}
                            className="py-5 text-lg"
                        >
                            <FaHistory className="inline mr-2" />
                            Interview History
                        </Button>

                        <Button
                            onClick={() => navigate("/profile")}
                            className="py-5 text-lg"
                        >
                            <FaUser className="inline mr-2" />
                            Profile
                        </Button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;