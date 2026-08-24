const check_1_button = document.getElementById("check5");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q5");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "Q6.html";
        return;
    }

    const selected = document.querySelector('input[name="person"]:checked');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Ntsako") {
        show.innerHTML = `
        ${selected.value} ✅ <br>
        Yes, you got her!
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        No no no no no??
        <br>
        It is -- Ntsako
        `;
    }

    show.style.display = "block";
    show.style.backgroundColor = "sandybrown"
    show.style.color = "white"

    document.getElementById("picture3").style.filter = "blur(25px)";
    document.getElementById("form5").style.filter = "blur(5px)";
    document.getElementById("Q5").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "sandybrown";
    check_1_button.style.color = "white";

    checked = true;
});
