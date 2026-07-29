import api from "../utils/axiosConfig";

export const startInterview = async (data) => {

    const response = await api.post(
        "/interview/start",
        data
    );

    return response.data;

};
export const getDashboard = async () => {
    const response = await api.get("/interview/dashboard");
    return response.data;
};
export const downloadPdfReport = async (id) => {

    const response = await api.get(
        `/interview/${id}/report/pdf`,
        {
            responseType: "blob",
        }
    );

    return response.data;
};

export const getInterviewHistory = async () => {
    const response = await api.get("/interview/history");
    return response.data;
};

export const getInterviewQuestions = async (interviewId) => {

    const response = await api.get(
        `/interview/${interviewId}/questions`
    );

    return response.data;

};

export const submitAnswer = async (questionId, answer) => {

    const response = await api.post(
        `/interview/question/${questionId}/answer`,
        {
            answer
        }
    );

    return response.data;

};

export const skipQuestion = async (questionId) => {

    const response = await api.post(
        `/interview/question/${questionId}/skip`
    );

    return response.data;

};

export const finishInterview = async (interviewId) => {

    const response = await api.post(
        `/interview/${interviewId}/finish`
    );

    return response.data;

};