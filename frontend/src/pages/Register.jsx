import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { register } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {

        e.preventDefault();

        if(password !== confirmPassword){

            alert("Passwords do not match");

            return;

        }

        setLoading(true);

        try{

            const response = await register({

                fullName,

                email,

                password

            });

            alert(response);

            navigate("/login");

        }catch (error) {

    console.log(error);

    console.log(error.response);

    console.log(error.response?.data);

    alert(JSON.stringify(error.response?.data));

}finally{

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex justify-center items-center">

            <div className="bg-white shadow-2xl rounded-xl w-full max-w-md p-8">

                <h1 className="text-4xl font-bold text-center">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Register to start AI Interview
                </p>

                <form
                    onSubmit={handleRegister}
                    className="space-y-5"
                >

                    <InputField
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e)=>setFullName(e.target.value)}
                    />

                    <InputField
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />

                    <InputField
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />

                    <InputField
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                    >

                        {
                            loading
                            ?
                            "Registering..."
                            :
                            "Register"
                        }

                    </Button>

                </form>

                <p className="text-center mt-6">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 font-semibold ml-1"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;