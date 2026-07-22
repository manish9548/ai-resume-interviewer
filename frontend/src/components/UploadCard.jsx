import { useState } from "react";
import { uploadResume } from "../services/resumeService";

function UploadCard() {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {

        if (!file) {
            alert("Please select a PDF file.");
            return;
        }

        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Maximum file size is 5 MB.");
            return;
        }

        try {

            setLoading(true);

            const message = await uploadResume(file);

            alert(message);

            setFile(null);

        } catch (error) {

            console.log(error);

            alert("Upload Failed");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl mx-auto">

            <h2 className="text-3xl font-bold text-center">

                📄 Upload Resume

            </h2>

            <p className="text-center text-gray-500 mt-2">

                Upload your latest resume (PDF only)

            </p>

            <input
                type="file"
                accept=".pdf"
                className="mt-8 w-full border rounded-lg p-3"
                onChange={(e) => setFile(e.target.files[0])}
            />

            {
                file && (

                    <div className="mt-5">

                        <p className="font-semibold">

                            Selected File

                        </p>

                        <p className="text-blue-600">

                            {file.name}

                        </p>

                    </div>

                )
            }

            <button

                onClick={handleUpload}

                className="
                mt-8
                w-full
                bg-blue-600
                text-white
                rounded-xl
                py-3
                font-semibold
                hover:bg-blue-700
                transition
                "

            >

                {loading ? "Uploading..." : "Upload Resume"}

            </button>

        </div>

    );

}

export default UploadCard;