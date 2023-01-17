const balanceElement = document.getElementById("balance");
const computersElement = document.getElementById("computers");
const computersDiv = document.getElementById("computersDiv");
const computerSpecs = document.getElementById("specs");
const bankElement = document.getElementById("bank");
const getLoanButton =  document.getElementById("getLoanButton");
const myBalance = document.getElementById("amount");
const bankButton =  document.getElementById("bankButton");
const laptopPrice = document.getElementById("laptopPrice");
const laptopImage = document.getElementById("image");
const moreSpecs = document.getElementById("moreSpecs");
const OutstandingLoanAmount =  document.getElementById("loanAmount");
const OutstandingLoanDiv = document.getElementById("OutstandingLoan");
const payBackLoanButton = document.getElementById("payBackLoan");
const payForWorkAmount =  document.getElementById("payForWork");
const workButton = document.getElementById("workButton");
const buyButton = document.getElementById("buy");
let computers = [];
let payForWork = 0;
let customerLoan = 0;
let computerPrice = 0;
let hasLoan = false;


// Fetching data from API.
fetch("https://hickory-quilled-actress.glitch.me/computers")
    .then(response => response.json())
    .then(data => computers = data)
    .then(computers => addComputersToList(computers))

/**
 * Display the first item "Computer" in the array 
    as default in the "Laptops" and "information" sections.
    * @param {*} computers Object contains all computers from the API
*/
const addComputersToList = (computers) => {
    computers.forEach(item => addComputerToList(item));
    
    computerSpecs.innerText = computers[0].title + "\n" + computers[0].specs;
    moreSpecs.innerText = computers[0].title + "\n" + computers[0].specs;
    laptopImage.src = "https://hickory-quilled-actress.glitch.me/" + computers[0].image;
    laptopPrice.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(parseInt(computers[0].price));
    computerPrice = parseInt(computers[0].price);
}

const addComputerToList = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title + " " + 
    new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(computer.price)));
    computersElement.appendChild(computerElement);
}


/**
 * Display the selected item "Computer" from the array 
    in the "Laptops" section and "information" section.
    * @param {*} e 
*/
const handleComputerListChange = e => {
    
    const selectedComputer = computers[e.target.selectedIndex];
    moreSpecs.innerText = selectedComputer.title + "\n" + selectedComputer.specs;
    computerSpecs.innerText = selectedComputer.title + "\n" + selectedComputer.specs; 
    laptopImage.src = "https://hickory-quilled-actress.glitch.me/" + selectedComputer.image
    laptopPrice.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(parseInt(selectedComputer.price));
    computerPrice = parseInt(selectedComputer.price);

}
/**
 * This function will handle the button "Get loan".
 * The function will check if the user can get a loan or not.
 * The function will prompt messages "info" for the user.
 */
const handleGetLoan = () => {
    let text;
    let loan = prompt("How much you want to loan?");
    loan = parseInt(loan);
    customerLoan = parseInt(loan);
    if(loan <= 0){
        text = "You can not less than 1 Kr."
    } 
    else if (loan > (parseInt(myBalance.innerText) * 2)){
        alert(`You can not loan ${loan}, it is more than the double of your balance ${parseInt(myBalance.innerText) * 2}`);
    }
    else if(loan > 0 && loan <= (parseInt(myBalance.innerText) * 2) && hasLoan === false){
        alert(`Done, you got the loan ${new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(parseInt(parseInt(loan)))}`);
        myBalance.innerText  =  new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(parseInt(myBalance.innerText) + parseInt(loan));
        hasLoan = true; 
        payBackLoanButton.style.display = "block";
        OutstandingLoanAmount.innerText =  new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(customerLoan); 
        OutstandingLoanDiv.style.display =  "block";
        
    }
    else if(hasLoan === true){
        alert("You have already loan you need to pay back first")
    }
    
}
/**
 * This function will handle the "Work" button.
 * For each click the use will get 100 Kr and the
 *  amount will be displayed on the screen
 */
const handleWorkButtonClick = () => {
    payForWork = payForWork + 100
    document.getElementById("payForWork").innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(payForWork);
}


