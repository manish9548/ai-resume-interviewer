import { FaUsers, FaBuilding, FaRobot, FaStar } from "react-icons/fa";

function Stats() {

    const stats = [
        {
            number: "10K+",
            title: "Mock Interviews",
            icon: <FaUsers />,
        },
        {
            number: "50+",
            title: "Companies",
            icon: <FaBuilding />,
        },
        {
            number: "98%",
            title: "AI Accuracy",
            icon: <FaRobot />,
        },
        {
            number: "4.9",
            title: "Student Rating",
            icon: <FaStar />,
        },
    ];

    return (

        <section className="py-20 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <div className="grid md:grid-cols-4 gap-8">

                    {
                        stats.map((item,index)=>(

                            <div
                                key={index}
                                className="bg-gray-50 rounded-2xl p-8 text-center shadow hover:shadow-xl transition"
                            >

                                <div className="text-blue-600 text-4xl mb-4 flex justify-center">

                                    {item.icon}

                                </div>

                                <h2 className="text-4xl font-bold">

                                    {item.number}

                                </h2>

                                <p className="text-gray-600 mt-2">

                                    {item.title}

                                </p>

                            </div>

                        ))
                    }

                </div>

            </div>

        </section>

    );

}

export default Stats;