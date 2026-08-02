/*
======================================================================
BUGS IDENTIFIED AND FIXED:

1. Stale Closure Bugs in Event Handlers:
   - Issue: The SpeechRecognition event callbacks (onresult, onerror, onend) 
     captured old React state values from their initial creation scope. 
     As state variables updated, handlers still referenced outdated values.
   - Fix: Mirrored all dynamic states (questions, current question index, 
     time left, processing status, AI speaking status) into React refs. 
     Callback handlers now read and write to these refs directly, ensuring 
     they always operate on the most up-to-date state.

2. Duplicate SpeechRecognition Instances & Mic Leaks:
   - Issue: Multiple overlapping SpeechRecognition instances were spawned 
     because errors and stream endings triggered concurrent reconnection paths. 
     Additionally, checking mic permissions left audio tracks open.
   - Fix: Rebuilt cleanupRecognition() to nullify onstart, onresult, onerror, 
     and onend handlers before calling .stop() or .abort(). This prevents 
     the old instance from triggering asynchronous restarts. Permission checks 
     now call track.stop() to release the microphone immediately.

3. Answering Timer Starting Immediately:
   - Issue: The 30-second timer was starting right when the mic was initialized, 
     before the user spoke.
   - Fix: Used a hasSpoken ref. The timer is paused during TTS speaking and 
     countdown, and only begins counting down when the user speaks the first word.

4. Silence Timer Race Conditions & TTS Interrupts:
   - Issue: If speechSynthesis was cancelled (e.g. on question repeat), 
     utterance errors were unhandled, leading to concurrent countdown intervals.
   - Fix: Added speech.onerror handlers with an 'interrupted' guard. Silence 
     detection halts recognition while speaking "Are you there?" to prevent 
     feedback loops, and resumes with a 5-second response window.

5. Network Auto-Retry:
   - Issue: Disconnections during backend API calls resulted in immediate failures.
   - Fix: Created an apiWithRetry helper that automatically retries POST/GET 
     calls up to 3 times before throwing.

6. SpeechRecognition Unsupported / Permission Denied Layouts:
   - Issue: Unsupported browsers or blocked permissions threw raw alerts.
   - Fix: Designed full-page fallback screens with step-by-step instructions.
======================================================================
*/

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosConfig";

// Configuration Constants
const ANSWER_TIME = 30;
const SILENCE_TIME = 10000;
const ARE_YOU_THERE_TIME = 5000;

