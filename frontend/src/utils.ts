import Cookies from 'js-cookie';


export const getRootUri = () => {
    if (process.env.NODE_ENV === 'development') {
        return "";
    }
    return "";
}

export const getCsrfToken = () => {
    if (process.env.NODE_ENV === "development") {
      return Cookies.get("csrftoken");
    }
    return Cookies.get("csrftoken");
}