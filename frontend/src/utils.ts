import Cookies from 'js-cookie';


export const getRootUri = () => {
    if (process.env.NODE_ENV === 'development') {
        return "http://localhost:8000";
    }
    return "";
}

export const getCsrfToken = () => {
    if (process.env.NODE_ENV === "development") {
      return "";
    }
    return Cookies.get("csrftoken");
}