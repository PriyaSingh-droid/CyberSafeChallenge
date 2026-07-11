async function loadCertificate() {
    const message = document.querySelector(".muted");
    let session;
    try { session = JSON.parse(localStorage.getItem("cybersafeParticipant")); } catch { session = null; }
    if (!session?._id) return;
    try {
        const [{ participant }, { certificate }] = await Promise.all([
            fetch(`/api/participant/${session._id}`).then((response) => response.json()),
            fetch(`/api/participant/${session._id}/certificate`).then((response) => response.json())
        ]);
        if (certificate?.certificateNumber) message.textContent = `${participant.fullName} — Certificate ${certificate.certificateNumber}, issued ${new Date(certificate.issuedDate).toLocaleDateString()}.`;
    } catch {
        message.textContent = "Complete the quiz to receive your certificate number in your completion record.";
    }
}

loadCertificate();
