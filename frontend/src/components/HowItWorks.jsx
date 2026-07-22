import {
    FaUpload,
    FaRobot,
    FaComments,
    FaChartLine,
    FaFilePdf,
} from "react-icons/fa";

const steps = [
    {
        icon: <FaUpload />,
        title: "Upload Resume",
        description: "Upload your latest resume securely.",
    },
    {
        icon: <FaRobot />,
        title: "AI Generates Questions",
        description: "Gemini creates company-specific interview questions.",
    },
    {
        icon: <FaComments />,
        title: "Take Interview",
        description: "Answer realistic AI interview questions.",
    },
    {
        icon: <FaChartLine />,
        title: "AI Evaluation",
        description: "Receive detailed score and improvement feedback.",
    },
    {
        icon: <FaFilePdf />,
        title: "Download Report",
        description: "Export your interview report as PDF.",
    },
];

function HowItWorks() {

    return (

        <section id="how" className="py-24 bg-white">

            <div className="max-w-7xl mx-auto px-6">

                <div className="text-center mb-16">

                    <h2 className="text-5xl font-bold">

                        How It

                        <span className="text-blue-600">

                            {" "}Works

                        </span>

                    </h2>

                    <p className="text-gray-600 mt-5 text-lg">

                        Just five simple steps to prepare for your dream interview.

                    </p>

                </div>

                <div className="grid md:grid-cols-5 gap-8">

                    {
                        steps.map((step, index) => (

                            <div
                                key={index}
                                className="text-center"
                            >

                                <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-6">

                                    {step.icon}

                                </div>

                                <h3 className="text-xl font-bold">

                                    {step.title}

                                </h3>

                                <p className="mt-3 text-gray-600">

                                    {step.description}

                                </p>

                            </div>

                        ))
                    }

                </div>

            </div>

        </section>

    );

}

export default HowItWorks;