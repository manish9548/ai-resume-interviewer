import { FaFilePdf, FaCalendarAlt, FaBrain } from "react-icons/fa";
import Button from "./Button";

function ResumeHistoryCard({ fileName, uploadedAt, onAnalyze }) {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">

            <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">

                    <FaFilePdf className="text-red-600 text-2xl" />

                </div>

                <div>

                    <h3 className="text-xl font-bold">

                        {fileName}

                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 mt-2">

                        <FaCalendarAlt />

                        <span>{uploadedAt}</span>

                    </div>

                </div>

            </div>

            <div className="mt-6">

                <Button onClick={onAnalyze}>

                    <FaBrain className="inline mr-2" />

                    Analyze Resume

                </Button>

            </div>

        </div>

    );

}

export default ResumeHistoryCard;