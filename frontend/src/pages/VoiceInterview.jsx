import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosConfig";

function VoiceInterview() {

    const { id } = useParams();

    const navigate = useNavigate();

    const recognitionRef = useRef(null);

    const countdownRef = useRef(null);

    const silenceTimerRef = useRef(null);

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [transcript, setTranscript] = useState("");

    const [listening, setListening] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {

        loadQuestions();

        return () => {

            window.speechSynthesis.cancel();

            if (recognitionRef.current) {

                recognitionRef.current.stop();

            }

            clearInterval(countdownRef.current);

            clearTimeout(silenceTimerRef.current);

        };

    }, []);

    

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
    useEffect(() => {

    if (questions.length > 0) {

        speakQuestion(
            questions[currentQuestion].question
        );

    }

}, [questions, currentQuestion]);

    const startCountdown = () => {

    setTimeLeft(30);

    clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {

        setTimeLeft((prev) => {

            if (prev <= 1) {

                clearInterval(countdownRef.current);

                handleTimeUp();

                return 0;

            }

            return prev - 1;

        });

    }, 1000);

};

    const speakQuestion = (text) => {

        if (!text) return;

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);

        speech.lang = "en-IN";

        speech.rate = 1;

        speech.pitch = 1;

        speech.onend = () => {

    let count = 3;

    const countdown = setInterval(() => {

        if (count === 0) {

            clearInterval(countdown);

            startListening();

            startCountdown();

        } else {

            setTranscript(`🎤 Starting in ${count}...`);

            count--;

        }

    }, 1000);

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

        if (recognitionRef.current) {

            recognitionRef.current.stop();

        }

        recognitionRef.current = new SpeechRecognition();

        const recognition = recognitionRef.current;

        recognition.lang = "en-IN";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;

        recognition.continuous = false;

        setListening(true);

        recognition.start();

        recognition.onresult = async (event) => {

            clearInterval(countdownRef.current);

            const text = event.results[0][0].transcript;

            console.log("Recognized:", text);

            setTranscript(text);

            recognition.stop();

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

    const handleTimeUp = async () => {

        if (processing) return;

        if (recognitionRef.current) {

            recognitionRef.current.stop();

        }

        window.speechSynthesis.cancel();

        await submitAnswer(transcript);

    };

    const submitAnswer = async (answerText) => {

        if (!answerText.trim()) {

            return;

        }

        setProcessing(true);

        try {

            const questionId =
                questions[currentQuestion].id;

            await api.post(

                `/interview/question/${questionId}/answer`,

                {

                    answer: answerText

                }

            );

            setTranscript("");

            if (currentQuestion < questions.length - 1) {

                setCurrentQuestion(prev => prev + 1);

            } else {

                await api.post(
                    `/interview/${id}/finish`
                );

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

                            <div className="flex justify-between items-center mb-4">

                                <h2 className="text-xl font-bold">

                                    Question {currentQuestion + 1} / {questions.length}

                                </h2>

                                <span className="text-red-600 font-bold text-xl">

                                    ⏱ {timeLeft}s

                                </span>

                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-8">

                                <div

                                    className="bg-red-500 h-3 rounded-full transition-all duration-1000"

                                    style={{

                                        width: `${(timeLeft / 30) * 100}%`

                                    }}

                                />

                            </div>

                            <div className="bg-blue-50 rounded-xl p-8">

                                <p className="text-2xl font-semibold">

                                    {questions[currentQuestion].question}

                                </p>

                            </div>

                        </>

                    )

                }

                <div className="mt-10">

                    <h3 className="text-xl font-bold">

                        🎙 Your Speech

                    </h3>

                    <div className="bg-gray-100 rounded-xl p-6 mt-4 min-h-[140px] flex items-center">

                        {

                            processing

                                ?

                                "⏳ Processing your answer..."

                                :

                                listening

                                    ?

                                    "🎤 Listening..."

                                    :

                                    transcript || "Waiting for your answer..."

                        }

                    </div>

                </div>

            </div>

        </div>

    );

}

export default VoiceInterview;