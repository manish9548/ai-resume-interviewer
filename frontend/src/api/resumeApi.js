import api from "./api";

export const uploadResume = async (formData) => {

    const response = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getResumeHistory = async () => {

    const response = await api.get("/resume/history");

    return response.data;
};

export const analyzeResume = async () => {

    const response = await api.get("/resume/analyze");

    return response.data;
};