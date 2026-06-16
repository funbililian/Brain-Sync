// ===================================
// RESULTS PAGE
// ===================================

document.addEventListener("DOMContentLoaded", () => {

    const storedResults = localStorage.getItem("quizResults");

    // Redirect if no results exist
    if (!storedResults) {
        window.location.href = "../index.html";
        return;
    }

    // Parse results AFTER checking
    const results = JSON.parse(storedResults);

    // Update score circle progress
    const circle = document.querySelector(".score-circle");
    if (circle) {
        circle.style.setProperty("--progress", results.percentage);
    }

});

    const results = JSON.parse(storedResults);

    // ===================================
    // ELEMENTS
    // ===================================

    const scoreElement = document.getElementById("score");
    const totalElement = document.getElementById("total");
    const percentageElement = document.getElementById("percentage");
    const categoryElement = document.getElementById("category");
    const answeredElement = document.getElementById("answered");
    const messageElement = document.getElementById("message");
    const shareBtn = document.getElementById("shareBtn");

    // ===================================
    // DISPLAY RESULTS
    // ===================================

    if (scoreElement) scoreElement.textContent = results.score;
    if (totalElement) totalElement.textContent = results.total;
    if (percentageElement) percentageElement.textContent = `${results.percentage}%`;
    if (answeredElement) answeredElement.textContent = results.answered;

    if (categoryElement) {
        const formattedCategory = results.category
            .replace(/_/g, " ")
            .replace(/\b\w/g, c => c.toUpperCase());

        categoryElement.textContent = formattedCategory;
    }

    // ===================================
    // PERFORMANCE MESSAGE
    // ===================================

    if (messageElement) {
        let message = "";

        if (results.percentage >= 90) {
            message = "Outstanding Performance! 🎉";
        } else if (results.percentage >= 75) {
            message = "Great Job! 👏";
        } else if (results.percentage >= 50) {
            message = "Good Effort! 👍";
        } else {
            message = "Keep Practicing! 📚";
        }

        messageElement.textContent = message;
    }

    // ===================================
    // SHARE SCORE FUNCTIONALITY
    // ===================================

    if (shareBtn) {
        shareBtn.addEventListener("click", async () => {

            const shareText =
                `I scored ${results.score}/${results.total} (${results.percentage}%) in Brain Sync Quiz - Category: ${results.category}`;

            const shareData = {
                title: "Brain Sync Quiz Result",
                text: shareText,
                url: window.location.origin
            };

            // Mobile / modern browsers
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log("Share cancelled or failed:", err);
                }
            } 
            // Fallback (copy to clipboard)
            else {
                try {
                    await navigator.clipboard.writeText(
                        `${shareText} - ${window.location.href}`
                    );
                    alert("Score copied to clipboard!");
                } catch (err) {
                    alert("Unable to share score");
                }
            }
        });
    }
});

// ===================================
// RETAKE QUIZ
// ===================================

function retakeQuiz() {

    localStorage.removeItem("quizResults");

    window.location.href = "../quiz/index.html";
}
