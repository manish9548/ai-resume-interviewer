import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosConfig";

const ANSWER_TIME = 30;
const SILENCE_TIME = 10000;
const ARE_YOU_THERE_TIME = 5000;

function VoiceInterview() {

    const { id } = useParams();

    const navigate = useNavigate();

    // ==========================
    // Refs
    // ==========================

    const recognitionRef = useRef(null);

    const transcriptRef = useRef("");

    const timerRef = useRef(null);

    const silenceRef = useRef(null);

    const countdownRef = useRef(null);

    const isSubmittingRef = useRef(false);

    // ==========================
    // States
    // ==========================

    const [questions, setQuestions] = useState([]);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const [transcript, setTranscript] = useState("");

    const [timeLeft, setTimeLeft] = useState(ANSWER_TIME);

    const [listening, setListening] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [aiSpeaking, setAiSpeaking] = useState(false);

    const [status, setStatus] = useState("Loading Interview...");

    // ==========================
    // Initial Load
    // ==========================

    useEffect(() => {

        loadQuestions();

        return () => {

            cleanup();

        };

    }, []);
    useEffect(() => {

    const handler = (e) => {

        e.preventDefault();

        e.returnValue = "";

    };

    window.addEventListener("beforeunload", handler);

    return () => {

        window.removeEventListener("beforeunload", handler);

    };

}, []);

    // ==========================
    // Speak whenever question changes
    // ==========================

    useEffect(() => {

        if (questions.length === 0) return;

        resetInterviewState();

        speakQuestion(
            questions[currentQuestion].question
        );

    }, [questions, currentQuestion]);

    // ==========================
    // Load Questions
    // ==========================

    const loadQuestions = async () => {

        try {

            const response = await api.get(
                `/interview/${id}/questions`
            );

            setQuestions(response.data);

        }

        catch (error) {

            console.log(error);

            alert("Unable to load questions.");

        }

    };

    // ==========================
    // Reset State For New Question
    // ==========================

    const resetInterviewState = () => {

        transcriptRef.current = "";

        setTranscript("");

        setTimeLeft(ANSWER_TIME);

        setListening(false);

        setProcessing(false);

        setStatus("AI is preparing question...");

        clearInterval(timerRef.current);

        clearTimeout(silenceRef.current);

        clearInterval(countdownRef.current);

    };

    // ==========================
    // Cleanup
    // ==========================

    const cleanup = () => {

        window.speechSynthesis.cancel();

        if (recognitionRef.current) {

            recognitionRef.current.stop();

        }

        clearInterval(timerRef.current);

        clearInterval(countdownRef.current);

        clearTimeout(silenceRef.current);

    };
    // ==========================
// AI SPEAK QUESTION
// ==========================

const speakQuestion = (text) => {

    if (!text) return;

    cleanupRecognition();

    window.speechSynthesis.cancel();

    setAiSpeaking(true);

    setStatus("🤖 AI is asking question...");

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-IN";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speech.onend = () => {

        setAiSpeaking(false);

        startCountdown();

    };

    window.speechSynthesis.speak(speech);

};

// ==========================
// COUNTDOWN
// ==========================

const startCountdown = () => {

    let count = 3;

    setStatus(`🎤 Starting in ${count}...`);

    countdownRef.current = setInterval(() => {

        count--;

        if (count > 0) {

            setStatus(`🎤 Starting in ${count}...`);

        }

        else {

            clearInterval(countdownRef.current);

            void startListening();

        }

    }, 1000);

};

// ==========================
// START TIMER
// ==========================

const startTimer = () => {

    setTimeLeft(ANSWER_TIME);

    timerRef.current = setInterval(() => {

        setTimeLeft(prev => {

            if (prev <= 1) {

                clearInterval(timerRef.current);

                handleTimeUp();

                return 0;

            }

            return prev - 1;

        });

    }, 1000);

};

// ==========================
// START LISTENING
// ==========================

