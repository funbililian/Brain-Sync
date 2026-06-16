// ===================================
// RESULTS PAGE (FIXED VERSION)
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  const storedResults = localStorage.getItem("quizResults");

  // Redirect if no results exist
  if (!storedResults) {
    window.location.href = "../index.html";
    return;
  }

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
  if (percentageElement)
    percentageElement.textContent = `${results.percentage}%`;
  if (answeredElement) answeredElement.textContent = results.answered;

  if (categoryElement) {
    const formattedCategory = results.category
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

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
  // SCORE CIRCLE PROGRESS
  // ===================================

  const circle = document.querySelector(".score-circle");
  if (circle) {
    circle.style.setProperty("--progress", results.percentage);
  }

  // ===================================
  // SHARE BUTTON
  // ===================================

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareText = `I scored ${results.score}/${results.total} (${results.percentage}%) in Brain Sync Quiz - Category: ${results.category}`;

      const shareData = {
        title: "Brain Sync Quiz Result",
        text: shareText,
        url: window.location.origin,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(
            `${shareText} - ${window.location.href}`,
          );
          alert("Score copied to clipboard!");
        }
      } catch (err) {
        console.log("Share failed:", err);
      }
    });
  }

  // ===================================
  // RETAKE BUTTON FIX
  // ===================================

  const startBtn = document.getElementById("startQuizBtn");

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }
});

// ===================================
// RETAKE QUIZ (GLOBAL FUNCTION)
// ===================================

function retakeQuiz() {
  localStorage.removeItem("quizResults");
  window.location.href = "../quiz/index.html";
}
