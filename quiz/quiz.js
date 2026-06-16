// ===================================
// QUIZ APP
// ===================================

// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// ===================================
// API URLS
// ===================================

const API_URLS = {
    history:
        "https://opentdb.com/api.php?amount=15&category=23&difficulty=medium&type=multiple",

    sports:
        "https://opentdb.com/api.php?amount=15&category=21&difficulty=medium&type=multiple",

    general:
        "https://opentdb.com/api.php?amount=15&category=9&difficulty=medium&type=multiple"
};

// ===================================
// STATE
// ===================================

let questions = [];
let currentQuestion = 0;
let selectedAnswers = [];
let score = 0;

let timeLeft = 600; // 10 minutes
let timerInterval = null;

// ===================================
// INITIALIZE APP
// ===================================

window.addEventListener("DOMContentLoaded", () => {

    if (!category || !API_URLS[category]) {

        const questionElement =
            document.getElementById("question");

        if (questionElement) {
            questionElement.textContent =
                "Invalid category selected.";
        }

        return;
    }

    attachEventListeners();

    loadQuiz();
});

// ===================================
// LOAD QUESTIONS
// ===================================

async function loadQuiz() {

    try {

        const response =
            await fetch(API_URLS[category]);

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const data = await response.json();

        if (
            !data.results ||
            data.results.length === 0
        ) {
            throw new Error(
                "No questions returned."
            );
        }

        questions = data.results;

        displayQuestion();

        startTimer();

    } catch (error) {

        console.error(
            "Quiz Load Error:",
            error
        );

        const questionElement =
            document.getElementById("question");

        if (questionElement) {
            questionElement.textContent =
                "Failed to load questions. Please try again.";
        }
    }
}

// ===================================
// TIMER
// ===================================

function startTimer() {

    updateTimerDisplay();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            alert(
                "Time is up! Submitting quiz."
            );

            finishQuiz();
        }

    }, 1000);
}

function updateTimerDisplay() {

    const timerElement =
        document.getElementById("timer");

    if (!timerElement) return;

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ===================================
// DISPLAY QUESTION
// ===================================

function displayQuestion() {

    if (!questions.length) return;

    const q =
        questions[currentQuestion];

    // Question Number
    document.getElementById(
        "questionNumber"
    ).textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    // Progress
    const progress =
        ((currentQuestion + 1) /
            questions.length) * 100;

    document.getElementById(
        "percentage"
    ).textContent =
        `${Math.round(progress)}%`;

    document.getElementById(
        "progress"
    ).style.width =
        `${progress}%`;

    // Question Text
    document.getElementById(
        "question"
    ).innerHTML =
        decodeHTML(q.question);

    // Answers
    const answersContainer =
        document.getElementById(
            "answers"
        );

    answersContainer.innerHTML = "";

    const answers = shuffle([
        ...q.incorrect_answers,
        q.correct_answer
    ]);

    answers.forEach(answer => {

        const button =
            document.createElement(
                "button"
            );

        button.className =
            "answer-btn";

        button.innerHTML =
            decodeHTML(answer);

        if (
            selectedAnswers[
                currentQuestion
            ] === answer
        ) {
            button.classList.add(
                "selected"
            );
        }

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".answer-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "selected"
                        )
                    );

                button.classList.add(
                    "selected"
                );

                selectedAnswers[
                    currentQuestion
                ] = answer;
            }
        );

        answersContainer.appendChild(
            button
        );
    });

    updateNavigationButtons();
}

// ===================================
// BUTTON EVENTS
// ===================================

function attachEventListeners() {

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            () => {

                if (
                    currentQuestion <
                    questions.length - 1
                ) {

                    currentQuestion++;

                    displayQuestion();

                } else {

                    finishQuiz();
                }
            }
        );
    }

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            () => {

                if (
                    currentQuestion > 0
                ) {

                    currentQuestion--;

                    displayQuestion();
                }
            }
        );
    }
}

// ===================================
// NAVIGATION BUTTONS
// ===================================

function updateNavigationButtons() {

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    if (prevBtn) {
        prevBtn.disabled =
            currentQuestion === 0;
    }

    if (nextBtn) {

        nextBtn.textContent =
            currentQuestion ===
            questions.length - 1
                ? "Finish Quiz"
                : "Next";
    }
}

// ===================================
// SCORE CALCULATION
// ===================================

function calculateScore() {

    score = 0;

    questions.forEach(
        (question, index) => {

            if (
                selectedAnswers[
                    index
                ] ===
                question.correct_answer
            ) {
                score++;
            }
        }
    );
}

// ===================================
// FINISH QUIZ
// ===================================

function finishQuiz() {

    clearInterval(
        timerInterval
    );

    calculateScore();

    const results = {

        category,

        score,

        total:
            questions.length,

        percentage:
            Math.round(
                (score /
                    questions.length) *
                    100
            ),

        answered:
            selectedAnswers.filter(
                answer => answer
            ).length
    };

    localStorage.setItem(
        "quizResults",
        JSON.stringify(results)
    );

    window.location.href =
        "../results/index.html";
}

// ===================================
// HELPERS
// ===================================

function shuffle(array) {

    const shuffled =
        [...array];

    for (
        let i =
            shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                    (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}

function decodeHTML(html) {

    const txt =
        document.createElement(
            "textarea"
        );

    txt.innerHTML = html;

    return txt.value;
}
