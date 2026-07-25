import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axiosConfig";

function Roadmap() {

    const { id } = useParams();

    const [roadmap, setRoadmap] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoadmap();
    }, []);

    const loadRoadmap = async () => {

        try {

            const response = await api.get(
                `/interview/${id}/roadmap`
            );

            setRoadmap(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load Roadmap");

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <h1 className="text-3xl font-bold">
                    Loading Roadmap...
                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100">

            <div className="max-w-6xl mx-auto py-10">

                <h1 className="text-4xl font-bold mb-8 text-center">

                    📚 {roadmap.roadmapTitle}

                </h1>

                <div className="grid md:grid-cols-2 gap-6">

                    <WeekCard
                        title="Week 1"
                        color="blue"
                        tasks={roadmap.week1}
                    />

                    <WeekCard
                        title="Week 2"
                        color="green"
                        tasks={roadmap.week2}
                    />

                    <WeekCard
                        title="Week 3"
                        color="purple"
                        tasks={roadmap.week3}
                    />

                    <WeekCard
                        title="Week 4"
                        color="orange"
                        tasks={roadmap.week4}
                    />

                </div>

            </div>

        </div>

    );

}

function WeekCard({ title, tasks, color }) {

    const colors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600"
    };

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className={`text-2xl font-bold mb-4 ${colors[color]}`}>

                {title}

            </h2>

            <ul className="list-disc pl-6 space-y-2">

                {tasks.map((task, index) => (

                    <li key={index}>
                        {task}
                    </li>

                ))}

            </ul>

        </div>

    );

}

export default Roadmap;