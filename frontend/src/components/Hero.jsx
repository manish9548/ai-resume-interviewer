import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FaRobot } from "react-icons/fa6";

function Hero() {
    return (
        <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-100">

            <div className="max-w-7xl mx-auto px-6 py-24">

                <div className="grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Side */}

                    <div>

                        <p className="text-blue-600 font-semibold mb-4">
                            🚀 AI Powered Interview Preparation
                        </p>

                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">

                            Crack Your

                            <span className="text-blue-600">

                                {" "}Dream Job

                            </span>

                            <br />

                            with AI

                        </h1>

                        <p className="mt-8 text-gray-600 text-lg leading-8">

                            Upload your resume, practice company-specific
                            interview questions, receive AI-powered feedback,
                            and improve your chances of landing your dream job.

                        </p>

                        <div className="flex gap-5 mt-10">

                            <Link
                                to="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition"
                            >

                                Get Started

                                <FaArrowRight />

                            </Link>

                            <Link
                                to="/login"
                                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl transition"
                            >

                                Login

                            </Link>

                        </div>

                    </div>

                    {/* Right Side */}

                    <div className="flex justify-center">

                        <div className="bg-white rounded-3xl shadow-2xl p-12">

                            <FaRobot
                                className="text-blue-600"
                                size={220}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;