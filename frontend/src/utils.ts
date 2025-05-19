export const getRootUri = () => {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:8000";
    }
    return "";
}