import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

function Interview() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {

        try {

            const res = await api.get(`/interview/${id}/questions`);

            setQuestions(res.data);

        } catch (e) {

            console.log(e);

            alert("Failed to load interview.");

        } finally {

            setLoading(false);

        }

    };

    const submitAnswer = async () => {

        if (answer.trim() === "") {

            alert("Please write your answer.");

            return;

        }

        setSubmitting(true);

        try {

            await api.post(
                `/interview/question/${questions[current].id}/answer`,
                {
                    answer
                }
            );

            if (current < questions.length - 1) {

                setCurrent(current + 1);

                setAnswer("");

            } else {

                await api.post(`/interview/${id}/finish`);

                navigate(`/result/${id}`);

            }

        } catch (e) {

            console.log(e);

            alert("Failed to submit answer.");

        }

        setSubmitting(false);

    };

    const skipQuestion = async () => {

        try {

            await api.post(
                `/interview/question/${questions[current].id}/skip`
            );

            if (current < questions.length - 1) {

                setCurrent(current + 1);

                setAnswer("");

            } else {

                await api.post(`/interview/${id}/finish`);

                navigate(`/result/${id}`);

            }

        } catch (e) {

            console.log(e);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h1 className="text-3xl font-bold">

                    Loading Interview...

                </h1>

            </div>

        );

    }

    const q = questions[current];

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-5xl mx-auto py-10">

                <div className="bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-4xl font-bold mb-6">

                        AI Interview

                    </h1>

                    <p className="text-gray-500 mb-6">

                        Question {current + 1} / {questions.length}

                    </p>

                    <div className="bg-blue-50 p-6 rounded-lg">

                        <h2 className="text-2xl font-semibold">

                            {q.question}

                        </h2>

                    </div>

                    <textarea

                        rows="8"

                        value={answer}

                        onChange={(e)=>setAnswer(e.target.value)}

                        className="w-full mt-8 border rounded-lg p-4"

                        placeholder="Write your answer here..."

                    />

                    <div className="flex justify-between mt-8">

                        <button

                            onClick={skipQuestion}

                            className="bg-red-500 text-white px-6 py-3 rounded-lg"

                        >

                            Skip

                        </button>

                        <button

                            disabled={submitting}

                            onClick={submitAnswer}

                            className="bg-blue-600 text-white px-8 py-3 rounded-lg"

                        >

                            {

                                submitting

                                    ?

                                    "Submitting..."

                                    :

                                    current === questions.length - 1

                                        ?

                                        "Finish Interview"

                                        :

                                        "Next"

                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Interview;