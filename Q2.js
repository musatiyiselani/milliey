const check_1_button = document.getElementById("check2");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q2");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "Q3.html";
        return;
    }

    const selected = document.querySelector('input[name="person"]:checked');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Musa") {
        show.innerHTML = `
        ${selected.value} ✅ <br>
        Obviously
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        Nah??
        <br>
        It can only be -- Musa
        `;
    }

    show.style.display = "block";
    show.style.backgroundColor = "bisque"
    show.style.color = "brown"

    document.getElementById("vid1").style.filter = "blur(25px)";
    document.getElementById("form2").style.filter = "blur(5px)";
    document.getElementById("Q2").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "bisque";
    check_1_button.style.color = "brown";

    checked = true;
});
