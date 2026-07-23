import { useLocation, useNavigate } from "react-router-dom";

function ResumeAnalysis() {

    const location = useLocation();
    const navigate = useNavigate();

    console.log("Location State:", location.state);

    const analysis = location.state?.analysis;

    console.log("Analysis:", analysis);

    if (!analysis) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <div className="text-center">

                    <h1 className="text-4xl font-bold">

                        No Analysis Found

                    </h1>

                    <button
                        onClick={() => navigate("/resume/history")}
                        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg"
                    >
                        Back
                    </button>

                </div>

            </div>

        );

    }

    const data = analysis;
    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-6xl mx-auto py-10 px-6">

                <h1 className="text-4xl font-bold mb-8">

                    🤖 AI Resume Analysis

                </h1>

                {/* Overall Score */}

                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">

                    <h2 className="text-2xl font-bold text-gray-700">

                        Overall Score

                    </h2>

                    <h1 className="text-7xl font-bold text-blue-600 mt-4">

                        {data.overallScore}%

                    </h1>

                </div>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* Strengths */}

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold text-green-600 mb-4">

                            💪 Strengths

                        </h2>

                        <ul className="list-disc pl-6 space-y-2">

                            {data.strengths.map((item, index) => (

                                <li key={index}>{item}</li>

                            ))}

                        </ul>

                    </div>

                    {/* Weaknesses */}

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold text-red-600 mb-4">

                            ⚠ Weaknesses

                        </h2>

                        <ul className="list-disc pl-6 space-y-2">

                            {data.weaknesses.map((item, index) => (

                                <li key={index}>{item}</li>

                            ))}

                        </ul>

                    </div>

                    {/* Missing Skills */}

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold text-orange-600 mb-4">

                            📚 Missing Skills

                        </h2>

                        <ul className="list-disc pl-6 space-y-2">

                            {data.missingSkills.map((item, index) => (

                                <li key={index}>{item}</li>

                            ))}

                        </ul>

                    </div>

                    {/* Suggestions */}

                    <div className="bg-white rounded-xl shadow-lg p-6">

                        <h2 className="text-2xl font-bold text-blue-600 mb-4">

                            🚀 Suggestions

                        </h2>

                        <ul className="list-disc pl-6 space-y-2">

                            {data.suggestions.map((item, index) => (

                                <li key={index}>{item}</li>

                            ))}

                        </ul>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ResumeAnalysis;