export function getQuizBadge(percentage) {
    if (percentage >= 90) return "Cyber Champion";
    if (percentage >= 75) return "Cyber Defender";
    if (percentage >= 60) return "Security Learner";
    return "Cyber Explorer";
}

export function getScenarioBadge(xp) {
    if (xp >= 140) return "Cyber Guardian";
    if (xp >= 120) return "Cyber Analyst";
    if (xp >= 80) return "Cyber Defender";
    if (xp >= 40) return "Security Learner";
    return "Cyber Rookie";
}
