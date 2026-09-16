let userName = "";

const questions = [
    {
        question: "Which is the largest animal in the world?",
        answers: [
            { text: "Shark", correct: false },
            { text: "Blue whale", correct: true },
            { text: "Elephant", correct: false },
            { text: "Giraffe", correct: false },
        ]
    },
    {
        question: "Which is the largest desert in the world?",
        answers: [
            { text: "Kalahari", correct: false },
            { text: "Gobi", correct: false },
            { text: "Sahara", correct: false },
            { text: "Antarctica", correct: true },
        ]
    },
    {
        question: "Which is the smallest country in the world?",
        answers: [
            { text: "Bhutan", correct: false },
            { text: "Nepal", correct: false },
            { text: "Vatican City", correct: true },
            { text: "Qatar", correct: false },
        ]
    },
    {
        question: "Which is the largest country in the world?",
        answers: [
            { text: "Russia", correct: true },
            { text: "United States", correct: false },
            { text: "China", correct: false },
            { text: "Canada", correct: false },
        ]
    },
    {
        question: "Which is the smallest continent in the world?",
        answers: [
            { text: "Asia", correct: false },
            { text: "Arctic", correct: false },
            { text: "Africa", correct: false },
            { text: "Australia", correct: true },
        ]
    }
]

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startButton = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");

if (startButton) {
    startButton.addEventListener("click", startQuiz);
}

if (usernameInput) {
    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            startQuiz();
        }
    });
}

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    const input = document.getElementById("username");
    const error = document.getElementById("error");

    userName = input.value.trim();

    // 👉 Only show error when button is clicked AND input is empty
    if(userName === ""){
        error.style.visibility = "visible";
        return;
    }

    // 👉 If valid input
    error.style.visibility = "hidden";

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showScore() {
    resetState();

    document.getElementById("quiz-container").style.display = "none";
    const resultDiv = document.getElementById("result");
    const historyDiv = document.getElementById("history");

    resultDiv.style.display = "block";
    historyDiv.style.display = "block"; // 👈 show only here

    let percentage = (score / questions.length) * 100;
    const safeName = escapeHtml(userName);

    resultDiv.innerHTML = `
        <h2>${safeName}, you scored ${score}/${questions.length}</h2>
        <p>Percentage: ${percentage}%</p>
        <div style="background:#ddd; width:100%; height:20px; border-radius:10px;">
            <div style="width:${percentage}%; height:100%; background:green; border-radius:10px;"></div>
        </div>
        <button id="play-again-btn">Play Again</button>
    `;

    const playAgainBtn = document.getElementById("play-again-btn");
    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            location.reload();
        });
    }

    saveHistory();
    displayHistory(); // 👈 only runs after quiz ends
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function saveHistory() {
    let history = JSON.parse(localStorage.getItem("quizHistory")) || [];

    let data = {
        name: userName,
        score: score,
        total: questions.length,
        date: new Date().toLocaleString()
    };

    history.push(data);
    localStorage.setItem("quizHistory", JSON.stringify(history));
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    const historyDiv = document.getElementById("history");

    if (history.length === 0) {
        historyDiv.innerHTML = `
            <h3 style="text-align:center;">📊 Quiz History</h3>
            <div style="text-align:center; color:#666; margin: 15px 0; font-size:14px;">No quiz history available.</div>
        `;
        return;
    }

    historyDiv.innerHTML = `
        <h3 style="text-align:center;">📊 Quiz History</h3>
        <table class="history-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Date & Time</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        <div style="text-align:center; margin-top: 15px;">
            <button id="clear-history-btn">Clear History</button>
        </div>
    `;

    const tbody = historyDiv.querySelector("tbody");
    const fragment = document.createDocumentFragment();

    history
        .slice()
        .sort((a, b) => b.score - a.score) // sort highest score first
        .forEach(item => {
            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = item.name;

            const tdScore = document.createElement("td");
            tdScore.textContent = `${item.score}/${item.total}`;

            const tdDate = document.createElement("td");
            tdDate.textContent = item.date;

            tr.appendChild(tdName);
            tr.appendChild(tdScore);
            tr.appendChild(tdDate);
            fragment.appendChild(tr);
        });

    tbody.appendChild(fragment);

    const clearHistoryBtn = document.getElementById("clear-history-btn");
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            const confirmed = confirm("Are you sure you want to clear your quiz history?");
            if (confirmed) {
                localStorage.removeItem("quizHistory");
                displayHistory();
            }
        });
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});