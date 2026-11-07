const loginForm = document.getElementById("loginForm");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

const serverError = document.getElementById("serverError");
const loginButton = document.getElementById("loginButton");

// Если пользователь уже авторизован
if (getAccessToken()) {
    window.location.replace("./profile.html");
}

// Удаление ошибок
function clearErrors() {
    usernameError.textContent = "";
    passwordError.textContent = "";
    serverError.textContent = "";

    usernameInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");
}

// Проверка полей
function validateForm() {
    clearErrors();

    let isValid = true;

    if (!usernameInput.value.trim()) {
        usernameError.textContent = "Введите логин";
        usernameInput.classList.add("invalid");
        isValid = false;
    }

    if (!passwordInput.value.trim()) {
        passwordError.textContent = "Введите пароль";
        passwordInput.classList.add("invalid");
        isValid = false;
    }

    return isValid;
}

// Вход в аккаунт
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Вход...";

    try {
        const response = await axios.post(
            `${API_URL}/auth/login`,
            {
                username: usernameInput.value.trim(),
                password: passwordInput.value
            }
        );

        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;

        if (!accessToken || !refreshToken) {
            throw new Error("Токены не получены");
        }

        // Сохраняем токены
        saveTokens(accessToken, refreshToken);

        // Переходим в профиль
        window.location.replace("./profile.html");

    } catch (error) {

        if (error.response && error.response.status === 400) {
            serverError.textContent =
                "Неверный логин или пароль";
        } else if (error.response) {
            serverError.textContent =
                "Ошибка сервера. Попробуйте позже.";
        } else {
            serverError.textContent =
                "Не удалось подключиться к серверу.";
        }

        console.error("Login error:", error);

    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Войти в аккаунт";
    }
});

// Убираем ошибки при вводе
usernameInput.addEventListener("input", clearErrors);
passwordInput.addEventListener("input", clearErrors);