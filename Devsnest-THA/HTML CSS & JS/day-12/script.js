let listedAdd = document.querySelector(".container .listed .heading span + span")

let lists = document.querySelectorAll(".container .list")

let selectedItem = null;

listedAdd.addEventListener("click", (event)=>{
    let div = document.createElement("div")
    let data = prompt("Enter your task")
    if(!data)
        return
    lists[0].append(div)
    div.textContent = data
    div.draggable = true
    div.className = "item"
    div.addEventListener("dragstart", () => {
        selectedItem = div
    })
    let time = Date.now().toString()
    let allData = JSON.parse(localStorage.getItem("listed") || "{}")
    allData[time] = data
    localStorage.setItem("listed", JSON.stringify(allData))
    div.id = time
})

for(let list of lists){
    list.addEventListener("dragover", (event) => {
        event.preventDefault()
    })
    list.addEventListener("drop", (event) => {
        if(list === selectedItem.parentNode)
            return
        console.log(selectedItem)
        let condition = selectedItem.parentNode.id
        let allData = JSON.parse(localStorage.getItem(condition) || "{}")
        let data = allData[selectedItem.id] || {}

        selectedItem.parentNode.removeChild(selectedItem)
        list.append(selectedItem)

        if(allData[selectedItem.id])
            delete allData[selectedItem.id]
        console.log(data)
        localStorage.setItem(condition, JSON.stringify(allData))

        allData = JSON.parse(localStorage.getItem(list.id) || "{}")
        allData[selectedItem.id] = data
        localStorage.setItem(list.id, JSON.stringify(allData))
    })

    let allData = JSON.parse(localStorage.getItem(list.id) || "{}")
    for(let keyId in allData){
        console.log(keyId)
        // console.log(keyId, allData[keyId]);
    }
}

//restore previous data
for(let list of lists){
    let condition = list.id
    let allData = JSON.parse(localStorage.getItem(condition) || "{}")
    console.log(allData)
    for(let key in allData){
        let div = document.createElement("div")
        list.append(div)
        div.textContent = allData[key]
        div.draggable = true
        div.className = "item"
        div.addEventListener("dragstart", () => {
            selectedItem = div
        })
        div.id = key
        console.log(key)
    }
    console.log(list)
}
