const API="http://localhost:3000/expenses";

let chart;

async function loadExpenses(){

const res = await fetch(API);

const data = await res.json();

const list=document.getElementById("list");

list.innerHTML="";

let total=0;

let labels=[];

let values=[];


data.forEach(e=>{

  total += Number(e.amount);

  labels.push(e.title);

  values.push(e.amount);



  const li=document.createElement("li");
  
  li.className = "list-group-item d-flex justify-content-between align-items-center mb-2";
  li.innerHTML=`${e.title} - $${e.amount}
  

  <button class= "btn btn-danger btn-sm" onclick="deleteExpense(${e.id})">Delete</button>`;



  list.appendChild(li);

});



document.getElementById("total").innerText=total;



renderChart(labels,values);
if(values.length > 0){
  document.getElementById("chartBox").style.display="block";
}

}



function renderChart(labels,data){

const ctx=document.getElementById("expenseChart");



if(chart) chart.destroy();



chart=new Chart(ctx,{

  type:'bar',

  data:{

    labels:labels,

    datasets:[{

      label:'Expenses',

      data:data

    }]

  }

});

}



async function addExpense(){

const title=document.getElementById("title").value;

const amount=document.getElementById("amount").value;



if(!title || !amount) return;



await fetch(API,{

  method:"POST",

  headers:{"Content-Type":"application/json"},

  body:JSON.stringify({title,amount})

});



loadExpenses();

}



async function deleteExpense(id){

await fetch(`${API}/${id}`,{method:"DELETE"});



loadExpenses();

}



loadExpenses();
