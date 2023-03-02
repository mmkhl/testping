import {getToken, setToken} from './token-service'
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */


export const userLogin = async (login_user, password) => {
    try {
        const url = "https://dev-api.ringapp.me/auth";
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: login_user,
                password: password
            })
        });

        const result = await resp.json();

        if (!result.token) {
            return null;
        }
        const token = result.token;
        setToken(token);

        return token;
    } catch (err) {
        console.warn(err);
        return null;
    }
};

export const fetchUserInfo = async () => {
    try {
        const url = "https://dev-api.ringapp.me/profile";

        const token = getToken();

        const resp = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await resp.json();
        if(result.error) return null;

        return result;
    } catch (err) {
        console.warn(err);
        return null;
    }
};
