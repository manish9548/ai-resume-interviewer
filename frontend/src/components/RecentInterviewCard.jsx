import { FaArrowRight } from "react-icons/fa";

function RecentInterviewCard({
    company,
    interviewType,
    score,
    status,
}) {

    return (

        <div
            className="
            bg-white
            rounded-2xl
            shadow-md
            p-6

            hover:-translate-y-2
            hover:shadow-2xl

            transition-all
            duration-300
            "
        >

            <div className="flex justify-between items-center">

                <div>

                    <h2 className="text-2xl font-bold">

                        {company}

                    </h2>

                    <p className="text-gray-500 mt-2">

                        {interviewType}

                    </p>

                </div>

                <span
                    className="
                    bg-green-100
                    text-green-700
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    "
                >

                    {status}

                </span>

            </div>

            <div className="mt-6 flex justify-between items-center">

                <div>

                    <p className="text-gray-500">

                        Score

                    </p>

                    <h3 className="text-3xl font-bold text-blue-600">

                        {score}

                    </h3>

                </div>

                <button
                    className="
                    flex
                    items-center
                    gap-2

                    text-blue-600
                    font-semibold

                    hover:text-blue-800
                    "
                >

                    View

                    <FaArrowRight />

                </button>

            </div>

        </div>

    );

}

export default RecentInterviewCard;