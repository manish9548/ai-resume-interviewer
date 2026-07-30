import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

function VoiceInterview() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [transcript, setTranscript] = useState("");
    const [listening, setListening] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadQuestions();
    }, []);

    useEffect(() => {

        if (questions.length > 0) {

            speakQuestion(questions[currentQuestion].question);

        }

    }, [questions, currentQuestion]);

    const loadQuestions = async () => {

        try {

            const response = await api.get(
                `/interview/${id}/questions`
            );

            setQuestions(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const speakQuestion = (text) => {

        if (!text) return;

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;

        speech.onend = () => {

            setTimeout(() => {

                startListening();

            }, 800);

        };

        window.speechSynthesis.speak(speech);

    };

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            alert("Speech Recognition is not supported.");

            return;

        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        setListening(true);

        recognition.start();

        recognition.onresult = async (event) => {

            recognition.stop();

            const text = event.results[0][0].transcript;

            console.log("Speech:", text);

            setTranscript(text);

            await submitAnswer(text);

        };

        recognition.onerror = (event) => {

            console.log("Speech Error:", event.error);

            setListening(false);

        };

        recognition.onend = () => {

            setListening(false);

        };

    };

    const submitAnswer = async (answerText) => {

        if (!answerText.trim()) return;

        setProcessing(true);

        try {

            const questionId = questions[currentQuestion].id;

            await api.post(
                `/interview/question/${questionId}/answer`,
                {
                    answer: answerText
                }
            );

            if (currentQuestion < questions.length - 1) {

                setTranscript("");

                setCurrentQuestion(prev => prev + 1);

            } else {

                await api.post(`/interview/${id}/finish`);

                navigate(`/result/${id}`);

            }

        } catch (error) {

            console.log(error);

            alert("Failed to submit answer.");

        } finally {

            setProcessing(false);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center">

            <div className="bg-white shadow-xl rounded-xl w-full max-w-5xl p-10">

                <h1 className="text-4xl font-bold mb-8">

                    🎤 AI Voice Interview

                </h1>

                {

                    questions.length > 0 && (

                        <>

                            <div className="flex justify-between mb-4">

                                <h2 className="text-xl font-bold">

                                    Question {currentQuestion + 1} / {questions.length}

                                </h2>

                                <span>

                                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}%

                                </span>

                            </div>

                            <div className="w-full bg-gray-300 rounded-full h-3">

                                <div

                                    className="bg-blue-600 h-3 rounded-full"

                                    style={{

                                        width: `${((currentQuestion + 1) / questions.length) * 100}%`

                                    }}

                                />

                            </div>

                            <div className="bg-blue-50 rounded-xl p-8 mt-8">

                                <p className="text-2xl font-semibold">

                                    {questions[currentQuestion].question}

                                </p>

                            </div>

                        </>

                    )

                }

                <div className="mt-10">

                    <h3 className="text-xl font-bold">

                        Your Speech

                    </h3>

                    <div className="bg-gray-100 rounded-xl p-6 mt-4 min-h-[140px]">

                        {

                            processing
                                ? "⏳ Processing your answer..."
                                : listening
                                ? "🎤 Listening..."
                                : transcript || "Waiting for your answer..."

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default VoiceInterview;