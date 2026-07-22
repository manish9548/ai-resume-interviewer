import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa";

function Navbar() {

    return (

        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <FaRobot
                        className="text-blue-600 text-3xl"
                    />

                    <span className="text-2xl font-bold">

                        AI Resume Interviewer

                    </span>

                </Link>

                {/* Menu */}

                <div className="flex items-center gap-8">

                    <a href="#features"
                        className="hover:text-blue-600 transition">
                        Features
                    </a>

                    <a href="#how"
                        className="hover:text-blue-600 transition">
                        How It Works
                    </a>

                    <a href="#about"
                        className="hover:text-blue-600 transition">
                        About
                    </a>

                </div>

                {/* Buttons */}

                <div className="flex gap-3">

                    <Link
                        to="/login"
                        className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                    >

                        Login

                    </Link>

                    <Link
                        to="/register"
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >

                        Register

                    </Link>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;