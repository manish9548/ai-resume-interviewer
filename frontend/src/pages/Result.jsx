import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import { downloadPdfReport } from "../services/interviewService";

function Result() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [overallFeedback, setOverallFeedback] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = async () => {

        try {

            const reportResponse = await api.get(`/interview/${id}/report`);
            setReport(reportResponse.data);

            const feedbackResponse = await api.get(
                `/interview/${id}/overall-feedback`
            );
            setOverallFeedback(feedbackResponse.data);

        } catch (error) {

            console.log(error);
            alert("Failed to load report.");

        } finally {

            setLoading(false);

        }

    };
    const handleDownloadPdf = async () => {

    try {

        const pdf = await downloadPdfReport(id);

        const url = window.URL.createObjectURL(pdf);

        const link = document.createElement("a");

        link.href = url;

        link.download = "Interview_Report.pdf";

        link.click();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.log(error);

        alert("Failed to download report.");

    }

};

    if (loading) {

        return (
            <div className="min-h-screen flex justify-center items-center">
                <h1 className="text-3xl font-bold">
                    Loading Result...
                </h1>
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-6xl mx-auto py-10 px-6">

                <h1 className="text-4xl font-bold mb-8">
                    🎉 Interview Result
                </h1>

                {/* Top Cards */}

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white rounded-xl shadow p-6 text-center">

                        <h3 className="text-xl font-semibold">
                            Total Score
                        </h3>

                        <h1 className="text-6xl font-bold text-blue-600 mt-4">
                            {report.totalScore}
                        </h1>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6 text-center">

                        <h3 className="text-xl font-semibold">
                            Percentage
                        </h3>

                        <h1 className="text-6xl font-bold text-green-600 mt-4">
                            {report.percentage.toFixed(1)}%
                        </h1>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6 text-center">

                        <h3 className="text-xl font-semibold">
                            Status
                        </h3>

                        <h1 className="text-3xl font-bold text-purple-600 mt-8">
                            {report.status}
                        </h1>

                    </div>

                </div>

                {/* Overall AI Feedback */}

                {
                    overallFeedback && (

                        <div className="bg-white rounded-xl shadow mt-10 p-8">

                            <h2 className="text-3xl font-bold mb-8">
                                🤖 Overall AI Feedback
                            </h2>

                            <div className="mb-6">

                                <h3 className="text-xl font-bold text-blue-600">
                                    Overall Rating
                                </h3>

                                <p className="mt-2 text-lg">
                                    {overallFeedback.overallRating}
                                </p>

                            </div>

                            <div className="mb-6">

                                <h3 className="text-xl font-bold text-green-600">
                                    Summary
                                </h3>

                                <p className="mt-2">
                                    {overallFeedback.summary}
                                </p>

                            </div>

                            <div className="grid md:grid-cols-3 gap-8">

                                <div>

                                    <h3 className="text-xl font-bold text-purple-600 mb-3">
                                        💪 Strengths
                                    </h3>

                                    <ul className="list-disc pl-5 space-y-2">

                                        {
                                            overallFeedback.strengths.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))
                                        }

                                    </ul>

                                </div>

                                <div>

                                    <h3 className="text-xl font-bold text-red-600 mb-3">
                                        ⚠ Weaknesses
                                    </h3>

                                    <ul className="list-disc pl-5 space-y-2">

                                        {
                                            overallFeedback.weaknesses.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))
                                        }

                                    </ul>

                                </div>

                                <div>

                                    <h3 className="text-xl font-bold text-orange-600 mb-3">
                                        🚀 Suggestions
                                    </h3>

                                    <ul className="list-disc pl-5 space-y-2">

                                        {
                                            overallFeedback.suggestions.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))
                                        }

                                    </ul>

                                </div>

                            </div>

                        </div>

                    )
                }

                {/* Question Review */}

                <div className="bg-white rounded-xl shadow mt-10 p-8">

                    <h2 className="text-3xl font-bold mb-8">
                        Questions Review
                    </h2>

                    {

                        report.questions.map((q) => (

                            <div
                                key={q.questionNumber}
                                className="border-b last:border-b-0 py-6"
                            >

                                <h3 className="text-xl font-bold">

                                    Q{q.questionNumber}. {q.question}

                                </h3>

                                <div className="mt-4">

                                    <strong>Your Answer:</strong>

                                    <p className="text-gray-700 mt-2">
                                        {q.answer || "Not Answered"}
                                    </p>

                                </div>

                                <div className="mt-4">

                                    <strong>
                                        Score:
                                    </strong>

                                    {" "}
                                    <span className="text-blue-600 font-bold">
                                        {q.score ?? 0}/10
                                    </span>

                                </div>

                                <div className="mt-4">

                                    <strong>
                                        Feedback:
                                    </strong>

                                    <p className="mt-2">
                                        {q.feedback}
                                    </p>

                                </div>

                                <div className="mt-4">

                                    <strong>
                                        Ideal Answer:
                                    </strong>

                                    <p className="mt-2 whitespace-pre-wrap">
                                        {q.idealAnswer}
                                    </p>

                                </div>

                            </div>

                        ))

                    }

                </div>

                <div className="flex gap-4 mt-8">

                    <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg"
    >
        Dashboard
    </button>

    <button
        onClick={handleDownloadPdf}
        className="bg-red-600 text-white px-8 py-3 rounded-lg"
    >
        Download PDF
    </button>
                    <button
                        onClick={() => navigate(`/interview/${id}/roadmap`)}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700"
                    >
                        📚 Learning Roadmap
                    </button>
                    <button

                        onClick={() =>
                            navigate(`/interview/${id}/resume-gap-analysis`)
                        }

                        className="bg-green-600 text-white px-8 py-3 rounded-lg"

                    >

                        Resume Gap Analysis

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Result;