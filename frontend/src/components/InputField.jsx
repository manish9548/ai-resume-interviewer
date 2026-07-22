function InputField({
    type,
    placeholder,
    value,
    onChange
}) {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="
                w-full
                border
                rounded-lg
                px-4
                py-3
                outline-none
                focus:ring-2
               focus:border-blue-500
               transition-all duration-200
            "
        />
    );
}

export default InputField;