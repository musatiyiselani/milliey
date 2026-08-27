/*
============================================================
BACKEND BY AI
============================================================

Browser-based persistent storage.

This saves:
- current screen
- selected answers
- checked answers
- answer results

It survives:
- refresh
- closing the tab
- reopening the page

============================================================
*/


const STORAGE_KEY = "millicent_backend_by_ai";
const STORAGE_VERSION = "2";


const defaultData = {

    currentScreen: 0,

    questions: {

        question1: {
            selected: null,
            checked: false
        },

        question2: {
            selected: null,
            checked: false
        },

        question3: {
            selected: null,
            checked: false
        },

        question4: {
            selected: null,
            checked: false
        },

        question5: {
            selected: null,
            checked: false
        },

        question6: {
            selected: null,
            checked: false
        }

    }

};


let savedData;


function loadBackend() {

    try {

        const savedVersion =
            localStorage.getItem("millicent_backend_version");


        // If this is a new version,
        // delete everyone's old saved progress.
        if (savedVersion !== STORAGE_VERSION) {

            localStorage.removeItem(STORAGE_KEY);

            localStorage.setItem(
                "millicent_backend_version",
                STORAGE_VERSION
            );

        }


        const saved =
            localStorage.getItem(STORAGE_KEY);


        if (saved) {

            savedData = JSON.parse(saved);

        } else {

            savedData =
                JSON.parse(JSON.stringify(defaultData));

        }


    } catch (error) {

        console.log(
            "Backend by AI could not load:",
            error
        );

        savedData =
            JSON.parse(JSON.stringify(defaultData));

    }

}


function saveBackend() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(savedData)
        );

    } catch (error) {

        console.log(
            "Backend by AI could not save:",
            error
        );

    }

}


loadBackend();


/*
============================================================
MUSIC
============================================================
*/

const music =
    document.getElementById("birthdayMusic");

music.loop = true;


/*
============================================================
SCREENS
============================================================
*/

const screens =
    document.querySelectorAll(".screen");


let currentScreen =
    savedData.currentScreen || 0;


/*
============================================================
SHOW SCREEN
============================================================
*/

function showScreen(number) {

    if (number < 0) {
        number = 0;
    }

    if (number >= screens.length) {
        number = screens.length - 1;
    }


    screens.forEach(screen => {

        screen.classList.remove("active");

    });


    screens[number].classList.add("active");


    currentScreen = number;


    /*
    Save current location immediately.
    */

    savedData.currentScreen =
        currentScreen;

    saveBackend();


    /*
    Play videos only on current screen.
    */

    document
        .querySelectorAll(".screen video")
        .forEach(video => {

            if (video.id === "slideshowVideo") {
                return;
            }


            if (
                video.closest(".screen") ===
                screens[number]
            ) {

                video.play().catch(() => {});

            } else {

                video.pause();

            }

        });


    /*
    Start slideshow when reaching final page.
    */

    if (number === 7) {

        startSlideshow();

    }

}


/*
============================================================
MUSIC RESUME
============================================================
*/

function resumeMusic() {

    music.play().catch(() => {

        /*
        Some browsers may block playback until
        another user interaction.
        */

    });

}


/*
============================================================
INTRO STORY
============================================================
*/

const storyText =
    document.getElementById("storyText");

const startButton =
    document.getElementById("startButton");


const story = [

    "Hello Millicent Miyambo . . .❤️",

    "Just in case you forgot . . .😄",

    "It's your birthday today...🎂🥳",

    "So we created this for you...☺️",

    "More like a guessing game...🥺",

    "So firstly . . .😛",

    "All guesses will be saved...😛",

    "And the rules are simple . . .👀",

    "You are to receive messages...💌",

    "Each with a pic/video of you...🤗",

    "Each message and pic/video...🥹🫠",

    "Is from a special someone to you🙈",

    "All you have to do is . . .🤩"

];


let storyIndex = 0;


startButton.style.display = "none";


function addNextLine() {

    if (storyIndex < story.length) {

        const line =
            document.createElement("p");

        line.textContent =
            story[storyIndex];

        storyText.appendChild(line);

        storyIndex++;

        setTimeout(
            addNextLine,
            1750
        );

    } else {

        startButton.style.display =
            "block";

    }

}


