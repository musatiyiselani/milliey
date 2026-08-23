const check_1_button = document.getElementById("check1");
const show = document.querySelector(".check_screen");
const msg = document.getElementById("Q2");

let checked = false;

check_1_button.addEventListener("click", () => {

    if (checked) {
        window.location.href = "Q1.html";
        return;
    }

    const selected = document.querySelector('input[name="person"]:checked');

    if(!selected) {
        console.log("Select a person")
        return;
    }

    if (selected.value === "Mbuyelo") {
        show.innerHTML = `
        ${selected.value} ✅
        You Got It😂
        It's Obviously The Girl's Bestfriend 💝
        `;
    } else {
        show.innerHTML = `
        ${selected.value} ❌👀?
        Really??
        ${msg.innerHTML} -- Mbuyelo
        `;
    }

    show.style.display = "block";

    document.getElementById("vid1").style.filter = "blur(25px)";
    document.getElementById("form1").style.filter = "blur(5px)";
    document.getElementById("Q2").style.filter = "blur(5px)";

    check_1_button.textContent = "Another Message";
    check_1_button.style.backgroundColor = "bisque";
    check_1_button.style.color = "brown";

    checked = true;
});
