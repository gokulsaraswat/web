setInterval(() => {
    let date = new Date()
    let second = date.getSeconds()
    second += (date.getMilliseconds()%1000)/1000
    let minute = date.getMinutes() + second/60
    let hour = date.getHours()%12 + minute/60

    document.body.style.setProperty('--hour', `${hour}`);
    document.body.style.setProperty('--minute', `${minute}`);
    document.body.style.setProperty('--second', `${second}`);
}, 50)
