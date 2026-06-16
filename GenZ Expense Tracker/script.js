/* =========================

FIREBASE IMPORTS

========================= */

import { initializeApp }

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

getAuth,

createUserWithEmailAndPassword,

signInWithEmailAndPassword,

signOut,

onAuthStateChanged

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

getFirestore,

collection,

addDoc,

getDocs,

deleteDoc,

updateDoc,

doc,

query,

where

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



/* =========================

FIREBASE CONFIG

========================= */


const firebaseConfig = {

  apiKey: "AIzaSyA6YFu37Xafv9NtxPUNQjslksU4f-wuigI",

  authDomain: "expense-tracker-489da.firebaseapp.com",

  projectId: "expense-tracker-489da",

  storageBucket: "expense-tracker-489da.firebasestorage.app",

  messagingSenderId: "421742175592",

  appId: "1:421742175592:web:0580ec7ffcab9a759062dd",

  measurementId: "G-4V2SR3QQYF"

};


const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const db = getFirestore(app);



/* =========================

GLOBAL VARIABLES

========================= */


let currentUser = null;


let transactions = [];

let pieChart;


function updatePieChart() {

    const categoryData = {};

    transactions.forEach(item => {

        if (item.type === "Expense") {

            if (categoryData[item.category]) {

                categoryData[item.category] += Number(item.amount);

            }

            else {

                categoryData[item.category] = Number(item.amount);

            }

        }

    });

    const labels = Object.keys(categoryData);

    const values = Object.values(categoryData);

    const ctx = document.getElementById("pieChart");

    if (pieChart) {

        pieChart.destroy();

    }

    pieChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [

                {

                    data: values,

                    backgroundColor: [

                        "#ff6b81",

                        "#6c5ce7",

                        "#00cec9",

                        "#fdcb6e",

                        "#55efc4",

                        "#74b9ff"

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "bottom"

                }

            }

        }

    });

}

/* =========================

SIGN UP

========================= */


window.signup =

async () => {


const email =

document

.getElementById("email")

.value;



const password =

document

.getElementById("password")

.value;



if(

email==="" ||

password===""

){

alert(

"Enter Email & Password"

);

return;

}



try{


await

createUserWithEmailAndPassword(

auth,

email,

password

);



alert(

"Signup Successful 🎉"

);



}catch(error){


alert(

error.message

);


}


};




/* =========================

LOGIN

========================= */


window.login =

async ()=>{


const email =

document

.getElementById("email")

.value;



const password =

document

.getElementById("password")

.value;



try{


await

signInWithEmailAndPassword(

auth,

email,

password

);



alert(

"Login Successful 🎉"

);



}catch(error){


alert(

error.message

);


}



};




/* =========================

LOGOUT

========================= */


window.logout =

async ()=>{


await

signOut(auth);


alert(

"Logged Out"

);


};




/* =========================

AUTH STATE

========================= */


onAuthStateChanged(

auth,

(user)=>{


if(user){


currentUser = user;



document

.getElementById(

"userEmail"

)

.innerText =

user.email;



loadTransactions();



}else{


currentUser = null;



document

.getElementById(

"userEmail"

)

.innerText =

"Not Logged In";



transactions=[];



renderTransactions();


}


}

);




/* =========================

LOGOUT BUTTON

========================= */


document

.getElementById(

"logoutBtn"

)

.addEventListener(

"click",

logout

);

// next part  ADD TRANSACTION



/* =========================
   ADD TRANSACTION
========================= */

window.addTransaction = async () => {

  if (!currentUser) {

    alert("Please Login First");

    return;

  }

  const type =
    document.getElementById("type").value;

  const amount =
    Number(
      document.getElementById("amount").value
    );

  const category =
    document.getElementById("category").value;

  const date =
    document.getElementById("date").value;

  const note =
    document.getElementById("note").value;


  if (amount <= 0 || date === "") {

    alert("Please Fill All Fields");

    return;

  }


  try {

    await addDoc(

      collection(
        db,
        "transactions"
      ),

      {

        uid:
        currentUser.uid,

        type,

        amount,

        category,

        date,

        note,

        createdAt:

        Date.now()

      }

    );


    alert(

      "Transaction Added ✅"

    );


    document
    .getElementById(
      "amount"
    )
    .value = "";


    document
    .getElementById(
      "note"
    )
    .value = "";


    loadTransactions();


  }

  catch (error) {

    alert(

      error.message

    );

  }

};




/* =========================
   LOAD TRANSACTIONS
========================= */


async function loadTransactions() {


  if (!currentUser)

  return;


  transactions = [];


  const q = query(

    collection(

      db,

      "transactions"

    ),

    where(

      "uid",

      "==",

      currentUser.uid

    )

  );


  const querySnapshot =

    await getDocs(q);



  querySnapshot.forEach(

    (docItem) => {

      transactions.push({

        id:

        docItem.id,

        ...docItem.data()

      });

    }

  );


  renderTransactions();

  updateSummary();
  updatePieChart();
  

}


