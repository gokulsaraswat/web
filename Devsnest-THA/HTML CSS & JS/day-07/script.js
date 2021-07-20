console.log("\nQuestion 1")
let student = { name : "David Rayy", sclass : "VI", rollno : 12 };
student.keys = (function(obj){
    let keys = []
    for(let key in obj)
        keys.push(key)
    return keys
})(student)
console.log(student.keys)

console.log("\nQuestion 2")
student = { name : "David Rayy", sclass : "VI", rollno : 12 };
function deleteProperty(obj, prop){
    delete obj[prop]
    console.log(`Deleted ${prop}`)
}
console.log(student)
deleteProperty(student, "rollno")
console.log(student)

console.log("\nQuestion 3")
student = { name : "David Rayy", sclass : "VI", rollno : 12 };
function objectLength(obj){
    let len = 0
    for(let i in obj)
        len++
    return len
}
console.log(objectLength(student))

console.log("\nQuestion 4")
let library = [ { author: 'Bill Gates', title: 'The Road Ahead', readingStatus: true }, { author: 'Steve Jobs', title: 'Walter Isaacson', readingStatus: true }, { author: 'Suzanne Collins', title: 'Mockingjay: The Final Book of The Hunger Games', readingStatus: false }];
function showStatus(obj){
    console.log("\n")
    console.log(`book name: ${obj.title}`)
    console.log(`author name: ${obj.author}`)
    console.log(`reading status: ${obj.readingStatus}`)
}
library.forEach(showStatus)

console.log("\nQuestion 5")
function getVolume(radius, height){
    return (Math.PI * radius * radius * height).toFixed(4)
}
console.log(getVolume(5, 4))

console.log("\nEnd\n\n")
