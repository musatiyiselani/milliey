const check_1_button = document.getElementById("check6");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q6");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "last.html";
        return;
    }

    const selected = document.querySelector('input[name="person"]:checked');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Pfumi") {
        show.innerHTML = `
        ${selected.value} ✅ <br>
        You got her!
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        N0000000000000000!!
        <br>
        It's Faith
        `;
    }

    show.style.display = "block";
    show.style.backgroundColor = "sandybrown"
    show.style.color = "white";

    document.getElementById("picture4").style.filter = "blur(25px)";
    document.getElementById("form6").style.filter = "blur(5px)";
    document.getElementById("Q6").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "sandybrown";
    check_1_button.style.color = "white";

    checked = true;
});