const startListening = async () => {

    try {

        await navigator.mediaDevices.getUserMedia({
            audio: true
        });

    } catch (error) {

        alert("Microphone permission denied.");

        return;

    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Speech Recognition not supported.");

        return;

    }

    cleanupRecognition();

    recognitionRef.current = new SpeechRecognition();

    const recognition = recognitionRef.current;

    recognition.lang = "en-IN";

    recognition.interimResults = true;

    recognition.continuous = true;

    recognition.maxAlternatives = 1;

    transcriptRef.current = "";

    setTranscript("");

    setListening(true);

    setStatus("🎤 Listening...");

    recognition.start();

    startTimer();

    resetSilenceTimer();

    recognition.onresult = (event) => {

        let text = "";

        for (let i = 0; i < event.results.length; i++) {

            text += event.results[i][0].transcript + " ";

        }

        text = text.trim();

        transcriptRef.current = text;

        setTranscript(text);

        resetSilenceTimer();

        // Voice Commands

        const lower = text.toLowerCase();

        if (lower.includes("repeat question")) {

            speakQuestion(
                questions[currentQuestion].question
            );

            return;

        }

        if (lower.includes("skip question")) {

            autoSkip();

            return;

        }

        if (lower.includes("stop interview")) {

            recognition.stop();

            navigate("/dashboard");

            return;

        }

    };

    recognition.onerror = (event) => {

        console.log("Speech Error:", event.error);

        setListening(false);

        if (processing) return;

        switch (event.error) {

            case "no-speech":

                setStatus("🤔 I didn't hear anything. Please speak again...");

                setTimeout(() => {

                    if (!processing) {

                        void startListening();

                    }

                }, 1500);

                break;

            case "network":

                setStatus("🌐 Network issue. Retrying...");

                setTimeout(() => {

                    if (!processing) {

                        void startListening();

                    }

                }, 2000);

                break;

            case "audio-capture":

                alert("No microphone detected.");

                break;

            case "not-allowed":

                alert("Microphone permission denied.");

                break;

            default:

                console.log(event.error);

        }

    };

    recognition.onend = () => {

        setListening(false);

        if (!processing && timeLeft > 0) {

            setTimeout(() => {

                void startListening();

            }, 500);

        }

    };

};

// ==========================
// CLEAN RECOGNITION
// ==========================

const cleanupRecognition = () => {

    if (recognitionRef.current) {

        recognitionRef.current.onresult = null;

        recognitionRef.current.onerror = null;

        recognitionRef.current.onend = null;

        recognitionRef.current.stop();

        recognitionRef.current = null;

    }

};
// ==========================
// RESET SILENCE TIMER
// ==========================

const resetSilenceTimer = () => {

    clearTimeout(silenceRef.current);

    silenceRef.current = setTimeout(() => {

        askAreYouThere();

    }, SILENCE_TIME);

};

// ==========================
// ARE YOU THERE
// ==========================

const askAreYouThere = () => {

    if (processing) return;

    cleanupRecognition();

    window.speechSynthesis.cancel();

    setListening(false);

    setStatus("🤖 Are you there?");

    const speech = new SpeechSynthesisUtterance(
        "Are you there?"
    );

    speech.lang = "en-IN";

    speech.onend = () => {

        silenceRef.current = setTimeout(() => {

            autoSkip();

        }, ARE_YOU_THERE_TIME);

    };

    window.speechSynthesis.speak(speech);

};

// ==========================
// AUTO SKIP
// ==========================

const autoSkip = async () => {

    if (processing) return;

    setStatus("⏭ Question Skipped");

    await submitAnswer("");

};

// ==========================
// TIMER FINISHED
// ==========================

const handleTimeUp = async () => {

    if (processing) return;

    cleanupRecognition();

    clearInterval(timerRef.current);

    clearTimeout(silenceRef.current);

    setListening(false);

    setStatus("⏳ Time Up");

    await submitAnswer(
        transcriptRef.current
    );

};

// ==========================
// SUBMIT ANSWER
// ==========================

