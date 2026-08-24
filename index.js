const button1 = document.getElementById("btn1");

const storyText = document.getElementById("storyText");

const story = [
    "Hello Millicent Miyambo . . .❤️",
    "Just in case you forgot . . .😄",
    "It's your birthday today...🎂🥳",
    "So we created this for you...☺️",
    "More like a guessing game...🥺",
    "So firstly . . .😛",
    "The rules are simple .. . .👀",
    "You are to receive messages...💌",
    "Each with a pic/video of you...🤗",
    "Each message and pic/video...🥹🫠",
    "Is from a special someone to you🙈",
    "All you have to do is . . .🤩",
];

let current = 0;

button1.style.display = "none";

function addNextLine() {

    if (current < story.length) {

        const line = document.createElement("p");

        line.textContent = story[current];

        storyText.appendChild(line);

        current++;

        setTimeout(addNextLine, 2000);

    } else {

        button1.style.display = "block";

    }
}

addNextLine();

button1.addEventListener("click", () => {
    window.location.href = "Q1.html";
});