import { Link } from "react-router-dom";

function CTA() {

    return (

        <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">

            <div className="max-w-5xl mx-auto text-center px-6">

                <h2 className="text-5xl font-bold text-white">

                    Ready to Crack Your Dream Job?

                </h2>

                <p className="text-blue-100 text-lg mt-6">

                    Join thousands of students preparing with AI-powered interviews.

                </p>

                <Link
                    to="/register"
                    className="inline-block mt-10 bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:scale-105 transition"
                >

                    Start For Free

                </Link>

            </div>

        </section>

    );

}

export default CTA;