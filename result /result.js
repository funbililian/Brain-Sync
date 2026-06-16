// ===================================
// RESULTS PAGE
// ===================================

document.addEventListener("DOMContentLoaded", () => {

    // Get stored results
    const storedResults =
        localStorage.getItem("quizResults");

    // Redirect if no results exist
    if (!storedResults) {

        window.location.href =
            "../index.html";

        return;
    }

    // Parse results
    const results =
        JSON.parse(storedResults);

    // ===================================
    // DISPLAY RESULTS
    // ===================================

    const scoreElement =
        document.getElementById("score");

    const totalElement =
        document.getElementById("total");

    const percentageElement =
        document.getElementById("percentage");

    const categoryElement =
        document.getElementById("category");

    const answeredElement =
        document.getElementById("answered");

    const messageElement =
        document.getElementById("message");

    if (scoreElement) {
        scoreElement.textContent =
            results.score;
    }

    if (totalElement) {
        totalElement.textContent =
            results.total;
    }

    if (percentageElement) {
        percentageElement.textContent =
            `${results.percentage}%`;
    }

    if (answeredElement) {
        answeredElement.textContent =
            results.answered;
    }

    if (categoryElement) {

        const formattedCategory =
            results.category
                .replace(/_/g, " ")
                .replace(
                    /\b\w/g,
                    char => char.toUpperCase()
                );

        categoryElement.textContent =
            formattedCategory;
    }

    // ===================================
    // PERFORMANCE MESSAGE
    // ===================================

    if (messageElement) {

        let message = "";

        if (results.percentage >= 90) {

            message =
                "Outstanding Performance! 🎉";

        } else if (
            results.percentage >= 75
        ) {

            message =
                "Great Job! 👏";

        } else if (
            results.percentage >= 50
        ) {

            message =
                "Good Effort! 👍";

        } else {

            message =
                "Keep Practicing! 📚";
        }

        messageElement.textContent =
            message;
    }

    // ===================================
    // CIRCULAR PROGRESS (OPTIONAL)
    // ===================================

    const progressCircle =
        document.getElementById(
            "progressCircle"
        );

    if (progressCircle) {

        progressCircle.style.setProperty(
            "--progress",
            `${results.percentage}%`
        );
    }
});

// ===================================
// PLAY AGAIN
// ===================================

function playAgain() {

    localStorage.removeItem(
        "quizResults"
    );

    window.location.href =
        "../index.html";
}

// ===================================
// RETAKE SAME CATEGORY
// ===================================

function retakeQuiz() {

    const storedResults =
        localStorage.getItem(
            "quizResults"
        );

    if (!storedResults) {

        window.location.href =
            "../index.html";

        return;
    }

    const results =
        JSON.parse(storedResults);

    window.location.href =
        `../quiz/index.html?category=${results.category}`;
}
