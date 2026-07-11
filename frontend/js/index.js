const startChallengeBtn = document.getElementById("startChallengeBtn");
const joinModal = document.getElementById("joinModal");
const joinForm = document.getElementById("joinForm");

// Open modal
startChallengeBtn.addEventListener("click", () => {
    joinModal.classList.remove("hidden");
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === joinModal) {
        joinModal.classList.add("hidden");
    }
});

// Submit form
joinForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const participant = {
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        college: document.getElementById("college").value.trim(),
        course: document.getElementById("course").value.trim()
    };

    try {
        const response = await fetch("http://localhost:5000/api/competition/join", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(participant)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to join competition.");
            return;
        }

        // Save participant id
        localStorage.setItem("participantId", data.participantId);

        alert("Welcome to CyberSafe Challenge!");

        // Redirect to first challenge
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Cannot connect to the server. Is the backend running?");
    }
});