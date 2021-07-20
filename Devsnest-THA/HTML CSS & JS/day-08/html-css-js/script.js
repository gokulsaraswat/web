let dots = document.querySelectorAll(".dot")
dots.forEach((dot) => {
    dot.addEventListener("click", (event) => {
        event.target.classList.toggle("black")
    })
})