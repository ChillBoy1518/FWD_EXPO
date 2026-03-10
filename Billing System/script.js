/* CO5: Authentication check using LocalStorage */

if(localStorage.getItem("loggedIn")!=="true"){
window.location.href="login.html"
}

let items=[]

/* CO3: Restaurant Menu Data */

let menu={
"Idli":30,"Vada":25,"Masala Dosa":70,"Plain Dosa":50,
"Paneer Dosa":100,"Cheese Dosa":110,"Set Dosa":60,
"Curd Rice":60,"Lemon Rice":60,"Veg Biryani":120,

"Chicken Biryani":180,"Chicken Dum Biryani":200,
"Mutton Biryani":250,"Egg Biryani":140,"Fish Biryani":220,

"Chicken Curry":180,"Chicken Fry":190,"Chicken 65":170,
"Mutton Curry":260,"Mutton Fry":280,
"Fish Curry":220,"Fish Fry":210,
"Prawns Curry":240,"Prawns Fry":250,

"Chicken Tandoori":240,"Chicken Grill":250,
"Chicken Wings":180,"Chicken Lollipop":180,

"Egg Omelette":40,"Boiled Egg":20,

"Filter Coffee":30,"Tea":20,"Lassi":60,"Buttermilk":25
}

/* CO4: Menu Categories */

let categories={
veg:["Idli","Vada","Masala Dosa","Plain Dosa","Paneer Dosa","Cheese Dosa","Set Dosa","Curd Rice","Lemon Rice","Veg Biryani"],
nonveg:["Chicken Curry","Chicken Fry","Chicken 65","Mutton Curry","Mutton Fry","Fish Curry","Fish Fry","Prawns Curry","Prawns Fry"],
biryani:["Chicken Biryani","Chicken Dum Biryani","Mutton Biryani","Egg Biryani","Fish Biryani","Veg Biryani"],
drinks:["Filter Coffee","Tea","Lassi","Buttermilk"]
}

/* CO4: Load Menu */

function loadMenu(){
filterMenu("all")
}

/* CO4: Filter Menu */

function filterMenu(type){

let dropdown=document.getElementById("name")
dropdown.innerHTML='<option value="">Select Item</option>'

let itemsToShow=[]

if(type==="all"){
itemsToShow=Object.keys(menu)
}else{
itemsToShow=categories[type]
}

itemsToShow.forEach(item=>{
let option=document.createElement("option")
option.value=item
option.text=item+" - ₹"+menu[item]
dropdown.appendChild(option)
})
}

/* CO4: Theme Toggle using DOM */

function toggleTheme(){
document.body.classList.toggle("dark")
}

/* CO4: Navigation Functions */

function showDashboard(){
document.getElementById("dashboard").style.display="block"
document.getElementById("billing").style.display="none"
document.getElementById("invoices").style.display="none"
updateDashboard()
}

function showBilling(){
document.getElementById("dashboard").style.display="none"
document.getElementById("billing").style.display="block"
document.getElementById("invoices").style.display="none"
}

function showInvoices(){
document.getElementById("dashboard").style.display="none"
document.getElementById("billing").style.display="none"
document.getElementById("invoices").style.display="block"
loadInvoices()
}

/* CO3: Add Item Logic */

function addItem(){

let name=document.getElementById("name").value
let qty=parseInt(document.getElementById("qty").value)

if(!name || !qty){
alert("Select item and quantity")
return
}

let price=menu[name]

items.push({name,price,qty})

updateTable()
calculateTotal()
}

/* CO4: Dynamic Table Update */

function updateTable(){

let table=document.getElementById("billTable")
table.innerHTML=""

items.forEach((item,index)=>{

table.innerHTML+=`
<tr>
<td>${item.name}</td>
<td>${item.price}</td>
<td>${item.qty}</td>
<td>${item.price*item.qty}</td>
<td><button onclick="deleteItem(${index})">Delete</button></td>
</tr>
`
})
}

function deleteItem(index){
items.splice(index,1)
updateTable()
calculateTotal()
}

/* CO3: Billing Calculation */

