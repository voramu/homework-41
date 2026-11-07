const profileCard = document.getElementById("profileCard");
const loading = document.getElementById("loading");
const profileError = document.getElementById("profileError");

const logoutButton = document.getElementById("logoutButton");

// Получаем элементы профиля
const userImage = document.getElementById("userImage");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAge = document.getElementById("userAge");
const userCity = document.getElementById("userCity");
const userUsername = document.getElementById("userUsername");

// Кнопка выхода
logoutButton.addEventListener("click", logout);

// Запрос данных пользователя
async function getUserProfile() {

    let token = getAccessToken();

    // Если токена нет
    if (!token) {
        window.location.replace("./login.html");
        return;
    }

    loading.classList.remove("hidden");
    profileCard.classList.add("hidden");
    profileError.textContent = "";

    try {

        let response;

        try {

            // Первый запрос профиля
            response = await axios.get(
                `${API_URL}/auth/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } catch (error) {

            // Если получили 401
            if (error.response && error.response.status === 401) {

                // Пробуем обновить токен
                token = await refreshAccessToken();

                // Повторяем запрос профиля
                response = await axios.get(
                    `${API_URL}/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

            } else {
                throw error;
            }
        }

        // Получаем данные пользователя
        const user = response.data;

        // Выводим информацию
        userImage.src = user.image;
        userName.textContent =
            `${user.firstName} ${user.lastName}`;

        userEmail.textContent = user.email;
        userAge.textContent = `${user.age} лет`;
        userCity.textContent = user.address?.city || "Не указан";
        userUsername.textContent = user.username;

        // Показываем профиль
        loading.classList.add("hidden");
        profileCard.classList.remove("hidden");

    } catch (error) {

        console.error("Profile error:", error);

        loading.classList.add("hidden");

        if (error.response && error.response.status === 401) {

            // Токен недействителен
            logout();

        } else {
            profileError.textContent =
                "Не удалось загрузить профиль. Попробуйте обновить страницу.";
        }
    }
}

// Загружаем профиль
getUserProfile();