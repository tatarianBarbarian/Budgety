//Ui block

var UIController = (function(){
    //Private block!

    //Define an object with css classes of input elements

    var DOMStrings = {
        inputDescription: ".add__description",
        inputType: ".add__type",
        inputValue: ".add__value",
        inputAdd: ".add__btn",
        incomeContainter: ".income__list",
        expensesContainter: ".expenses__list",
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

        addListItem: function(obj, type){
            var html, newHTML, element;

            //HTML Template

            if(type === 'exp') {
                element = DOMStrings.expensesContainter;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage"> 0%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'inc') {
                element = DOMStrings.incomeContainter;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Fill template with object data

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            //Place the element into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        clearFields: function(){
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current){
                current.value = "";
            });

            fieldsArr[0].focus();
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
            exp: [],
        },

        totals: {
            inc: 0,
            exp: 0,
        }
    }

    return {
        addItem: function(type, des, val) {

            //Define a types that'll be there

            var newItem, ID;

            //Define an ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            //Create a new item which is expense or income

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //Push the new iten into the array of items

            data.allItems[type].push(newItem);

            //Return the new element

            return newItem;
        },

        testing: function(){
        console.log(data);
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

        var input, newItem;

        //1. Get the input field data and clear fields

        input = UICtrl.getInput();
        UICtrl.clearFields();
        //2. Add the item to the budget controller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //FUTURE: 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //FUTURE: 4. Calculate the budhet

        //FUTURE: 5. Display the budget on the UI


    }


    return {
        init: function() {
            setUpEventListeners();
        }
    }

})(budgetController, UIController);

//Start the app

controller.init();
