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

    "The rules are simple . . .👀",

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
            0
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