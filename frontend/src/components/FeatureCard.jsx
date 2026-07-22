function FeatureCard({ icon, title, description }) {
    return (
        <div className="
bg-white
rounded-2xl
shadow-md
p-8

hover:-translate-y-3
hover:shadow-2xl
hover:scale-105

transition-all
duration-300
">

            <div className="text-5xl mb-5 text-blue-600">
                {icon}
            </div>

            <h3 className="text-2xl font-bold mb-3">
                {title}
            </h3>

            <p className="text-gray-600 leading-7">
                {description}
            </p>

        </div>
    );
}

export default FeatureCard;