import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInterviewHistory } from "../services/interviewService";
import InterviewHistoryCard from "../components/InterviewHistoryCard";

function InterviewHistory() {

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {

        try {

            const data = await getInterviewHistory();

            setInterviews(data);

        } catch (error) {

            console.log(error);

            alert("Failed to load interview history.");

        } finally {

            setLoading(false);

        }

    };

    const handleViewResult = (id) => {

        navigate(`/result/${id}`);

    };

    const handleGapAnalysis = (id) => {

        navigate(`/resume-gap-analysis/${id}`);

    };

    const handleRoadmap = (id) => {

        navigate(`/roadmap/${id}`);

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h1 className="text-3xl font-bold">
                    Loading...
                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-7xl mx-auto py-10 px-6">

                <h1 className="text-4xl font-bold mb-8">

                    📋 Interview History

                </h1>

                {

                    interviews.length === 0 ?

                        (

                            <div className="bg-white rounded-xl shadow p-10 text-center">

                                <h2 className="text-3xl font-bold">

                                    No Interviews Yet

                                </h2>

                                <p className="text-gray-500 mt-3">

                                    Start your first AI Interview.

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="grid md:grid-cols-2 gap-6">

                                {

                                    interviews.map((interview) => (

                                        <InterviewHistoryCard

                                            key={interview.interviewId}

                                            interview={interview}

                                            onViewResult={handleViewResult}

                                            onGapAnalysis={handleGapAnalysis}

                                            onRoadmap={handleRoadmap}

                                        />

                                    ))

                                }

                            </div>

                        )

                }

            </div>

        </div>

    );

}

export default InterviewHistory;