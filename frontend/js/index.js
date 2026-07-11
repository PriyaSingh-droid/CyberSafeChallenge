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
        fullName: document.getElementById("fullName").value.trim()
    };

    try {
        const response = await fetch("/api/session", {
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

        // Save the participant so the rest of the flow reuses the same session.
        localStorage.setItem("cybersafeParticipant", JSON.stringify(data.participant));
        localStorage.setItem("participantId", data.participant._id);

        joinModal.classList.add("hidden");
        window.location.href = "login.html";

    } catch (error) {
        console.error(error);
        alert("Cannot start the challenge right now. Please try again.");
    }
});
