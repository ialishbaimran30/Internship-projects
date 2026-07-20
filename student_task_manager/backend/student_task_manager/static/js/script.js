const deleteButtons = document.querySelectorAll("a[href*='delete']");

deleteButtons.forEach(button => {

    button.addEventListener("click", function(event){

        const confirmDelete = confirm("Are you sure you want to delete this task?");

        if(!confirmDelete){

            event.preventDefault();

        }

    });

});