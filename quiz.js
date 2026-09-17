let username = ""

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
            { text: "United states", correct: false },
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
const clearHistoryButton = document.getElementById("clear-history-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    const input = document.getElementById("username");
    const error = document.getElementById("error");

    username = input.value.trim();

    // 👉 Only show error when button is clicked AND input is empty
    if(username === ""){
        error.style.visibility = "visible";
        return;
    }

    // 👉 If valid input
    error.style.visibility = "hidden";

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";

    currentQuestionIndex = 0;
    score = 0;
    nextButton.textContent = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();

    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;

    questionElement.textContent = `${questionNo}. ${currentQuestion.question}`;

    document.getElementById("question-tracker").textContent =
        `Question ${questionNo} of ${questions.length}`;
    document.getElementById("quiz-progress-bar").style.width =
        `${(questionNo / questions.length) * 100}%`;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
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

function showScore() {
    resetState();

    document.getElementById("quiz-container").style.display = "none";
    const resultDiv = document.getElementById("result");

    resultDiv.style.display = "block";
    document.getElementById("history").style.display = "block";

    const percentage = (score / questions.length) * 100;

    resultDiv.innerHTML = `
        <h2 class="result-title"></h2>
        <p class="result-text"></p>
        <div style="background:#ddd; width:100%; height:20px; border-radius:10px;">
            <div class="result-bar" style="height:100%; background:green; border-radius:10px;"></div>
        </div>
        <button onclick="location.reload()">Play Again</button>
    `;

    resultDiv.querySelector(".result-title").textContent =
        `${username}, you scored ${score}/${questions.length}`;
    resultDiv.querySelector(".result-text").textContent =
        `Percentage: ${percentage}%`;
    resultDiv.querySelector(".result-bar").style.width = `${percentage}%`;

    saveHistory();
    displayHistory();
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

    history.push({
        name: username,
        score: score,
        total: questions.length,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    });

    localStorage.setItem("quizHistory", JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
    const tbody = document.getElementById("history-body");
    const emptyMsg = document.getElementById("empty-history-msg");

    tbody.innerHTML = "";

    if (history.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

    history
        .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            const aTime = a.timestamp ?? new Date(a.date).getTime();
            const bTime = b.timestamp ?? new Date(b.date).getTime();
            return (bTime || 0) - (aTime || 0);
        })
        .forEach(item => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = item.name;
            row.appendChild(nameCell);

            const scoreCell = document.createElement("td");
            scoreCell.textContent = `${item.score}/${item.total}`;
            row.appendChild(scoreCell);

            const dateCell = document.createElement("td");
            dateCell.textContent = item.date;
            row.appendChild(dateCell);

            tbody.appendChild(row);
        });
}

startButton.addEventListener("click", startQuiz);

usernameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startButton.click();
    }
});

nextButton.addEventListener("click", handleNextButton);

clearHistoryButton.addEventListener("click", () => {
    localStorage.removeItem("quizHistory");
    displayHistory();
});