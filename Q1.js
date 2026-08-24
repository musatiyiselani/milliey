const check_1_button = document.getElementById("check1");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q1");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "Q2.html";
        return;
    }

    const selected = document.querySelector('.opt1');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Fortune") {
        show.innerHTML = `
        ${selected.value} ✅ <br>
        You Got Her!
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        Really??
        <br>
        The message is from -- Fortune
        `;
    }

    show.style.display = "block";
    show.style.backgroundColor = "yellowgreen";
    show.style.color = "white";

    document.getElementById("picture1").style.filter = "blur(25px)";
    document.getElementById("form1").style.filter = "blur(5px)";
    document.getElementById("Q1").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "yellowgreen";
    check_1_button.style.color = "white";

    checked = true;
});
