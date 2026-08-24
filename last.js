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