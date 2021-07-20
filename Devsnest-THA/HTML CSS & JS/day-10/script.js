let cards = document.querySelector(".cards")
let statusDiv = document.querySelector(".status")

let noOfCards = 6 * 2

const createEle = (tag, cls) => {
    let ele = document.createElement("div")
    ele.className = cls
    return ele
}

let images = [];
for(let i = 0; i < noOfCards/2; i++){
    images.push("img"+(i+1))
    images.push("img"+(i+1))
}

const getRandImage = () => {
    let i = Math.floor(Math.random() * images.length)
    return images.splice(i, 1)[0]
}

let imageMap = {}

for(let i = 0; i < noOfCards; i++){
    imageMap["id" + (i+1)] = getRandImage()
}

const onGameFinished = () => {
    setTimeout(()=>{
        alert("You Finished the game")
    }, 1000)
}

let flippedCard = null
let totalPoints = 0
let cardsShowing = false
let cardFlipsCount = 0

function flipCard(){
    if(cardsShowing)
        return;
    if(this === flippedCard)
        return;
    if(this.cardMatched === true)
        return
    console.log(this.id)
    this.classList.toggle("clicked")
    cardFlipsCount++
    if(flippedCard){
        cardsShowing = true
        if(imageMap[flippedCard.id] === imageMap[this.id]){
            this.cardMatched = true
            flippedCard.cardMatched = true
            totalPoints++
            flippedCard = null
            cardsShowing = false
        }
        else{
            setTimeout(() => {
                this.classList.toggle("clicked")
                flippedCard.classList.toggle("clicked")
                flippedCard = null
                cardsShowing = false
            }, 1000)
        }
    }
    else
        flippedCard = this

    if(noOfCards === totalPoints*2)
        onGameFinished()

    statusDiv.innerHTML = ""
    statusDiv.append(`Total Moves ${cardFlipsCount}, Total Points ${totalPoints}`)
}

for(let i = 0; i < noOfCards; i++){
    let card = createEle("div", "card")
    cards.append(card)

    let innerCard = createEle("div", "card-inner")
    card.append(innerCard)

    innerCard.id = "id" + (i+1)
    innerCard.addEventListener("click", flipCard)

    let cardFront = createEle("div", "card-front")
    innerCard.append(cardFront)
    let cardBack = createEle("div", "card-back")
    innerCard.append(cardBack)
    cardBack.style.backgroundImage = "url(images/" + imageMap["id" + (i+1) ]+ ".svg)"
        // `url(${imageMap[`id${i+1}`]}.svg)`
}
// cards.style.maxWidth = `${noOfCards * 191 / 4}px`
console.log(images)
statusDiv.append(`Total Moves ${cardFlipsCount}, Total Points ${totalPoints}`)
