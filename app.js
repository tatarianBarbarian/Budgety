var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function() {

        //TODO: 1. Get the input field data



        //TODO: 2. Add the item to the budget controller

        //TODO: 3. Add the item to the UI

        //TODO: 4. Calculate the budhet

        //TODO: 5. Display the budget on the UI

    }

    document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);

    document.addEventListener('keypress', function(event){
       if (event.keyCode === 13 || event.which === 13) {
           ctrlAddItem();
       }
    });

})(budgetController, UIController);


var UIController = (function(){

})();


var budgetController = (function(){

})();
