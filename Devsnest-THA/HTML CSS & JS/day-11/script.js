import questions from "./questions.js";

let questionBox = document.querySelector(".question-box")
const prevButton = document.querySelector(".prev")
const nextButton = document.querySelector(".next")
const scoreDiv = document.querySelector(".score")

let currentQuestion = 0
let markDisabled = false
let questionElements = []
let rightCount = 0
let wrongCount = 0

const setScore = () => {
    scoreDiv.innerHTML = ""
    scoreDiv.append(`Total: ${questions.length},  Right: ${rightCount},  Wrong: ${wrongCount},   Not Attempted: ${questions.length - rightCount - wrongCount}`)
}

const answerClick = (event) => {
    if (markDisabled)
        return
    markDisabled = true
    if(!questionElements[currentQuestion].answered){
        let questionElement = questionElements[currentQuestion]
        let question = questions[currentQuestion]
        let elm = event.target;
        if(elm.id.toString() === question.answer.toString()){
            elm.classList.add("right")
            rightCount++
        }
        else{
            questionElement.optionDivs[question.answer-1].classList.add("right")
            elm.classList.add("wrong")
            wrongCount++
        }
        questionElements[currentQuestion].answered = true
    }
    setTimeout(gotoNext, 500)
    setTimeout(()=>{
        markDisabled = false
    }, 1000)
    setScore()
}

const gotoNext = () => {
    markDisabled = true
    if(currentQuestion === questionElements.length - 1)
        return
    let qElement = questionElements[currentQuestion]
    qElement.questionDiv.classList.remove("center")
    qElement.questionDiv.classList.add("left")
    currentQuestion++;
    let cElement = questionElements[currentQuestion]
    cElement.questionDiv.classList.remove("right")
    cElement.questionDiv.classList.add("center")
    if(currentQuestion === questionElements.length - 1){
        nextButton.classList.add("disabled")
    }
    else {
        prevButton.classList.remove("disabled")
        nextButton.classList.remove("disabled")
    }
    setTimeout(()=>{
        markDisabled = false
    },500)
    setScore()
}

const gotoPrevious = () => {
    markDisabled = true
    if(currentQuestion === 0)
        return
    let qElement = questionElements[currentQuestion]
    qElement.questionDiv.classList.remove("center")
    qElement.questionDiv.classList.add("right")
    currentQuestion--;
    let cElement = questionElements[currentQuestion]
    cElement.questionDiv.classList.remove("left")
    cElement.questionDiv.classList.add("center")
    if(currentQuestion === 0){
        prevButton.classList.add("disabled")
    }
    else {
        prevButton.classList.remove("disabled")
        nextButton.classList.remove("disabled")
    }
    setTimeout(()=>{
        markDisabled = false
    }, 500)
    setScore()
}

const setQuestionPaper = () => {
    questionBox.innerHTML = ""
    for(let question of questions){
        let questionDiv = document.createElement("div")
        questionDiv.classList.add("right")
        questionBox.append(questionDiv)
        questionDiv.classList.add("question")
        let questionText = document.createElement("div")
        questionDiv.append(questionText)
        questionText.classList.add("text")
        questionText.append(question.text)
        let optionsDiv = document.createElement("div")
        optionsDiv.classList.add("options")
        questionDiv.append(optionsDiv)
        let optionDivs = []
        for(let option of question.options){
            let optionDiv = document.createElement("div")
            optionsDiv.append(optionDiv)
            optionDiv.append(option.text)
            optionDiv.id = option.id
            optionDiv.classList.add("option")
            optionDiv.onclick = answerClick
            optionDivs.push(optionDiv)
        }
        questionElements.push({
            questionDiv,
            questionText,
            optionsDiv,
            optionDivs
        })
    }
    questionElements[0].questionDiv.classList.remove("right")
    questionElements[0].questionDiv.classList.add("center")
}

prevButton.addEventListener("click", gotoPrevious)
nextButton.addEventListener("click", gotoNext)

setScore()
setQuestionPaper()