const submitAnswer = async (answerText) => {

    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    setProcessing(true);

    cleanupRecognition();

    clearInterval(timerRef.current);

    clearTimeout(silenceRef.current);

    try {

        const questionId =
            questions[currentQuestion].id;

        await api.post(

            `/interview/question/${questionId}/answer`,

            {

                answer: answerText

            }

        );

        transcriptRef.current = "";

        setTranscript("");

        if (currentQuestion < questions.length - 1) {

            setCurrentQuestion(prev => prev + 1);

        }

        else {

            setStatus("Generating Result...");

            await api.post(
                `/interview/${id}/finish`
            );

            navigate(`/result/${id}`);

        }

    }

    catch (error) {

        console.log(error);

        alert("Failed to submit answer.");

    }

    finally {

        isSubmittingRef.current = false;

        setProcessing(false);

    }

};
return (

<div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 flex justify-center items-center p-8">

<div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-10">

{/* Header */}

<div className="flex justify-between items-center">

<div>

<h1 className="text-4xl font-bold">

🎤 AI Voice Interview

</h1>

<p className="text-gray-500 mt-2">

Company Interview Simulation

</p>

</div>

<div className="text-right">

<div className="text-sm text-gray-500">

Question

</div>

<div className="text-2xl font-bold">

{currentQuestion + 1} / {questions.length}

</div>

</div>

</div>

<hr className="my-8"/>

{/* Progress */}

<div className="mb-8">

<div className="flex justify-between">

<span>Progress</span>

<span>

{Math.round(

((currentQuestion+1)/questions.length)*100

)}%

</span>

</div>

<div className="w-full bg-gray-200 rounded-full h-4 mt-3">

<div

className="bg-blue-600 h-4 rounded-full transition-all duration-700"

style={{

width:

`${((currentQuestion+1)/questions.length)*100}%`

}}

>

</div>

</div>

</div>

{/* Timer */}

<div className="flex justify-center mb-8">

<div className="bg-red-100 px-8 py-3 rounded-full shadow">

<h2 className="text-3xl font-bold text-red-600">

⏱ {timeLeft}s

</h2>

</div>

</div>

{/* AI Question */}

{

questions.length>0 &&

<div className="bg-blue-50 border-l-8 border-blue-600 rounded-xl p-8">

<h2 className="text-blue-700 font-bold text-lg">

🤖 AI Question

</h2>

<p className="text-2xl font-semibold mt-3">

{questions[currentQuestion].question}

</p>

</div>

}

{/* AI Status */}

<div className="mt-8">

<div className="bg-yellow-50 rounded-xl p-5">

<h3 className="font-bold">

AI Status

</h3>

<p className="mt-2 text-xl">

{status}

</p>

</div>

</div>

{/* Listening */}

<div className="mt-8">

<div className="bg-green-50 rounded-xl p-6">

<h3 className="font-bold">

🎙 Your Answer

</h3>

<div className="mt-4 min-h-[120px]">

{

processing

?

<p className="text-orange-600 font-bold">

⏳ Processing...

</p>

:

listening

?

<p className="text-green-600 font-bold animate-pulse">

🎤 Listening...

</p>

:

<p className="text-gray-500">

Waiting...

</p>

}

<p className="mt-4 text-xl">

{

transcript ||

"Start speaking..."

}

</p>

</div>

</div>

</div>

{/* Bottom */}

<div className="grid grid-cols-3 gap-5 mt-10">

<div className="bg-blue-100 rounded-xl p-5">

<h2 className="font-bold">

AI

</h2>

<p>

{

aiSpeaking

?

"🗣 Speaking"

:

"Idle"

}

</p>

</div>

<div className="bg-green-100 rounded-xl p-5">

<h2 className="font-bold">

Mic

</h2>

<p>

{

listening

?

"🎤 ON"

:

"OFF"

}

</p>

</div>

<div className="bg-orange-100 rounded-xl p-5">

<h2 className="font-bold">

Evaluation

</h2>

<p>

{

processing

?

"Running"

:

"Waiting"

}

</p>

</div>

</div>

</div>

</div>

);
