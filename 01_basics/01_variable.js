const accountId = "12345";
let accountEmail = "abhigyan@gmail.com";
let accountPassword = "1234567890"; 
accountCity = "bhopal";   //do not prefer this way of declaring variables,  

accountEmail = "231@gmail.com";
accountPassword = "ewpass";
accountCity = "indore"; 

/*
do not use var in modern javascript
use let and const instead
const is used for constant variables
let is used for variables that can be changed
*/

// Pass an object to console.table()
console.table({accountEmail, accountPassword, accountCity});


