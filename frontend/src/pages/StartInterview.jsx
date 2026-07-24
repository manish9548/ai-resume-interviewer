import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

function StartInterview() {

    const navigate = useNavigate();

    const [company, setCompany] = useState("");

    const [interviewType, setInterviewType] = useState("Java Developer");

    const [loading, setLoading] = useState(false);

    const handleStart = async () => {

        if (company.trim() === "") {

            alert("Enter Company Name");

            return;

        }

        setLoading(true);

        try {

            const response = await api.post("/interview/start", {

                company,

                interviewType

            });

            // Response:
            // Interview Started Successfully. Interview ID: 5

            const interviewId = response.data.split(":")[1].trim();

            navigate(`/interview/${interviewId}`);

        } catch (error) {

            console.log(error);

            alert("Unable to start interview.");

        }

        setLoading(false);

    };

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center">

            <div className="bg-white shadow-xl rounded-xl p-10 w-full max-w-lg">

                <h1 className="text-4xl font-bold text-center mb-8">

                    AI Interview

                </h1>

                <div className="mb-6">

                    <label className="font-semibold">

                        Company

                    </label>

                    <input

                        type="text"

                        value={company}

                        onChange={(e)=>setCompany(e.target.value)}

                        placeholder="Google"

                        className="w-full border rounded-lg p-3 mt-2"

                    />

                </div>

                <div className="mb-8">

                    <label className="font-semibold">

                        Interview Type

                    </label>

                    <select

                        value={interviewType}

                        onChange={(e)=>setInterviewType(e.target.value)}

                        className="w-full border rounded-lg p-3 mt-2"

                    >

                        <option>Java Developer</option>

                        <option>Spring Boot</option>

                        <option>Full Stack</option>

                        <option>DSA</option>

                        <option>HR</option>

                        <option>Behavioral</option>

                    </select>

                </div>

                <button

                    onClick={handleStart}

                    disabled={loading}

                    className="w-full bg-blue-600 text-white py-3 rounded-lg"

                >

                    {

                        loading

                        ?

                        "Generating Questions..."

                        :

                        "Start Interview"

                    }

                </button>

            </div>

        </div>

    );

}

export default StartInterview;