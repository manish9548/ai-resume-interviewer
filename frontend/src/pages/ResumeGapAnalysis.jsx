import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axiosConfig";

function ResumeGapAnalysis() {

    const { id } = useParams();

    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGapAnalysis();
    }, []);

    const loadGapAnalysis = async () => {

        try {

            const response = await api.get(
                `/interview/${id}/resume-gap-analysis`
            );

            setData(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load Resume Gap Analysis");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (
            <div className="min-h-screen flex justify-center items-center">
                <h1 className="text-3xl font-bold">
                    Loading...
                </h1>
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-6xl mx-auto py-10">

                <h1 className="text-4xl font-bold mb-8">
                    📄 Resume Gap Analysis
                </h1>

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            ✅ Matched Skills
                        </h2>

                        <ul className="list-disc pl-6">

                            {
                                data.matchedSkills.map((item,index)=>(

                                    <li key={index}>{item}</li>

                                ))
                            }

                        </ul>

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            ❌ Missing Skills
                        </h2>

                        <ul className="list-disc pl-6">

                            {
                                data.missingSkills.map((item,index)=>(

                                    <li key={index}>{item}</li>

                                ))
                            }

                        </ul>

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-2xl font-bold text-blue-600 mb-4">
                            💪 Strengths
                        </h2>

                        <ul className="list-disc pl-6">

                            {
                                data.strengths.map((item,index)=>(

                                    <li key={index}>{item}</li>

                                ))
                            }

                        </ul>

                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">

                        <h2 className="text-2xl font-bold text-orange-600 mb-4">
                            🚀 Improvement Plan
                        </h2>

                        <ul className="list-disc pl-6">

                            {
                                data.improvementPlan.map((item,index)=>(

                                    <li key={index}>{item}</li>

                                ))
                            }

                        </ul>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ResumeGapAnalysis;