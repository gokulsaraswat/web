console.log("\nQuestion 1")
function is_array(obj){
    return Array.isArray(obj);
}
console.log(is_array([2,3,4]))
console.log(is_array("sdfsdfsd"))


console.log("\nQuestion 2")
function array_Clone(array){
    let clone = []
    if(Array.isArray(array))
        array.forEach((elm)=>{
            clone.push(array_Clone(elm))
        })
    else
        return array
    return clone
}
console.log(array_Clone([1, 2, 4, 0]));
console.log(array_Clone([1, 2, [4, 0]]));


console.log("\nQuestion 3")
function first(array, upto){
    if(!upto)
        return array[0]
    if(upto < 0)
        return []
    return array.slice(0,upto)
}
console.log(first([7, 9, 0, -2]));
console.log(first([],3));
console.log(first([7, 9, 0, -2],3));
console.log(first([7, 9, 0, -2],6));
console.log(first([7, 9, 0, -2],-3));


console.log("\nQuestion 4")
function join(array, joiner){
    return array.join(joiner)
}
console.log(join(["Red", "Green", "White", "Black"]))
console.log(join(["Red", "Green", "White", "Black"], ","))
console.log(join(["Red", "Green", "White", "Black"], "+"))


console.log("\nQuestion 5")
function mostFreq(array){
    let freq = {}
    let max = 0
    array.forEach((item)=>{
        if(freq[item])
            freq[item] += 1
        else
            freq[item] = 1

        if(max < freq[item])
            max = freq[item]
    })
    for(let i in freq)
        if(freq[i] === max)
            return i
}
console.log(mostFreq([3, 'a', 'a', 'a', 2, 3, 'a', 3, 'a', 2, 4, 9, 3]))

console.log("\nAll End\n\n")