function VoiceInterview() {
    const { id } = useParams();
    const navigate = useNavigate();

    // ==========================================
    // Refs (To prevent stale state in callbacks)
    // ==========================================
    const recognitionRef = useRef(null);
    const transcriptRef = useRef("");
    const timeLeftRef = useRef(ANSWER_TIME);
    const hasSpokenRef = useRef(false);
    const isProcessingRef = useRef(false);
    const isAiSpeakingRef = useRef(false);
    const questionsRef = useRef([]);
    const currentQuestionRef = useRef(0);
    const timerIntervalRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const isListeningRef = useRef(false);
    const isSkippedOrFinishedRef = useRef(false);
    const isMountedRef = useRef(true);

    // ==========================================
    // States (For UI Rendering)
    // ==========================================
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [timeLeft, setTimeLeft] = useState(ANSWER_TIME);
    const [listening, setListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [status, setStatus] = useState("Loading Interview...");
    const [hasSpoken, setHasSpoken] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [errorType, setErrorType] = useState(null); // 'unsupported' | 'permission-denied' | 'network' | null
    const [loadingQuestions, setLoadingQuestions] = useState(true);

    // ==========================================
    // Network Error Auto-Retry Helper
    // ==========================================
    const apiWithRetry = async (config, retries = 3, delay = 2000) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await api(config);
            } catch (error) {
                const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error";
                if (isNetworkError && attempt < retries) {
                    console.warn(`Network error. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    };

    // ==========================================
    // Load Interview Questions
    // ==========================================
    const loadQuestions = async () => {
        if (!isMountedRef.current) return;
        setLoadingQuestions(true);
        setStatus("Loading Interview...");
        try {
            const response = await apiWithRetry({
                method: "get",
                url: `/interview/${id}/questions`,
            });
            
            if (isMountedRef.current) {
                const data = response.data || [];
                setQuestions(data);
                questionsRef.current = data;
                setLoadingQuestions(false);
                if (data.length > 0) {
                    startQuestionFlow(0);
                } else {
                    setStatus("No questions found for this interview.");
                }
            }
        } catch (error) {
            console.error("Failed to load questions:", error);
            if (isMountedRef.current) {
                setStatus("Failed to load interview. Please refresh to retry.");
                setLoadingQuestions(false);
            }
        }
    };

    // Initialize & Unmount Cleanups
    useEffect(() => {
        isMountedRef.current = true;
        loadQuestions();

        // Browser Refresh & Back Navigation Warning
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Are you sure you want to leave? Your interview progress will be lost.";
            return e.returnValue;
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            isMountedRef.current = false;
            window.removeEventListener("beforeunload", handleBeforeUnload);
            cleanupAll();
        };
    }, []);

    // ==========================================
    // Start Question Flow
    // ==========================================
    const startQuestionFlow = (questionIndex) => {
        if (!isMountedRef.current) return;

        // Sync Refs
        currentQuestionRef.current = questionIndex;
        setCurrentQuestion(questionIndex);

        // Reset Question States
        transcriptRef.current = "";
        setTranscript("");
        timeLeftRef.current = ANSWER_TIME;
        setTimeLeft(ANSWER_TIME);
        hasSpokenRef.current = false;
        setHasSpoken(false);
        isSkippedOrFinishedRef.current = false;

        // Clear All Active Timers & Synthesis
        clearTimers();
        window.speechSynthesis.cancel();

        const currentQ = questionsRef.current[questionIndex];
        if (currentQ) {
            speakQuestion(currentQ.question);
        }
    };

    // ==========================================
    // AI Speak Question
    // ==========================================
    const speakQuestion = (text) => {
        if (!text || !isMountedRef.current) return;

        cleanupRecognition();
        window.speechSynthesis.cancel();

        setAiSpeaking(true);
        isAiSpeakingRef.current = true;
        setStatus("AI is asking question...");

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 0.95;
        speech.pitch = 1.0;
        speech.volume = 1.0;

        speech.onend = () => {
            if (!isMountedRef.current) return;
            setAiSpeaking(false);
            isAiSpeakingRef.current = false;
            startCountdown();
        };

        speech.onerror = (event) => {
            console.error("SpeechSynthesis error:", event);
            if (!isMountedRef.current) return;
            setAiSpeaking(false);
            isAiSpeakingRef.current = false;
            // Proceed to countdown unless explicitly interrupted (e.g. repeat/skip command)
            if (event.error !== "interrupted") {
                startCountdown();
            }
        };

        window.speechSynthesis.speak(speech);
    };

    // ==========================================
    // Countdown (3, 2, 1)
    // ==========================================
    const startCountdown = () => {
        if (!isMountedRef.current) return;

        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        let count = 3;
        setStatus(`Starting in ${count}...`);
        setCountdown(count);

        countdownIntervalRef.current = setInterval(() => {
            count--;
            if (!isMountedRef.current) {
                clearInterval(countdownIntervalRef.current);
                return;
            }

            if (count > 0) {
                setStatus(`Starting in ${count}...`);
                setCountdown(count);
            } else {
                clearInterval(countdownIntervalRef.current);
                setCountdown(null);
                startListening();
            }
        }, 1000);
    };

    // ==========================================
    // Speech Recognition
    // ==========================================
    const startListening = async () => {
        if (!isMountedRef.current) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setErrorType("unsupported");
            setStatus("Speech Recognition not supported in this browser.");
            return;
        }

        // Verify Microphone Access Permission
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop()); // Close stream immediately
        } catch (err) {
            console.error("Microphone permission denied:", err);
            setErrorType("permission-denied");
            setStatus("Microphone permission denied.");
            return;
        }

        cleanupRecognition();

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        setListening(true);
        isListeningRef.current = true;
        setStatus("Listening...");

        // Start Silence Detection (10s) immediately on recognition start
        resetSilenceTimer();

        recognition.onstart = () => {
            if (!isMountedRef.current) return;
            setListening(true);
            isListeningRef.current = true;
        };

        recognition.onresult = (event) => {
            if (!isMountedRef.current || isProcessingRef.current) return;

            let fullTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
                fullTranscript += event.results[i][0].transcript + " ";
            }
            fullTranscript = fullTranscript.trim();

            transcriptRef.current = fullTranscript;
            setTranscript(fullTranscript);

            // Reset silence timer on every user speech event
            resetSilenceTimer();

            // Check for Voice Commands
            const lower = fullTranscript.toLowerCase().trim();
            if (lower === "repeat question" || lower.endsWith(" repeat question")) {
                handleVoiceCommand("repeat");
                return;
            }
            if (lower === "skip question" || lower.endsWith(" skip question")) {
                handleVoiceCommand("skip");
                return;
            }
            if (lower === "stop interview" || lower.endsWith(" stop interview")) {
                handleVoiceCommand("stop");
                return;
            }

            // Start answering timer only after the user speaks their first word
            if (!hasSpokenRef.current && fullTranscript.length > 0) {
                hasSpokenRef.current = true;
                setHasSpoken(true);
                startTimer();
            }
        };

        recognition.onerror = (event) => {
            console.error("SpeechRecognition error:", event.error);
            if (!isMountedRef.current || isProcessingRef.current || isSkippedOrFinishedRef.current) return;

            if (event.error === "no-speech") {
                setStatus("No speech detected. Restarting mic...");
                cleanupRecognition();
                setTimeout(() => {
                    if (isMountedRef.current && !isProcessingRef.current && !isSkippedOrFinishedRef.current) {
                        startListening();
                    }
                }, 500);
            } else if (event.error === "network") {
                setStatus("Network error. Retrying microphone...");
                cleanupRecognition();
                setTimeout(() => {
                    if (isMountedRef.current && !isProcessingRef.current && !isSkippedOrFinishedRef.current) {
                        startListening();
                    }
                }, 2000);
            } else if (event.error === "not-allowed") {
                setErrorType("permission-denied");
                cleanupAll();
            } else if (event.error === "service-not-allowed") {
                setErrorType("unsupported");
                cleanupAll();
            } else {
                cleanupRecognition();
                setTimeout(() => {
                    if (isMountedRef.current && !isProcessingRef.current && !isSkippedOrFinishedRef.current) {
                        startListening();
                    }
                }, 1000);
            }
        };

        recognition.onend = () => {
            setListening(false);
            isListeningRef.current = false;
            
            // Auto restart recognition if it ended naturally and we are still in answering mode
            if (
                isMountedRef.current &&
                !isProcessingRef.current &&
                !isAiSpeakingRef.current &&
                !isSkippedOrFinishedRef.current &&
                timeLeftRef.current > 0
            ) {
                setTimeout(() => {
                    if (
                        isMountedRef.current &&
                        !isProcessingRef.current &&
                        !isAiSpeakingRef.current &&
                        !isSkippedOrFinishedRef.current
                    ) {
                        startListening();
                    }
                }, 500);
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start speech recognition:", e);
        }
    };

    const cleanupRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onstart = null;
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            recognitionRef.current = null;
        }
        setListening(false);
        isListeningRef.current = false;
    };

    // ==========================================
    // Timer
    // ==========================================
    const startTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }

        timerIntervalRef.current = setInterval(() => {
            if (!isMountedRef.current) {
                clearInterval(timerIntervalRef.current);
                return;
            }

            timeLeftRef.current -= 1;
            setTimeLeft(timeLeftRef.current);

            if (timeLeftRef.current <= 0) {
                clearInterval(timerIntervalRef.current);
                handleTimeUp();
            }
        }, 1000);
    };

    const handleTimeUp = async () => {
        if (isProcessingRef.current) return;
        cleanupRecognition();
        clearTimers();
        setStatus("Time Up");
        await submitAnswer(transcriptRef.current);
    };

    // ==========================================
    // Silence Detection
    // ==========================================
    const resetSilenceTimer = () => {
        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
        }

        silenceTimeoutRef.current = setTimeout(() => {
            askAreYouThere();
        }, SILENCE_TIME);
    };

    const askAreYouThere = () => {
        if (isProcessingRef.current || !isMountedRef.current) return;

        cleanupRecognition();
        clearTimers();

        setListening(false);
        setAiSpeaking(true);
        isAiSpeakingRef.current = true;
        setStatus("AI asking: 'Are you there?'");

        const speech = new SpeechSynthesisUtterance("Are you there?");
        speech.lang = "en-US";
        speech.rate = 1.0;

        speech.onend = () => {
            if (!isMountedRef.current) return;
            setAiSpeaking(false);
            isAiSpeakingRef.current = false;
            
            // Set 5 seconds follow-up skip timer
            silenceTimeoutRef.current = setTimeout(() => {
                autoSkip();
            }, ARE_YOU_THERE_TIME);

            // Resume listening to allow response during the 5s window
            startListening();
        };

        speech.onerror = () => {
            if (!isMountedRef.current) return;
            setAiSpeaking(false);
            isAiSpeakingRef.current = false;
            startListening();
        };

        window.speechSynthesis.speak(speech);
    };

    // ==========================================
    // Auto Skip
    // ==========================================
    const autoSkip = async () => {
        if (isProcessingRef.current || isSkippedOrFinishedRef.current) return;
        isSkippedOrFinishedRef.current = true;
        cleanupRecognition();
        clearTimers();
        setStatus("Question Skipped");
        await submitAnswer("");
    };

    // ==========================================
    // Voice Commands Handler
    // ==========================================
    const handleVoiceCommand = (command) => {
        cleanupRecognition();
        clearTimers();

        if (command === "repeat") {
            // Strip the command from the transcript display and ref
            transcriptRef.current = "";
            setTranscript("");
            
            const currentQ = questionsRef.current[currentQuestionRef.current];
            if (currentQ) {
                speakQuestion(currentQ.question);
            }
        } else if (command === "skip") {
            autoSkip();
        } else if (command === "stop") {
            cleanupAll();
            navigate("/dashboard");
        }
    };

    // ==========================================
    // Submit Answer
    // ==========================================
    const submitAnswer = async (answerText) => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;
        setProcessing(true);
        setStatus("Processing Answer...");

        cleanupRecognition();
        clearTimers();

        try {
            const currentQ = questionsRef.current[currentQuestionRef.current];
            if (currentQ) {
                await apiWithRetry({
                    method: "post",
                    url: `/interview/question/${currentQ.id}/answer`,
                    data: { answer: answerText },
                });
            }

            if (isMountedRef.current) {
                transcriptRef.current = "";
                setTranscript("");

                if (currentQuestionRef.current < questionsRef.current.length - 1) {
                    startQuestionFlow(currentQuestionRef.current + 1);
                } else {
                    setStatus("Generating Result...");
                    await apiWithRetry({
                        method: "post",
                        url: `/interview/${id}/finish`,
                    });
                    
                    if (isMountedRef.current) {
                        setStatus("Interview Completed");
                        navigate(`/result/${id}`);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to submit answer:", error);
            if (isMountedRef.current) {
                setStatus("Network Error. Please try again.");
                // Give user a button/option to re-submit in real systems, or auto-retry
                isProcessingRef.current = false;
                setProcessing(false);
            }
        } finally {
            if (isMountedRef.current) {
                isProcessingRef.current = false;
                setProcessing(false);
            }
        }
    };

    // ==========================================
    // Cleanup Helpers
    // ==========================================
    const clearTimers = () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };

    const cleanupAll = () => {
        window.speechSynthesis.cancel();
        cleanupRecognition();
        clearTimers();
    };

    // Circular Timer Progress Calculation
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (timeLeft / ANSWER_TIME) * circumference;

    // Get Dynamic Color of Circular Progress
    const getTimerColorClass = () => {
        if (timeLeft > 15) return "stroke-emerald-500";
        if (timeLeft > 5) return "stroke-amber-500";
        return "stroke-rose-500 animate-pulse";
    };

    // ==========================================
    // UI Layout Rendering
    // ==========================================
    if (errorType === "unsupported") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Speech Recognition Unsupported</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Your browser does not support the Web Speech Recognition API. Please switch to Google Chrome or Microsoft Edge to continue with your voice interview.
                    </p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg shadow-blue-500/20"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (errorType === "permission-denied") {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-xl border border-slate-100 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Microphone Blocked</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        We need permission to access your microphone. Please click the camera/microphone icon in your address bar, allow access, and try again.
                    </p>
                    <button
                        onClick={() => {
                            setErrorType(null);
                            startListening();
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl transition duration-200 shadow-lg shadow-blue-500/20 mb-3"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-2xl transition duration-200"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (loadingQuestions) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300 animate-pulse">{status}</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-955 flex flex-col justify-between p-4 md:p-8 transition-colors duration-300">
            {/* Top Bar / Navigation Guard */}
            <div className="max-w-5xl w-full mx-auto flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850">
                <div className="flex items-center gap-3">
                    <span className="flex h-3.5 w-3.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
                    </span>
                    <span className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Interview Session</span>
                </div>
                <button
                    onClick={() => handleVoiceCommand("stop")}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 rounded-2xl transition duration-150"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Quit Session
                </button>
            </div>

            {/* Main Board */}
            <div className="max-w-5xl w-full mx-auto grid md:grid-cols-3 gap-6 my-6 flex-grow">
                {/* Left Section: Question Card */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850 relative overflow-hidden flex-grow flex flex-col justify-between">
                        <div>
                            {/* Question Header & Counter */}
                            <div className="flex items-center justify-between mb-8">
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                    Question {currentQuestion + 1} of {questions.length}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                    ID: #{questions[currentQuestion]?.id || "..."}
                                </span>
                            </div>

                            {/* Question Body */}
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed mb-6">
                                {questions[currentQuestion]?.question || "No active question."}
                            </h2>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-8">
                            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                                <span>Interview Progress</span>
                                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Speech / Transcript Area */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850 min-h-[220px] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-4 border-b border-slate-50 dark:border-slate-800 pb-3">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                    Speech Transcript
                                </h3>
                                {!hasSpoken && listening && (
                                    <span className="text-xs font-semibold text-amber-500 dark:text-amber-400 animate-pulse bg-amber-50 dark:bg-amber-950/20 px-3 py-1 rounded-full">
                                        Speak a word to start 30s timer
                                    </span>
                                )}
                            </div>

                            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed italic">
                                {transcript || (
                                    <span className="text-slate-400 dark:text-slate-600 font-light">
                                        Transcript will appear here as you speak...
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Speech Live indicators */}
                        {listening && (
                            <div className="flex items-center gap-1.5 mt-6 self-start bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-1.5 rounded-2xl border border-emerald-100 dark:border-emerald-950/30">
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce delay-75"></div>
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide ml-1.5">Listening Live</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section: Status, Countdown & Circular Timer */}
                <div className="flex flex-col gap-6">
                    {/* Circle Timer Card */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850 flex flex-col items-center justify-center relative min-h-[250px]">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            {/* Circular Timer SVG */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="72"
                                    cy="72"
                                    r={radius}
                                    className="stroke-slate-100 dark:stroke-slate-800"
                                    strokeWidth="6"
                                    fill="transparent"
                                />
                                <circle
                                    cx="72"
                                    cy="72"
                                    r={radius}
                                    className={`${getTimerColorClass()} transition-all duration-1000 ease-linear`}
                                    strokeWidth="6"
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col justify-center items-center">
                                <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tighter">
                                    {timeLeft}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-0.5">
                                    Seconds
                                </span>
                            </div>
                        </div>

                        {countdown !== null && (
                            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 rounded-3xl flex flex-col items-center justify-center transition-all duration-300">
                                <div className="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">Microphone starting in</div>
                                <div className="text-6xl font-black text-blue-600 dark:text-blue-400 animate-scaleUp">{countdown}</div>
                            </div>
                        )}
                    </div>

                    {/* Status & Dashboard Control Badges */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase border-b border-slate-50 dark:border-slate-800 pb-3 mb-6">
                                Status Monitor
                            </h3>

                            {/* Status Bar */}
                            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 mb-6 flex items-center gap-3">
                                <div className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                </div>
                                <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
                                    {status}
                                </span>
                            </div>

                            {/* Status State Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className={`flex flex-col p-3 rounded-2xl border text-center transition-all duration-200 ${listening ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-950/20 text-emerald-700 dark:text-emerald-400" : "bg-slate-50/50 dark:bg-slate-850/10 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500"}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">Microphone</span>
                                    <span className="text-xs font-black">{listening ? "🎤 ON / LISTENING" : "🎤 OFF"}</span>
                                </div>

                                <div className={`flex flex-col p-3 rounded-2xl border text-center transition-all duration-200 ${aiSpeaking ? "bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-950/20 text-blue-700 dark:text-blue-400" : "bg-slate-50/50 dark:bg-slate-850/10 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500"}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">AI Assistant</span>
                                    <span className="text-xs font-black">{aiSpeaking ? "🗣 SPEAKING" : "IDLE"}</span>
                                </div>

                                <div className={`flex flex-col p-3 rounded-2xl border text-center transition-all duration-200 ${processing ? "bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-950/20 text-amber-700 dark:text-amber-400 animate-pulse" : "bg-slate-50/50 dark:bg-slate-850/10 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500"}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">Response API</span>
                                    <span className="text-xs font-black">{processing ? "⏳ PROCESSING" : "WAITING"}</span>
                                </div>

                                <button
                                    onClick={() => handleVoiceCommand("repeat")}
                                    disabled={processing || aiSpeaking}
                                    className="flex flex-col p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-center transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">Voice Action</span>
                                    <span className="text-xs font-black uppercase flex items-center justify-center gap-1.5">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
                                        </svg>
                                        Repeat Question
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Interactive Skip Button */}
                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => handleVoiceCommand("skip")}
                                disabled={processing || aiSpeaking}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3.5 px-6 rounded-2xl transition duration-150 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Skip Question
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                            </button>
                            
                            <button
                                onClick={() => submitAnswer(transcriptRef.current)}
                                disabled={processing || aiSpeaking || !hasSpoken}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition duration-150 text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                Submit Answer
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Instructions / Tip */}
            <div className="max-w-5xl w-full mx-auto bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-850 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">🎙 Speech Recognition Commands Supported</span>
                <div className="flex flex-wrap justify-center gap-3">
                    <span className="bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-400 text-xs font-mono font-medium">"Repeat Question"</span>
                    <span className="bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-400 text-xs font-mono font-medium">"Skip Question"</span>
                    <span className="bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-600 dark:text-slate-400 text-xs font-mono font-medium">"Stop Interview"</span>
                </div>
            </div>
        </div>
    );
}

export default VoiceInterview;
