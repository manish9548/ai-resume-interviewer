function DashboardCard({ icon, title, value, color }) {
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

            <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl text-white ${color}`}
            >
                {icon}
            </div>

            <h3 className="text-gray-500 text-lg mt-5">

                {title}

            </h3>

            <h2 className="text-4xl font-bold mt-2">

                {value}

            </h2>

        </div>

    );
}

export default DashboardCard;