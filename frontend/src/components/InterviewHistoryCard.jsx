import {
    FaBuilding,
    FaCalendarAlt,
    FaChartLine,
    FaEye,
    FaBrain,
    FaRoad
} from "react-icons/fa";

function InterviewHistoryCard({
    interview,
    onViewResult,
    onGapAnalysis,
    onRoadmap
}) {

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaBuilding />
                {interview.company}
            </h2>

            <p className="text-gray-500 mt-2">
                {interview.interviewType}
            </p>

            <div className="flex justify-between mt-5">

                <div>

                    <p className="text-gray-500">
                        Score
                    </p>

                    <h3 className="text-2xl font-bold text-green-600">
                        {interview.totalScore}
                    </h3>

                </div>

                <div>

                    <p className="text-gray-500">
                        Status
                    </p>

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {interview.status}
                    </span>

                </div>

            </div>

            <div className="mt-4 flex items-center gap-2 text-gray-500">
                <FaCalendarAlt />
                {new Date(interview.createdAt).toLocaleString()}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">

                <button
                    onClick={() => onViewResult(interview.interviewId)}
                    className="bg-blue-600 text-white py-2 rounded-lg"
                >
                    <FaEye className="inline mr-2" />
                    Result
                </button>

                <button
                    onClick={() => onGapAnalysis(interview.interviewId)}
                    className="bg-purple-600 text-white py-2 rounded-lg"
                >
                    <FaBrain className="inline mr-2" />
                    Gap
                </button>

                <button
                    onClick={() => onRoadmap(interview.interviewId)}
                    className="bg-orange-600 text-white py-2 rounded-lg"
                >
                    <FaRoad className="inline mr-2" />
                    Roadmap
                </button>

            </div>

        </div>
    );
}

export default InterviewHistoryCard;