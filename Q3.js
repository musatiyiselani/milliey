const check_1_button = document.getElementById("check3");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q3");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "Q4.html";
        return;
    }

    const selected = document.querySelector('input[name="person"]:checked');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Mbuyelo") {
        show.innerHTML = `
        ${selected.value} ✅ <br>
        You Got Her!
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        No!
        <br>
        It is, Mbuyie The Girl's Best Friend!
        `;
    }

    show.style.display = "block";
    show.style.backgroundColor = "bisque";
    show.style.color = "black";

    document.getElementById("picture2").style.filter = "blur(25px)";
    document.getElementById("form3").style.filter = "blur(5px)";
    document.getElementById("Q3").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "bisque";
    check_1_button.style.color = "black";

    checked = true;
});
