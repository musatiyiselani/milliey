const check_1_button = document.getElementById("check4");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q4");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "Q5.html";
        return;
    }

    const selected = document.querySelector('input[name="person"]:checked');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Lunghile") {
        show.innerHTML = `
        ${selected.value} ✅ <br>
        You got him
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        Yeah nerh??
        <br>
        It's Lunghi! 
        `;
    }

    show.style.display = "block";
    show.style.backgroundColor = "pink"
    show.style.color = "white";

    document.getElementById("vid2").style.filter = "blur(25px)";
    document.getElementById("form4").style.filter = "blur(5px)";
    document.getElementById("Q4").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "pink";
    check_1_button.style.color = "white";

    checked = true;
});
