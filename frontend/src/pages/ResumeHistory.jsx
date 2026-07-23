import { useEffect, useState } from "react";
import { analyzeResume, getResumeHistory } from "../services/resumeService";
import ResumeHistoryCard from "../components/ResumeHistoryCard";

function ResumeHistory() {

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

        } finally {

            setLoading(false);

        }

    };

    const handleAnalyze = async () => {

        try {

            const response = await analyzeResume();

            alert(response);

        } catch (error) {

            console.log(error);

            alert("Analysis Failed");

        }

    };

    if (loading) {

        return (

            <h1 className="text-center text-3xl mt-20">

                Loading...

            </h1>

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

                            <div className="bg-white rounded-xl p-10 text-center">

                                <h2 className="text-2xl font-bold">

                                    No Resume Uploaded Yet

                                </h2>

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