function calculateTotal(){

let subtotal=0

items.forEach(i=>subtotal+=i.price*i.qty)

let tax=subtotal*0.05
let discount=parseFloat(document.getElementById("discount").value)||0

let finalTotal=subtotal+tax-discount

document.getElementById("subtotal").innerText=subtotal
document.getElementById("tax").innerText=tax
document.getElementById("grandTotal").innerText=finalTotal
}

/* CO3: Invoice Number Generator */

function getInvoiceNumber(){

let num=localStorage.getItem("invoiceNumber")||1000
num++
localStorage.setItem("invoiceNumber",num)

return num
}

/* CO5: Save Invoice */

function saveBill(){

let total=parseFloat(document.getElementById("grandTotal").innerText)
let customer=document.getElementById("customer").value
let invoice=getInvoiceNumber()
let payment=document.getElementById("payment").value

let today=new Date().toLocaleDateString()

let invoices=JSON.parse(localStorage.getItem("invoices"))||[]

invoices.push({invoice,customer,total,date:today,payment})

localStorage.setItem("invoices",JSON.stringify(invoices))

items=[]
updateTable()
calculateTotal()

updateDashboard()
loadInvoices()

alert("Bill Saved")
}

/* CO5: Print Bill Feature */

function printBill(){

let total=document.getElementById("grandTotal").innerText

let bill="SIZZLE SPACE\n\n"

items.forEach(item=>{
bill+=item.name+" x"+item.qty+" ₹"+(item.price*item.qty)+"\n"
})

bill+="\nTotal ₹"+total

let win=window.open("","","width=300,height=400")
win.document.write("<pre>"+bill+"</pre>")
win.print()
}

/* CO5: PDF Invoice Generation */

function downloadPDF(){

const { jsPDF } = window.jspdf

let doc=new jsPDF()

doc.text("Sizzle Space Invoice",20,20)

let y=40

items.forEach(item=>{
doc.text(item.name+" x"+item.qty+" = ₹"+(item.price*item.qty),20,y)
y+=10
})

doc.text("Total ₹"+document.getElementById("grandTotal").innerText,20,y+10)

doc.save("invoice.pdf")
}

/* CO4: Load Invoices */

function loadInvoices(){

let invoices=JSON.parse(localStorage.getItem("invoices"))||[]

displayInvoices(invoices)
}

/* CO4: Display Invoice Table */

function displayInvoices(data){

let table=document.getElementById("invoiceTable")
table.innerHTML=""

data.forEach((inv,index)=>{

table.innerHTML+=`
<tr>
<td>${inv.invoice}</td>
<td>${inv.customer}</td>
<td>₹${inv.total}</td>
<td>${inv.date}</td>
<td>${inv.payment}</td>
<td><button onclick="deleteInvoice(${index})">Delete</button></td>
</tr>
`
})
}

/* CO4: Search Invoice */

function searchInvoice(){

let text=document.getElementById("searchInvoice").value

let invoices=JSON.parse(localStorage.getItem("invoices"))||[]

let filtered=invoices.filter(inv=>inv.invoice.toString().includes(text))

displayInvoices(filtered)
}

/* CO4: Delete Invoice */

function deleteInvoice(index){

let invoices=JSON.parse(localStorage.getItem("invoices"))||[]

invoices.splice(index,1)

localStorage.setItem("invoices",JSON.stringify(invoices))

loadInvoices()
}

/* CO4: Dashboard Statistics */

function updateDashboard(){

let invoices=JSON.parse(localStorage.getItem("invoices"))||[]

let total=0
let todayTotal=0

let today=new Date().toLocaleDateString()

invoices.forEach(i=>{
total+=i.total
if(i.date===today){
todayTotal+=i.total
}
})

document.getElementById("totalInvoices").innerText=invoices.length
document.getElementById("totalSales").innerText=total
document.getElementById("todaySales").innerText=todayTotal
}

/* CO5: Logout */

function logout(){
localStorage.removeItem("loggedIn")
window.location.href="login.html"
}

updateDashboard()

window.onload=function(){
loadMenu()
}