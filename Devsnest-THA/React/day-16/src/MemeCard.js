"use strict"
import "./MemeCard.css"

let memeList = []

fetch("https://api.imgflip.com/get_memes")
  .then(r => r.json())
  .then(json => {
    memeList = json.data.memes
    getMeme()
  })

const getMeme = () => {
  if (memeList.length === 0)
    return
  const selectedMeme = memeList[Math.floor(Math.random() * memeList.length)]
  console.log(memeList)
  document.querySelector(".meme-card .meme")
    .src = selectedMeme.url
  document.querySelector(".meme-card .title")
    .textContent = selectedMeme.name
}

function MemeCard (){
  return (
    <div className="meme-card">
      <div className="title">MemeCard</div>
      <img className="meme" alt="meme"/>
      <button onClick={getMeme}>Get Another</button>
    </div>
  )
}

export default MemeCard
