const form = document.getElementById("loginForm");
const popup = document.getElementById("popup");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
togglePassword.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    popup.style.display = "flex";
});

function closePopup() {
    popup.style.display = "none";
    window.location.href = "quiz.html";
}

document.getElementById("continueToQuiz").addEventListener("click", closePopup);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.style.display === "flex") {
        popup.style.display = "none";
    }
});
