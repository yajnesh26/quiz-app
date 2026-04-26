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

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    userName = document.getElementById("username").value;

    if (userName === "") {
        alert("Enter your name first!");
        return;
    }

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

function showScore() {
    resetState();

    document.getElementById("quiz-container").style.display = "none";
    const resultDiv = document.getElementById("result");
    const historyDiv = document.getElementById("history");

    resultDiv.style.display = "block";
    historyDiv.style.display = "block"; // 👈 show only here

    let percentage = (score / questions.length) * 100;

    resultDiv.innerHTML = `
        <h2>${userName}, you scored ${score}/${questions.length}</h2>
        <p>Percentage: ${percentage}%</p>
        <div style="background:#ddd; width:100%; height:20px; border-radius:10px;">
            <div style="width:${percentage}%; height:100%; background:green; border-radius:10px;"></div>
        </div>
        <button onclick="location.reload()">Play Again</button>
    `;

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

    historyDiv.innerHTML = `
        <h3 style="text-align:center;">📊 Quiz History</h3>
        <table class="history-table">
            <tr>
                <th>Name</th>
                <th>Score</th>
                <th>Date & Time</th>
            </tr>
        </table>
    `;

    const table = historyDiv.querySelector("table");

    history
        .sort((a, b) => b.score - a.score) // sort highest score first
        .forEach(item => {
            let row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.score}/${item.total}</td>
                <td>${item.date}</td>
            </tr>
        `;
            table.innerHTML += row;
        });
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();