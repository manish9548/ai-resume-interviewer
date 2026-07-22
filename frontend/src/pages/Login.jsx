import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { login } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const token = await login({
                email,
                password
            });

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } catch (error) {

            alert("Invalid Email or Password");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center">

            <div className="bg-white/80 backdrop-blur-md w-full max-w-md rounded-xlshadow-2xl p-8">

                <h1 className="text-4xl font-extrabold text-center text-gray-800">
                    AI Resume Interviewer
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-8">
                    Login to continue
                </p>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <InputField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputField
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </Button>

                </form>

                <p className="text-center mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold ml-1"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;