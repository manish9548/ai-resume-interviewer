import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

function Result() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReport();

    }, []);

    const loadReport = async () => {

        try {

            const response = await api.get(`/interview/${id}/report`);

            setReport(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load report.");

        } finally {

            setLoading(false);

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

            <div className="max-w-6xl mx-auto py-10">

                <h1 className="text-4xl font-bold mb-8">

                    🎉 Interview Result
                </h1>

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

                <div className="bg-white rounded-xl shadow mt-10 p-8">

                    <h2 className="text-3xl font-bold mb-6">

                        Questions Review

                    </h2>

                    {

                        report.questions.map((q) => (

                            <div
                                key={q.questionNumber}
                                className="border-b py-6"
                            >

                                <h3 className="font-bold text-xl">

                                    Q{q.questionNumber}. {q.question}

                                </h3>

                                <p className="mt-3">

                                    <strong>Your Answer:</strong>

                                </p>

                                <p className="text-gray-700">

                                    {q.answer}

                                </p>

                                <p className="mt-3">

                                    <strong>Score:</strong>

                                    {" "}
                                    {q.score}/10

                                </p>

                                <p className="mt-3">

                                    <strong>Feedback:</strong>

                                </p>

                                <p>

                                    {q.feedback}

                                </p>

                                <p className="mt-3">

                                    <strong>Ideal Answer:</strong>

                                </p>

                                <p>

                                    {q.idealAnswer}

                                </p>

                            </div>

                        ))

                    }

                </div>

                <div className="flex gap-4 mt-8">

                    <button

                        onClick={() =>
                            navigate("/dashboard")
                        }

                        className="bg-blue-600 text-white px-8 py-3 rounded-lg"

                    >

                        Dashboard

                    </button>

                </div>

            </div>

        </div>

    );

}

export default Result;