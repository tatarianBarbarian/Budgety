//Ui block API

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
        budgetValue: ".budget__value",
        budgetInc: ".budget__income--value",
        budgetExp: ".budget__expenses--value",
        expPercentage: ".budget__expenses--percentage",
        container: '.container',
        expItemPercentage: ".item__percentage",
        dateLabel: ".budget__title--month",
    }

    var formatNumber = function(num, type){
            var numSt, anotherStr, numSplit,int,dec, sign;

            num = Math.abs(num);
            numSt = num.toFixed(2);

            numSplit = numSt.split(".");

            int = numSplit[0];
            dec = numSplit[1];

            anotherStr = "";

            var razr = 0;

            for (var i = int.length - 1; i >= 0; i--){
              if(razr < 2) {
                anotherStr = int[i] + anotherStr;
                razr++;
              } else {
                anotherStr = int[i] + anotherStr;
                if (i !==0) {
                  anotherStr = ',' + anotherStr;
                }
                razr =0;
              }

            }

            type === 'inc' ? sign = '+' : sign = '-';

            anotherStr = sign + ' ' + anotherStr + "." + dec;

            return anotherStr;

            }
    //Public block - that will be returned after IIFE execution

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            }
        },

        addListItem: function(obj, type){
            var html, newHTML, element;

            //HTML Template

            if(type === 'exp') {
                element = DOMStrings.expensesContainter;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__percentage"> 0%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'inc') {
                element = DOMStrings.incomeContainter;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }

            //Fill template with object data

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value,type));

            //Place the element into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },
        deleteListItem: function(selectorID){
            var el;

            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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
        displayBudget: function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMStrings.budgetValue).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.budgetInc).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMStrings.budgetExp).textContent = formatNumber(obj.totalExp,'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.expPercentage).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.expPercentage).textContent = "--"
            }
        },
        displayPercentages: function(percentages){
            var fields = document.querySelectorAll(DOMStrings.expItemPercentage);

            var nodeListForeach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            }

            nodeListForeach(fields, function(cur, index) {
                if (percentages[index] > 0) {
                    cur.textContent = percentages[index] + "%";
                } else  {
                    cur.textContent = "--";
                }
            })
        },
        displayMonth: function(){
            var year,month,months, now;

            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            month = now.getMonth();

            year = now.getFullYear();

            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    }


})();


//Data block API
var budgetController = (function(){

    //Make basic data structures to store the information

    var Expense = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calculatePercentage = function(totalInc){
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id,description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Calculate total

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });

        data.totals[type] = sum;
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
        },

        budget: 0,
        percentage: -1,
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

        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the total budget
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate total percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: function(){
            //Calculate percentage in each expense relatively to entire income

            data.allItems.exp.forEach(function(cur){
                return cur.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPerc;

            allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },
        deleteItem: function(type, id){
            var ids,index;

            ids = data.allItems[type].map(function(cur){
               return cur.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index,1);
            }
        },
        getBudget: function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
            }
        },

        testing: function(){
            console.log(data);
        }
    }
})();

//Entire app controller

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

        document.querySelector(DOM.container).addEventListener('click', ctrlRemoveItem);
    }


    //Updating budget

    var updateBudget = function() {

        //Calculate budget

        budgetCtrl.calculateBudget();

        //Update budget

        var budget = budgetCtrl.getBudget();

        //Update UI

        UICtrl.displayBudget(budget);

    }

    //Updating percentages

    var updatePercentages = function() {
        //1 Calculate percentages

        budgetCtrl.calculatePercentages();

        //2 Get percentages

        var percentages = budgetCtrl.getPercentages();

        //3 Update percentages UI

        UICtrl.displayPercentages(percentages);

    }

    //Add item function

    var ctrlAddItem = function() {

        var input, newItem;

        //1. Get the input field data and clear fields

        input = UICtrl.getInput();

        //Check if fields fiiled correctly

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){

            UICtrl.clearFields();

            //2. Add the item to the budget controller

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI

            UICtrl.addListItem(newItem, input.type);

            //4. Calculate the budget

            updateBudget();

            //5. Percentages
            updatePercentages();
        }

    }

    var ctrlRemoveItem = function(event){
        var targetID, splitID, type, ID;
        //Get target ID

        targetID = event.target.parentNode.parentNode.parentNode.id;

        if(targetID){
            splitID = targetID.split('-');

            //Get a data
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //Delete from data object
            budgetCtrl.deleteItem(type, ID);

            //Delete from UI
            UICtrl.deleteListItem(targetID);

            //Update the budget
            updateBudget();

            //Update percentages
            updatePercentages();
        }



    }



    return {
        init: function() {
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1,
                totalInc: 0,
                totalExp: 0,
            })
            setUpEventListeners();
            UICtrl.displayMonth();

        }
    }

})(budgetController, UIController);

//Start the app

controller.init();
