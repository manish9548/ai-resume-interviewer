import api from "../utils/axiosConfig";

export const uploadResume = async (file) => {

    const formData = new FormData();

    formData.append("file", file);

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