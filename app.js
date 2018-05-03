//Ui block

var UIController = (function(){
    //Private block!

    //Define an object with css classes of input elements

    var DOMStrings = {
        inputDescription: ".add__description",
        inputType: ".add__type",
        inputValue: ".add__value",
        inputAdd: ".add__btn"
    }

    //Public block - that will be returned after IIFE execution

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            }
        },

        getDOMStrings: function(){
            return DOMStrings;
        }
    }


})();


//Data block
var budgetController = (function(){

    //Make basic data structures to store the information

    var Expense = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Data structure to store all incomes and all expenses

    var data = {
        allItems: {
            inc: [],
            dec: [],
        },

        totals: {
            inc: 0,
            exp: 0,
        }
    }
})();

var controller = (function(budgetCtrl, UICtrl){

    //Initialise all event listeners in one place

    var setUpEventListeners = function() {
        //Get the dom strings reference

        var DOM = UICtrl.getDOMStrings();

        //Add event listeners on clicking enter and add button

        document.querySelector(DOM.inputAdd).addEventListener("click", ctrlAddItem);

        document.addEventListener('keypress', function(event){
           if (event.keyCode === 13 || event.which === 13) {
               ctrlAddItem();
            }
        });
    }



    //Add item function

    var ctrlAddItem = function() {

    //TODO: 1. Get the input field data

    input = UICtrl.getInput();
    console.log(input);

    //TODO: 2. Add the item to the budget controller


    //TODO: 3. Add the item to the UI

    //TODO: 4. Calculate the budhet

    //TODO: 5. Display the budget on the UI


    }


    return {
        init: function() {
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

//Start the app

controller.init();
