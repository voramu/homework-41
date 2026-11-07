const API_URL = "https://dummyjson.com";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

// Получить Access Token
function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Получить Refresh Token
function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Сохранить токены
function saveTokens(accessToken, refreshToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

// Удалить токены
function removeTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// Выход из аккаунта
function logout() {
    removeTokens();
    window.location.replace("./login.html");
}

// Обновление Access Token
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error("Refresh token отсутствует");
    }

    try {
        const response = await axios.post(
            `${API_URL}/auth/refresh`,
            {
                refreshToken: refreshToken,
                expiresInMins: 30
            }
        );

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        if (!newAccessToken || !newRefreshToken) {
            throw new Error("Сервер не вернул новые токены");
        }

        saveTokens(newAccessToken, newRefreshToken);

        return newAccessToken;

    } catch (error) {
        removeTokens();
        throw error;
    }
}