addNextLine();


/*
============================================================
START BUTTON
============================================================
*/

startButton.addEventListener(
    "click",
    async () => {

        try {

            music.volume = 1;

            await music.play();

        } catch (error) {

            console.log(
                "Music error:",
                error
            );

        }


        showScreen(1);

    }
);


/*
============================================================
QUESTION SYSTEM
============================================================
*/

const questionScreens =
    document.querySelectorAll(
        ".screen:not(#intro):not(#final)"
    );


questionScreens.forEach(screen => {

    const screenId =
        screen.id;

    const options =
        screen.querySelectorAll(
            ".option"
        );

    const checkButton =
        screen.querySelector(
            ".checkButton"
        );

    const backButton =
        screen.querySelector(
            ".backButton"
        );


    /*
    Get saved question data.
    */

    const questionData =
        savedData.questions[screenId];


    let selected = null;

    let checked =
        questionData.checked;


    /*
    --------------------------------------------------------
    RESTORE SAVED ANSWER
    --------------------------------------------------------
    */

    if (
        questionData.selected !== null
    ) {

        options.forEach(option => {

            if (
                Number(
                    option.dataset.index
                ) ===
                questionData.selected
            ) {

                selected = option;

            }

        });

    }


    /*
    Add indexes to options.
    */

    options.forEach(
        (option, index) => {

            option.dataset.index =
                index;

        }
    );


    /*
    Restore selected option after indexes exist.
    */

    if (
        questionData.selected !== null
    ) {

        options.forEach(option => {

            if (
                Number(
                    option.dataset.index
                ) ===
                questionData.selected
            ) {

                selected = option;

                option.style.borderColor =
                    "yellowgreen";

                option.style.color =
                    "yellowgreen";

            }

        });

    }


    /*
    --------------------------------------------------------
    RESTORE CHECKED STATE
    --------------------------------------------------------
    */

    if (checked && selected) {

        applyCheckedResult(
            options,
            selected
        );

        checkButton.textContent =
            "Another Message";

    }


    /*
    --------------------------------------------------------
    SELECTING ANSWER
    --------------------------------------------------------
    */

    options.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                if (checked) {
                    return;
                }


                options.forEach(item => {

                    item.style.backgroundColor =
                        "";

                    item.style.color =
                        "";

                    item.style.borderColor =
                        "";

                });


                selected =
                    option;


                selected.style.borderColor =
                    "yellowgreen";

                selected.style.color =
                    "yellowgreen";


                /*
                Save selected answer.
                */

                questionData.selected =
                    Number(
                        option.dataset.index
                    );

                questionData.checked =
                    false;

                saveBackend();


                checkButton.textContent =
                    "Check";

            }
        );

    });


    /*
    --------------------------------------------------------
    CHECK BUTTON
    --------------------------------------------------------
    */

    checkButton.addEventListener(
        "click",
        () => {


            /*
            Resume song whenever Check is pressed.
            */

            resumeMusic();


            /*
            Already checked:
            go to next screen.
            */

            if (checked) {

                const next =
                    currentScreen + 1;

                showScreen(next);

                return;

            }


            /*
            Nothing selected.
            */

            if (!selected) {

                checkButton.textContent =
                    "Please select a person first 👀";

                return;

            }


            /*
            Save answer.
            */

            questionData.selected =
                Number(
                    selected.dataset.index
                );

            questionData.checked =
                true;


            /*
            Apply visual result.
            */

            applyCheckedResult(
                options,
                selected
            );


            checked = true;


            checkButton.textContent =
                "Another Message";


            /*
            Save immediately.
            */

            saveBackend();

        }
    );


    /*
    --------------------------------------------------------
    BACK BUTTON
    --------------------------------------------------------
    */

    backButton.addEventListener(
        "click",
        () => {

            /*
            Resume music when navigating.
            */

            resumeMusic();


            const previous =
                currentScreen - 1;


            if (previous >= 0) {

                showScreen(previous);

            }

        }
    );

});


/*
============================================================
APPLY ANSWER RESULT
============================================================
*/

