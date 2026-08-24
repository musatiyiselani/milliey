const check_1_button = document.getElementById("check2");
const options = document.querySelectorAll("#form2 .opt2");

let selected = null;
let checked = false;


// Select an option
options.forEach(button => {

    button.addEventListener("click", () => {

        // Don't allow another selection after checking
        if (checked) {
            return;
        }

        // Reset all buttons
        options.forEach(option => {
            option.style.backgroundColor = "";
            option.style.color = "";
            option.style.borderColor = "";
        });

        // Store selected button
        selected = button;

        // Show selected button
        selected.style.borderColor = "yellowgreen";
        selected.style.color = "yellowgreen";

        check_1_button.textContent = "Check";
    });

});


// Check answer
check_1_button.addEventListener("click", () => {

    // Go to next question
    if (checked) {
        window.location.href = "Q3.html";
        return;
    }


    // Check if nothing was selected
    if (!selected) {
        check_1_button.textContent = "Please select a person first 👀";
        return;
    }


    // Correct answer
    if (selected.value === "Kuhlula") {

        selected.style.backgroundColor = "green";
        selected.style.color = "white";
        selected.style.borderColor = "white";

        check_1_button.textContent = "Another Message";

    }


    // Wrong answer
    else {

        selected.style.backgroundColor = "red";
        selected.style.color = "black";
        selected.style.borderColor = "black";


        // Show the correct answer
        options.forEach(option => {

            if (option.value === "Kuhlula") {

                option.style.backgroundColor = "yellow";
                option.style.color = "black";
                option.style.borderColor = "black";

            }

        });

        check_1_button.textContent = "Another Message";
    }


    checked = true;
});