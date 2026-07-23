import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    analyzeResume,
    getResumeHistory,
} from "../services/resumeService";
import ResumeHistoryCard from "../components/ResumeHistoryCard";

function ResumeHistory() {

    const navigate = useNavigate();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {

        try {

            const data = await getResumeHistory();

            setResumes(data);

        } catch (error) {

            console.log(error);

            alert("Failed to load resume history.");

        } finally {

            setLoading(false);

        }

    };

    const handleAnalyze = async () => {

    try {

        const analysis = await analyzeResume();

        console.log("Analysis Data:", analysis);
        console.log("Type:", typeof analysis);

        navigate("/resume/analysis", {
            state: {
                analysis,
            },
        });

    } catch (error) {

        console.log(error);

        alert("Resume Analysis Failed");

    }

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

            <div className="max-w-6xl mx-auto py-10 px-6">

                <h1 className="text-4xl font-bold mb-8">

                    📄 Resume History

                </h1>

                {

                    resumes.length === 0 ?

                        (

                            <div className="bg-white rounded-xl shadow p-10 text-center">

                                <h2 className="text-3xl font-bold">

                                    No Resume Uploaded Yet

                                </h2>

                                <p className="text-gray-500 mt-3">

                                    Upload your first resume to start AI analysis.

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="grid md:grid-cols-2 gap-6">

                                {

                                    resumes.map((resume) => (

                                        <ResumeHistoryCard

                                            key={resume.id}

                                            fileName={resume.fileName}

                                            uploadedAt={resume.uploadedAt}

                                            onAnalyze={handleAnalyze}

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

export default ResumeHistory;