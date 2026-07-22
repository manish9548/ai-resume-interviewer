function Button({
    children,
    type = "button",
    onClick,
    disabled,
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                w-full
                py-3
                rounded-lg
                font-semibold
                text-white
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-700
                hover:to-indigo-700
                transition-all
                duration-300
                disabled:opacity-50
                ${className}
            `}
        >
            {children}
        </button>
    );
}

export default Button;