// Part 2 of the code is missing, but I can help you with the rest of the code if you want.
//  Do you want me to continue?



 /* =========================
   RENDER TRANSACTIONS
========================= */

window.renderTransactions = function () {

let filtered = [...transactions];


// SEARCH

const search =

document

.getElementById("search")

.value

.toLowerCase();


filtered = filtered.filter(

item =>

item.note

.toLowerCase()

.includes(search)

);




// CATEGORY FILTER

const category =

document

.getElementById(

"filterCategory"

)

.value;


if(

category !==

"All Categories"

){

filtered =

filtered.filter(

item =>

item.category

===

category

);

}




// MONTH FILTER

const month =

document

.getElementById(

"filterMonth"

)

.value;


if(

month !== "All"

){

filtered =

filtered.filter(

item =>

new Date(

item.date

)

.getMonth()

==

month

);

}




// YEAR FILTER

const year =

document

.getElementById(

"filterYear"

)

.value;


if(

year !==

"All"

){

filtered =

filtered.filter(

item =>

new Date(

item.date

)

.getFullYear()

==

year

);

}





const list =

document

.getElementById(

"transactionList"

);


list.innerHTML = "";



filtered.forEach(

item => {

const li =

document

.createElement(

"li"

);



li.className =

item.type ===

"Income"

?

"income-item"

:

"expense-item";



li.innerHTML = `

<div>

<h3>

${item.category}

</h3>

<p>

${item.note}

</p>

<p>

${item.date}

</p>

</div>


<div>

<h2>

${

item.type==="Income"

?

"+"

:

"-"

}

₹${item.amount}

</h2>


<button

onclick="

editTransaction(

'${item.id}'

)"

>

Edit

</button>


<button

onclick="

deleteTransaction(

'${item.id}'

)"

>

Delete

</button>

</div>

`;



list

.appendChild(

li

);

}

);

};





/* =========================
   SUMMARY CARDS
========================= */


function updateSummary(){


let income = 0;


let expense = 0;



transactions.forEach(

item=>{


if(

item.type===

"Income"

){

income +=

item.amount;

}

else{

expense +=

item.amount;

}

}

);



const balance =

income

-

expense;



document

.getElementById(

"income"

)

.innerText =

"₹"

+

income;



document

.getElementById(

"expense"

)

.innerText =

"₹"

+

expense;



document

.getElementById(

"balance"

)

.innerText =

"₹"

+

balance;


}


// last part of the code done 


/* =========================
   DELETE TRANSACTION
========================= */

window.deleteTransaction = async (id) => {

try{

await deleteDoc(

doc(

db,

"transactions",

id

)

);

loadTransactions();

}

catch(error){

alert(error.message);

}

};





/* =========================
   EDIT TRANSACTION
========================= */

window.editTransaction = async (id) => {

const item =

transactions.find(

t => t.id === id

);


const newNote =

prompt(

"Edit Note",

item.note

);


if(

newNote === null ||

newNote === ""

)

return;



try{

await updateDoc(

doc(

db,

"transactions",

id

),

{

note:

newNote

}

);


loadTransactions();


}

catch(error){

alert(

error.message

);

}

};






/* =========================
   DARK MODE
========================= */

const themeBtn =

document

.getElementById(

"themeBtn"

);



if(

localStorage.getItem(

"theme"

)

===

"dark"

){

document.body

.classList

.add(

"dark"

);

}




themeBtn

.addEventListener(

"click",

()=>{


document.body

.classList

.toggle(

"dark"

);



if(

document.body

.classList

.contains(

"dark"

)

){

localStorage.setItem(

"theme",

"dark"

);

}

else{

localStorage.setItem(

"theme",

"light"

);

}

}

);







/* =========================
   EXPORT PDF
========================= */


window.downloadPDF =

function(){


const {

jsPDF

}

=

window.jspdf;



const pdf =

new jsPDF();



let y = 20;



pdf.text(

"Expense Tracker",

20,

10

);




transactions.forEach(

item=>{


pdf.text(

`${item.type}

| ₹${item.amount}

| ${item.category}

| ${item.note}

| ${item.date}`,

10,

y

);


y += 10;


}

);




pdf.save(

"ExpenseReport.pdf"

);

};






/* =========================
   FILTER EVENTS
========================= */

document

.getElementById(

"filterCategory"

)

.addEventListener(

"change",

renderTransactions

);



document

.getElementById(

"filterMonth"

)

.addEventListener(

"change",

renderTransactions

);



document

.getElementById(

"filterYear"

)

.addEventListener(

"change",

renderTransactions

);