/**
 * This function will handle the "Bank" button.
 * When the user "work" will get money, and if the user click
 * on Bank button the amount of the working money will be moved to the
 * user balance. 
 * If the user has a loan 10% will be removed from the working money 
 * to pay back the loan.
 */
const handleBankButtonClick = () => {
    if(parseInt(payForWork) == 0){
        alert("You do not have money");
    }
    else if(parseInt(payForWork) > 0){
        if(hasLoan  == false){
            myBalance.innerText = parseInt(myBalance.innerText) + parseInt(payForWork) + ",00 Kr";
            payForWork = 0;
            payForWorkAmount.innerText = "0,00 Kr";
        } else if(hasLoan == true){
            let tenProOfPayForWork = ((10*payForWork)/100)
            if(tenProOfPayForWork > customerLoan){
                tenProOfPayForWork = tenProOfPayForWork - customerLoan;
                customerLoan = 0; 
                OutstandingLoanAmount.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(0);
                payBackLoanButton.style.display = "none";
                OutstandingLoanDiv.style.display =  "none";
                myBalance.innerText = parseInt(myBalance.innerText) + parseInt(tenProOfPayForWork) + ",00 Kr";
                payForWork = 0;
                payForWorkAmount.innerText = "0,00 Kr";
            }
            else if(tenProOfPayForWork < customerLoan){
                customerLoan = customerLoan - tenProOfPayForWork;
                payForWork = payForWork - tenProOfPayForWork;
                OutstandingLoanAmount.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(customerLoan);
                myBalance.innerText = parseInt(myBalance.innerText) + parseInt(payForWork) + ",00 Kr";
                payForWork = 0;
                payForWorkAmount.innerText = "0,00 Kr";
            }
        }
    }
}

/**
 * This function will handle the "pay back loan" button.
 * The "Pay back loan" button appears only if the user has a loan. 
 * When the user work will get money and if the user click the 
 * pay back loan button the money will be used to "return" the loan.
 * If the amount of the working money more than the loan, the rest
 * of the money will be add to the user balance.
 */

const handlePayBackLoanButton = () => {
    console.log("this is customer loan " + customerLoan);
    if(customerLoan > 0){
        if(payForWork == 0){
            alert("Yon do not have money, you need to work harder!")
        }
        else if(payForWork >= customerLoan){
            payForWork = payForWork - customerLoan;
            myBalance.innerText = parseInt(myBalance.innerText) + parseInt(payForWork) + ",00 Kr";
            OutstandingLoanAmount.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(0);
            customerLoan = 0;
            payForWork = 0;
            payForWorkAmount.innerText = "0,00 Kr";
            document.getElementById("payForWork").innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(payForWork);
            hasLoan = false;
        }
        else if(payForWork < customerLoan){
            customerLoan = customerLoan - payForWork;
            OutstandingLoanAmount.innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(customerLoan);
            payForWork = 0;
            document.getElementById("payForWork").innerText = new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(payForWork);
        }
    }
    if(hasLoan == false){
        payBackLoanButton.style.display = "none";
        OutstandingLoanDiv.style.display =  "none";
    }
}

/**
 * This function will handle the "Buy" button.
 * If the user have enough money will be able to own the 
 * laptop otherwise will not be able to own the laptop.
 */
const handleBuyButton = () => {
    if(parseInt(myBalance.innerText) >= computerPrice){
        myBalance.innerText = parseInt(myBalance.innerText) - parseInt(computerPrice) + ",00 Kr";
        alert("You own this laptop now.")
        
    }else {
        alert("You cannot afford the laptop.")
    }
}

// Add event listener to the button.
buyButton.addEventListener('click', handleBuyButton);
payBackLoanButton.addEventListener("click", handlePayBackLoanButton);
workButton.addEventListener("click", handleWorkButtonClick);
bankButton.addEventListener("click", handleBankButtonClick);
computersElement.addEventListener("change", handleComputerListChange);
getLoanButton.addEventListener("click", handleGetLoan)
