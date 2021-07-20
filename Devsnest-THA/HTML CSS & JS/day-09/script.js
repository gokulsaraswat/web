let seats = document.querySelector(".seats-inner")
let bookedCount = 0;
let remainingCount = 36;

bookedSeats.textContent = bookedCount
remainingSeats.textContent = remainingCount

for(let i = 0; i < remainingCount; i++){
    let seat = document.createElement("div")
    seat.className = "seat";
    seats.append(seat)
    seat.addEventListener("click", (event) => {
        seat.classList.toggle("booked")
        seat.classList.contains("booked") ? (() => {
            bookedCount++;
            remainingCount--;
        })():(() => {
            bookedCount--;
            remainingCount++;
        })()
        bookedSeats.textContent = bookedCount
        remainingSeats.textContent = remainingCount
    })
}