function applyCheckedResult(
    options,
    selected
) {


    /*
    Correct answer.
    */

    if (
        selected.dataset.answer ===
        "correct"
    ) {

        selected.style.backgroundColor =
            "green";

        selected.style.color =
            "white";

        selected.style.borderColor =
            "white";

    }


    /*
    Wrong answer.
    */

    else {

        selected.style.backgroundColor =
            "red";

        selected.style.color =
            "black";

        selected.style.borderColor =
            "black";


        /*
        Reveal correct answer.
        */

        options.forEach(option => {

            if (
                option.dataset.answer ===
                "correct"
            ) {

                option.style.backgroundColor =
                    "yellow";

                option.style.color =
                    "black";

                option.style.borderColor =
                    "black";

            }

        });

    }

}


/*
============================================================
FINAL PAGE BACK BUTTON
============================================================
*/

const finalBackButton =
    document.querySelector(
        ".finalBackButton"
    );


finalBackButton.addEventListener(
    "click",
    () => {

        resumeMusic();

        showScreen(6);

    }
);


/*
============================================================
FINAL SLIDESHOW
============================================================
*/

const slideshowImage =
    document.getElementById(
        "slideshowImage"
    );

const slideshowVideo =
    document.getElementById(
        "slideshowVideo"
    );


let slideshowCurrent = 1;

const imageTime = 4000;

let slideshowStarted = false;

let slideshowTimer = null;


/*
------------------------------------------------------------
SHOW IMAGE
------------------------------------------------------------
*/

function showImage() {

    slideshowVideo.pause();

    slideshowVideo.style.display =
        "none";

    slideshowImage.style.display =
        "block";

    slideshowImage.style.opacity =
        "0";


    setTimeout(() => {

        slideshowImage.src =
            `./images/${slideshowCurrent}.jpeg`;

        slideshowImage.style.opacity =
            "1";

    }, 500);

}


/*
------------------------------------------------------------
NEXT IMAGE
------------------------------------------------------------
*/

function nextImage() {

    slideshowCurrent++;


    if (slideshowCurrent <= 10) {

        showImage();

        slideshowTimer =
            setTimeout(
                nextImage,
                imageTime
            );

    } else {

        showSlideshowVideo();

    }

}


/*
------------------------------------------------------------
SHOW VIDEO
------------------------------------------------------------
*/

function showSlideshowVideo() {

    slideshowImage.style.opacity =
        "0";


    setTimeout(() => {

        slideshowImage.style.display =
            "none";

        slideshowVideo.style.display =
            "block";

        slideshowVideo.style.opacity =
            "1";

        slideshowVideo.src =
            "./vids/11.mp4";

        slideshowVideo.play().catch(
            () => {}
        );

    }, 1000);

}


/*
------------------------------------------------------------
VIDEO ENDED
------------------------------------------------------------
*/

slideshowVideo.addEventListener(
    "ended",
    () => {

        slideshowCurrent = 1;

        slideshowVideo.style.opacity =
            "0";


        setTimeout(() => {

            slideshowVideo.style.display =
                "none";

            slideshowImage.style.display =
                "block";

            showImage();


            slideshowTimer =
                setTimeout(
                    nextImage,
                    imageTime
                );

        }, 1000);

    }
);


/*
------------------------------------------------------------
START SLIDESHOW
------------------------------------------------------------
*/

function startSlideshow() {

    if (slideshowStarted) {
        return;
    }


    slideshowStarted = true;


    slideshowCurrent = 1;


    showImage();


    slideshowTimer =
        setTimeout(
            nextImage,
            imageTime
        );

}


/*
============================================================
RESTORE SAVED SCREEN
============================================================
*/

window.addEventListener(
    "load",
    () => {

        /*
        Small delay allows the page and media
        elements to finish loading.
        */

        setTimeout(() => {

            showScreen(
                savedData.currentScreen || 0
            );

        }, 50);

    }
);












