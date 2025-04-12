let score = undefined

console.log(typeof score)

let valueInNumber = Number(score)
console.log(typeof valueInNumber)
console.log(valueInNumber)

// NaN is a special value in JavaScript that represents "Not a Number"
// 33 is a number 
// 33abc will give NaN
// true will give 1
// false will give 0
// undefined will give NaN

let isLoggedIn = ""
let BooleanIsLoggedIn = Boolean(isLoggedIn)
console.log(BooleanIsLoggedIn)
// 1 = true
// 0 = false
// "" = false
// "abc" = true

let someNumber = 22
let stringNumber = String(someNumber)
console.log(stringNumber)
console.log(typeof stringNumber)
