const bgImg = document.getElementById("backgroundStart");
const ctx = bgImg.getContext("2d");

const background = new Image();
background.src = "openStart.png";

    background.onload = () => {

        ctx.clearRect(0, 0, bgImg.width, bgImg.height);

        ctx.drawImage(background, 0, 0, bgImg.width, bgImg.height);
    };