/*

index files

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <!--<img class="bckpic" src="./images/backpic.webp">-->
    <img class="bckpic" id="pic" src="./images/makeupmillie.jpeg">

    <div class="story">
        <h3 id="storyText">

            <!--
            Hello Millicent Miyambo . . .❤️<br>
            Just in case you forgot . . .😄<br>
            It's your birthday today...🎂🥳<br>
            So we created this for you...☺️<br>
            More like a guessing game...🥺<br>
            So firstly . . .😛<br>
            The rules are simple . . .👀<br>
            You are to receive messages...💌<br>
            Each with a pic/video of you...🤗<br>
            Each message and pic/video...🥹🫠<br>
            Is from a special someone to you🙈<br>
            All you have to do is . . .🤩<br>
            -->

        </h3>

        <button id="btn1">Guess Who Sent It . . .🥹!</button>
    </div>

    <script src="index.js"></script>
</body>
</html>

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

        setTimeout(addNextLine, 100);

    } else {

        button1.style.display = "block";

    }
}

addNextLine();

button1.addEventListener("click", () => {
    window.location.href = "Q1.html";
});

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

body {
    font-family: 'Times New Roman', Times, serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;  
    position: relative;
}

#storyText {
    color: rgb(255, 255, 255);
}


----------------------------------------------------------------------------
Background stuff                                                           |
----------------------------------------------------------------------------

.bckpic,
#vid1,
#vid2 {
    position: fixed;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.75);
}

.story {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center; 
    position: relative;
}



----------------------------------------------------------------------------
Background stuff                                                           |
----------------------------------------------------------------------------

h1,
h2 {
    text-align: center;
    color: rgb(68, 9, 120);
    /*border: 1px solid brown; /*
}


----------------------------------------------------------------------------
Options                                                                    |
----------------------------------------------------------------------------

#form1,
#form2,
#form3,
#form4,
#form5,
#form6 {
    font-size: x-large;
    font-weight: bold;
    color: rgb(212, 207, 205);
    position: absolute; 
    left: 10px;
    top: 70vh;
    filter: brightness(1);
    filter: contrast(5);

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    width: 95%;
    height: 10%;
}


.opt1,
.opt2,
.opt3,
.opt4,
.opt5,
.opt6 {
    font-size: large;
    font-family: 'Times New Roman', Times, serif;
    color: rgb(255, 255, 255);
    background-color: transparent;
    border: 2px solid;
    border-radius: 5px;
}


----------------------------------------------------------------------------
Options                                                                    |
----------------------------------------------------------------------------



----------------------------------------------------------------------------
Questions                                                                  |
----------------------------------------------------------------------------


#Q1,
#Q2,
#Q3,
#Q4,
#Q5,
#Q6 {
    font-size: x-large;
    font-weight: bold;
    position: absolute; 
    text-align: center;
    filter: contrast(5);
    top: 25px;
}

#Q1 {
    color: white;
}

#Q2 {
    color: black;
}

#Q3 {
    color: rgba(177, 171, 136, 0.96);
}

#Q4 {
    color: rgb(32, 141, 32);
}

#Q5 {
    color: wheat;
}

#Q6 {
    color: white;
}


/* 
----------------------------------------------------------------------------
Check buttons                                                              |
----------------------------------------------------------------------------


#check1,
#check2,
#check3,
#check4,
#check5,
#check6 {
    background-color: transparent;
    position: absolute;
    top: 82.5vh;
    left: 40px;
    padding: 5px;
    border: 2px solid rgb(200, 200, 200);
    border-radius: 5px;
    margin: 0%;
    font-weight: bold;
    font-size: large;
}


/* 
----------------------------------------------------------------------------
Old Code!                                                                  |
----------------------------------------------------------------------------


#pic1 {
    /*border: 1px solid Red; /*
    width: 90%;
    max-width: 250px;
    border-radius: 2%;
    filter: brightness(0.75);
}

#pic {
    filter: blur(1px);
}

#btn1 {
    background-color: rgb(159, 162, 169);
    color: rgb(0, 0, 0);
    border: 1px solid rgb(159, 162, 169);
    border-radius: 3px;
    margin: 0%;
    position: absolute;
    top: 80vh;
    padding: 5px;
}


/* Old Code! 


/*
----------------------------------------------------------------------------
Check screen                                                               |
----------------------------------------------------------------------------


.check_screen {
    border: 0.1px solid;
    text-align: center;

    position: fixed;

    width: 90%;
    max-width: 500px;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    padding: 20px;
    margin: 0;

    display: none;

    font-weight: bold;
    font-size: x-large;
}

/* 
----------------------------------------------------------------------------
Last Page                                                                   |
----------------------------------------------------------------------------



#slideshowImage,
#slideshowVideo {

    position: fixed;

    inset: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;

    z-index: -2;

    filter: brightness(0.65);

    opacity: 1;

    transition: opacity 1s ease-in-out;
}


#slideshowVideo {

    display: none;

}


/* 
----------------------------------------------------------------------------
Last Page Overlay                                                           |
----------------------------------------------------------------------------
*


.last_overlay {

    width: 100%;

    min-height: 100vh;

    padding: 30px 15px;

    display: flex;

    justify-content: center;

    align-items: center;

}


/* 
----------------------------------------------------------------------------
Message                                                                    |
----------------------------------------------------------------------------
*


.last_message {

    width: 95%;

    max-width: 800px;

    background-color: rgba(255, 255, 255, 0.12);

    color: white;

    padding: 25px;

    border-radius: 15px;

    border: 1px solid rgba(255, 255, 255, 0.4);

    backdrop-filter: blur(3px);

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

    text-align: left;

    line-height: 1.6;

}


/* 
----------------------------------------------------------------------------
Headings                                                                   |
----------------------------------------------------------------------------
*


.last_message h1 {

    color: white;

    text-align: center;

    margin-top: 0;

    text-shadow: 2px 2px 5px black;

}


.last_message h2 {

    color: white;

    text-align: center;

    font-size: x-large;

    text-shadow: 2px 2px 5px black;

}


/* 
----------------------------------------------------------------------------
Message text                                                               |
----------------------------------------------------------------------------
*


.last_message p {

    font-size: large;

    margin-bottom: 20px;

    text-shadow: 1px 1px 3px black;

}


/* 
----------------------------------------------------------------------------
Bible verse                                                                |
----------------------------------------------------------------------------
*

.bible_verse {

    background-color: rgba(255, 255, 255, 0.12);

    border-left: 5px solid white;

    padding: 15px;

    margin: 25px 0;

    text-align: center;

    border-radius: 5px;

}


.bible_verse blockquote {

    font-style: italic;

    font-size: large;

    margin: 15px 5px;

    color: white;

    text-shadow: 1px 1px 3px black;

}


/* 
----------------------------------------------------------------------------
Final message                                                               |
----------------------------------------------------------------------------
*


.final_message {

    margin-top: 35px;

    padding-top: 20px;

    border-top: 2px solid rgba(255, 255, 255, 0.5);

    text-align: center;

}


.final_message h1 {

    font-size: xx-large;

}


/* 
----------------------------------------------------------------------------
Mobile                                                                      |
----------------------------------------------------------------------------
*


@media (max-width: 600px) {

    .last_overlay {

        padding: 20px 10px;

        align-items: flex-start;

    }


    .last_message {

        width: 100%;

        padding: 20px 16px;

        margin-top: 10px;

    }


    .last_message h1 {

        font-size: xx-large;

    }


    .last_message h2 {

        font-size: large;

    }


    .last_message p {

        font-size: medium;

        line-height: 1.6;

    }


    .bible_verse blockquote {

        font-size: medium;

    }

    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <img class="bckpic" src="./images/fortunepic.jpeg" id="picture1">

    <h2 id="Q1">"Found you this year  and it already feels like a 
        lifetime of knowing you. Love you dhownnnnnnn 🫂. Happy birthday"</h2>

    <!--
    <form id="form1">
        <input type="radio" name="person" value="Pfumi" id="pfumi">
        <label for="pfumi">Pfumi</label> <br>

        <input type="radio" name="person" value="Fortune" id="fort">
        <label for="fort">Fortune</label> <br>

        <input type="radio" name="person" value="Mbuyelo" id="mbuyelo">
        <label for="mbuyelo">Mbuyelo</label><br>

        <input type="radio" name="person" value="Ntsako" id="ntsako"> 
        <label for="ntsako">Ntsako</label> <br>
    </form>
    -->

    <div id="form1">
        <button class="opt1" value="Pfumi" id="Pfumi">
            Pfumi
        </button>
        <button class="opt1" value="Mbuyelo" id="Mbuyelo">
            Mbuyelo
        </button>
        <button class="opt1" value="Fortune" id="Fortune">
            Fortune
        </button>
        <button class="opt1" value="Ntsako" id="Ntsako">
            Ntsako
        </button>
    </div>
    

    <button class="opt1" id="check1">Check</button>

    <div class="check_screen">
        
    </div>

    <script src="Q1.js"></script>
</body>
</html>
const check_1_button = document.getElementById("check1");
const options = document.querySelectorAll("#form1 .opt1");

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
        window.location.href = "Q2.html";
        return;
    }


    // Check if nothing was selected
    if (!selected) {
        check_1_button.textContent = "Please select a person first 👀";
        return;
    }


    // Correct answer
    if (selected.value === "Fortune") {

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

            if (option.value === "Fortune") {

                option.style.backgroundColor = "yellowgreen";
                option.style.color = "black";
                option.style.borderColor = "black";

            }

        });

        check_1_button.textContent = "Another Message";
    }


    checked = true;
});


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <video src="./vids/vid1.mp4" autoplay muted loop id="vid1"></video>

    <h2 id="Q2">""</h2>


    <div id="form2">

        <button class="opt2" value="Gift" id="Gift">
            Gift
        </button>

        <button class="opt2" value="Kuhlula" id="Kuhlula">
            Kuhlula
        </button>

        <button class="opt2" value="Lunghile" id="Lunghile">
            Lunghile
        </button>

        <button class="opt2" value="Musa" id="Musa">
            Musa
        </button>

    </div>


    <button class="opt2" id="check2">
        Check
    </button>


    <div class="check_screen">
        
    </div>


    <script src="Q2.js"></script>

</body>
</html>

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


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <img class="bckpic" src="./images/mbuyelopic.jpeg" id="picture2">

    <h2 id="Q3">"Finding you will always be the best thing to me🙂‍↕️"</h2>


    <div id="form3">

        <button class="opt3" value="Pfumi" id="Pfumi">
            Pfumi
        </button>

        <button class="opt3" value="Ntsako" id="Ntsako">
            Ntsako
        </button>

        <button class="opt1" value="Fortune" id="Fortune">
            Fortune
        </button>

        <button class="opt3" value="Mbuyelo" id="Mbuyelo">
            Mbuyelo
        </button>

    </div>


    <button class="opt3" id="check3">
        Check
    </button>


    <div class="check_screen">
        
    </div>


    <script src="Q3.js"></script>

</body>
</html>

const check_1_button = document.getElementById("check3");
const options = document.querySelectorAll("#form3 .opt3");

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
        window.location.href = "Q4.html";
        return;
    }


    // Check if nothing was selected
    if (!selected) {
        check_1_button.textContent = "Please select a person first 👀";
        return;
    }


    // Correct answer
    if (selected.value === "Mbuyelo") {

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

            if (option.value === "Mbuyelo") {

                option.style.backgroundColor = "yellow";
                option.style.color = "black";
                option.style.borderColor = "black";

            }

        });

        check_1_button.textContent = "Another Message";
    }


    checked = true;
});

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <video src="./vids/lunghilevid.mp4" autoplay muted loop id="vid2"></video>

    <h2 id="Q4">"Happy birthday eka wena murhandziwa daddy vata tshama 
        vaku rhandzile hi masiku hinkwawo , ndzi tsakela kuva na munhu 
        wo fana na wena a vutonwini bya mina , kula uya emahlweni unitisela 
        leswo tala na ntsako ninga rivali rirhandzu 🙃"</h2>


    <div id="form4">

        <button class="opt4" value="Gift" id="Gift">
            Gift
        </button>

        <button class="opt4" value="Musa" id="Musa">
            Musa
        </button>

        <button class="opt4" value="Lunghile" id="Lunghile">
            Lunghile
        </button>

        <button class="opt4" value="Kuhlula" id="Kuhlula">
            Kuhlula
        </button>

    </div>


    <button class="opt4" id="check4">
        Check
    </button>


    <div class="check_screen">
        
    </div>


    <script src="Q4.js"></script>

</body>
</html>


const check_1_button = document.getElementById("check4");
const options = document.querySelectorAll("#form4 .opt4");

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
        window.location.href = "Q5.html";
        return;
    }


    // Check if nothing was selected
    if (!selected) {
        check_1_button.textContent = "Please select a person first 👀";
        return;
    }


    // Correct answer
    if (selected.value === "Lunghile") {

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

            if (option.value === "Lunghile") {

                option.style.backgroundColor = "yellow";
                option.style.color = "black";
                option.style.borderColor = "black";

            }

        });

        check_1_button.textContent = "Another Message";
    }


    checked = true;
});


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <img class="bckpic" src="./images/ntsakopic.jpeg" id="picture3">

    <h2 id="Q5">"Happy birthday mylove❤️🥳you've been there through 
        my worst n my best❤️thank you for being both friend and sister 
        at the same time ❤️life would be so boring without you 🥰I'm forever 
        grateful for you and I love you sarn 🥰❤️."</h2>


    <div id="form5">

        <button class="opt5" value="Ntsako" id="Ntsako">
            Ntsako
        </button>

        <button class="opt5" value="Mbuyelo" id="Mbuyelo">
            Mbuyelo
        </button>

        <button class="opt5" value="Pfumi" id="Pfumi">
            Pfumi
        </button>

        <button class="opt5" value="Musa" id="Musa">
            Musa
        </button>

    </div>


    <button class="opt5" id="check5">
        Check
    </button>


    <div class="check_screen">
        
    </div>


    <script src="Q5.js"></script>

</body>
</html>

const check_1_button = document.getElementById("check5");
const options = document.querySelectorAll("#form5 .opt5");

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
        window.location.href = "Q6.html";
        return;
    }


    // Check if nothing was selected
    if (!selected) {
        check_1_button.textContent = "Please select a person first 👀";
        return;
    }


    // Correct answer
    if (selected.value === "Ntsako") {

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

            if (option.value === "Ntsako") {

                option.style.backgroundColor = "yellow";
                option.style.color = "black";
                option.style.borderColor = "black";

            }

        });

        check_1_button.textContent = "Another Message";
    }


    checked = true;
});


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Millicent</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>

    <img class="bckpic" src="./images/backpic.webp" id="picture4">

    <h2 id="Q6">"Happy birthday Millicent, on your special day I wish 
        you endless joy, good health, and all the success your heart desires. 
        May your life be filled  with beautiful moments, true friends and 
        dreams that come true. You deserve all the love in the world today 
        and always🥳🥳🥳❤️"</h2>


    <div id="form6">

        <button class="opt6" value="Gift" id="Gift">
            Gift
        </button>

        <button class="opt6" value="Mbuyelo" id="Mbuyelo">
            Mbuyelo
        </button>

        <button class="opt6" value="Pfumi" id="Pfumi">
            Pfumi
        </button>

        <button class="opt6" value="Musa" id="Musa">
            Musa
        </button>

    </div>


    <button class="opt6" id="check6">
        Check
    </button>


    <div class="check_screen">
        
    </div>


    <script src="Q6.js"></script>

</body>
</html>

const check_1_button = document.getElementById("check6");
const options = document.querySelectorAll("#form6 .opt6");

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

    // Go to last page
    if (checked) {
        window.location.href = "last.html";
        return;
    }


    // Check if nothing was selected
    if (!selected) {
        check_1_button.textContent = "Please select a person first 👀";
        return;
    }


    // Correct answer
    if (selected.value === "Pfumi") {

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

            if (option.value === "Pfumi") {

                option.style.backgroundColor = "yellow";
                option.style.color = "black";
                option.style.borderColor = "black";

            }

        });

        check_1_button.textContent = "Another Message";
    }


    checked = true;
});


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Happy Birthday Millicent ❤️</title>

    <link rel="stylesheet" href="index.css">
</head>


<body>

    <!-- Background slideshow -->

    <img id="slideshowImage" src="./images/1.jpeg">

    <video id="slideshowVideo" muted playsinline></video>


    <!-- Dark layer over the background -->

    <div class="last_overlay">


        <!-- Birthday message -->

        <div class="last_message">


            <h1>
                Happy Birthday, Millicent ❤️🥳
            </h1>


            <h2>
                If I was given an opportunity to describe you,
                Millicent, to a stranger ❤️
            </h2>


            <p>
                I would say, I remember spending some time on Google
                searching <strong>"The most beautiful dark-skinned lady
                on the planet."</strong> 🥹❤️ It took about 30 minutes of
                scrolling through those pictures before it could click
                that Google <strong>SURELY</strong> has not met this one
                person that I sought. 😂
            </p>


            <p>
                And honestly, beauty would only be the beginning of how
                I would describe you. ❤️✨
            </p>


            <p>
                People could do their best at defining kindness; I would
                just present Millicent. 🫶🏽 Picture any positive adjective,
                then you are to see her floating in your imagination. 🌸
                You are one of those people who make it difficult to
                explain what makes you special because there is just so
                much to say. ❤️
            </p>


            <p>
                Do try not to get me wrong, she is not perfect, far from
                perfection, I say. 😂 She is annoying sometimes, I always
                have to agree with her when we are arguing, trying her best
                to let me call her sister
                <strong>(will never happen, by the way).</strong> 😂😂
            </p>


            <p>
                But somehow, even with all that, I wouldn't trade you
                for anyone else. ❤️🫂
            </p>


            <p>
                Always there for me in most situations, like calling me
                to wake up for an exam. 😂 I have no therapist yet; when
                I am in need of one, I call her. 🥹😂 Even a biblical
                question I can discuss with her, that is, if I want to.
                🙏🏽❤️
            </p>


            <p>
                And if that does not bring an image of you to them,
                I do not know what will. 😂❤️
            </p>


            <p>
                I genuinely appreciate having you in my life, and I hope
                you never forget how much you mean to the people who love
                you. 🫂❤️ You have been a blessing to the people around
                you, and I pray that God allows you to experience the same
                love, kindness, and happiness that you so freely give to
                others. 🙏🏽✨
            </p>


            <p>
                I pray to God that He blesses you with more to life, that
                what you always wish for comes to life, and that He
                continues to guide you wherever life takes you. 🙏🏽❤️
            </p>


            <!-- Bible verse -->

            <div class="bible_verse">

                <p>
                    As the Bible says in
                    <strong>Numbers 6:24–26:</strong>
                </p>


                <blockquote>
                    "The Lord bless you and keep you; the Lord make His
                    face shine on you and be gracious to you; the Lord
                    turn His face toward you and give you peace."
                </blockquote>


                <span>
                    🙏🏽✨
                </span>

            </div>


            <p>
                That is genuinely one of my wishes for you—not just
                today, but throughout your life. ❤️ May God keep you,
                protect you, guide you, and give you peace in every
                season of your life. 🙏🏽🌷
            </p>


            <p>
                All I want is to wish you a
                <strong>HAPPY BIRTHDAY, MILLICENT!</strong>
                🥳🎂🎉❤️
            </p>


            <p>
                May all the love, joy, happiness, and more things that
                you spread come back to you as a
                <strong>huge package</strong> from this day and until
                forever. 🎁❤️✨
            </p>


            <!-- Final message -->

            <div class="final_message">

                <h1>
                    Happy birthday, Millicent. ❤️🥳🫂
                </h1>


                <p>
                    May you continue being the beautiful, kind person that you are. 😂❤️
                </p>

            </div>


        </div>

    </div>


    <script src="last.js"></script>

</body>

</html>


const image = document.getElementById("slideshowImage");
const video = document.getElementById("slideshowVideo");

let current = 1;

const imageTime = 4000;


// Show an image
function showImage() {

    video.pause();

    video.style.display = "none";

    image.style.display = "block";

    image.style.opacity = "0";


    setTimeout(() => {

        image.src = `./images/${current}.jpeg`;

        image.style.opacity = "1";

    }, 500);

}


// Move to the next image
function nextImage() {

    current++;


    if (current <= 10) {

        showImage();

        setTimeout(nextImage, imageTime);

    } 
    
    else {

        showVideo();

    }

}


// Show the video
function showVideo() {

    image.style.opacity = "0";


    setTimeout(() => {

        image.style.display = "none";

        video.style.display = "block";

        video.style.opacity = "1";

        video.src = "./vids/11.mp4";

        video.play();

    }, 1000);

}


// When the video finishes
video.addEventListener("ended", () => {

    current = 1;


    video.style.opacity = "0";


    setTimeout(() => {

        video.style.display = "none";

        image.style.display = "block";

        showImage();

        setTimeout(nextImage, imageTime);

    }, 1000);

});


// Start everything
showImage();

setTimeout(nextImage, imageTime);





*/