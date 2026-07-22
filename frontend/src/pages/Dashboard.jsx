import { useNavigate } from "react-router-dom";

import {
    FaFileAlt,
    FaRobot,
    FaChartLine,
    FaFilePdf,
    FaUpload,
    FaPlayCircle,
    FaHistory,
} from "react-icons/fa";

import DashboardCard from "../components/DashboardCard";
import RecentInterviewCard from "../components/RecentInterviewCard";
import Button from "../components/Button";

function Dashboard() {

    const navigate = useNavigate();

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Header */}

            <div className="bg-white shadow">

                <div className="max-w-7xl mx-auto px-8 py-8">

                    <h1 className="text-4xl font-bold">
                        👋 Welcome Back, Manish
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Ready to crack your next interview?
                    </p>

                </div>

            </div>

            <div className="max-w-7xl mx-auto px-8 py-10">

                {/* Dashboard Cards */}

                <div className="grid md:grid-cols-4 gap-6">

                    <DashboardCard
                        icon={<FaFileAlt />}
                        title="Resumes"
                        value="1"
                        color="bg-blue-600"
                    />

                    <DashboardCard
                        icon={<FaRobot />}
                        title="Interviews"
                        value="5"
                        color="bg-green-600"
                    />

                    <DashboardCard
                        icon={<FaChartLine />}
                        title="Average Score"
                        value="88%"
                        color="bg-purple-600"
                    />

                    <DashboardCard
                        icon={<FaFilePdf />}
                        title="Reports"
                        value="3"
                        color="bg-red-600"
                    />

                </div>

                {/* Quick Actions */}

                <div className="mt-12">

                    <h2 className="text-3xl font-bold mb-6">
                        ⚡ Quick Actions
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        <Button
                            onClick={() => navigate("/resume/upload")}
                            className="py-5 text-lg"
                        >
                            <FaUpload className="inline mr-2" />
                            Upload Resume
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

                    </div>

                </div>

                {/* Recent Interviews */}

                <div className="mt-14">

                    <h2 className="text-3xl font-bold mb-6">
                        📋 Recent Interviews
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">

                        <RecentInterviewCard
                            company="Amazon"
                            interviewType="Technical Interview"
                            score="92%"
                            status="Completed"
                        />

                        <RecentInterviewCard
                            company="Google"
                            interviewType="DSA Round"
                            score="88%"
                            status="Completed"
                        />

                        <RecentInterviewCard
                            company="TCS"
                            interviewType="HR Interview"
                            score="95%"
                            status="Completed"
                        />

                        <RecentInterviewCard
                            company="Infosys"
                            interviewType="Java Interview"
                            score="85%"
                            status="Completed"
                        />

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;