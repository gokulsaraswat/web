window.onload = () => {
    const buttons = document.querySelectorAll("button")
    for(let index in buttons)
        buttons[index].addEventListener("click", () => {
            const n1 = parseFloat(document.getElementById("number1").value)
            const n2 = parseFloat(document.getElementById("number2").value)
            let ans = null
            switch (index){
                case '0':
                    ans = n1 + n2
                    break
                case '1':
                    ans = n1 - n2
                    break
                case '2':
                    ans = n1 * n2
                    break
                case '3':
                    ans = n1 / n2
                    break
            }
            document.querySelector("output")
                .innerHTML = `The answer is ${ans}`;
        }, true)
}
