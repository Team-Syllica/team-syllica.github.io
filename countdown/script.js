// Load all bg and fg images immediately
function loadImage(src){
    let img = new Image();
    img.src = src;
}

loadImage('./foregrounds/0.png');
loadImage('./foregrounds/1.png');
loadImage('./foregrounds/2.png');
loadImage('./foregrounds/3.png');
loadImage('./foregrounds/4.png');
loadImage('./foregrounds/5.png');
loadImage('./foregrounds/6.png');
loadImage('./foregrounds/7.png');

loadImage('./backgrounds/0.png');
loadImage('./backgrounds/1.png');
loadImage('./backgrounds/2.png');
loadImage('./backgrounds/3.png');
loadImage('./backgrounds/4.png');
loadImage('./backgrounds/5.png');
loadImage('./backgrounds/6.png');
loadImage('./backgrounds/7.png');

document.getElementById("piston-audio").load();

let doorState = 0;
function openDoor(){
    doorState++;

    document.getElementById("door-foreground").src = './foregrounds/' + doorState.toString() + '.png';
    if(doorState < 7) {
        document.getElementById("door-background").src = './backgrounds/' + (doorState + 1).toString() + '.png';
    }

    document.getElementById("piston-audio").currentTime = 0
    document.getElementById("piston-audio").volume = 0.15
    document.getElementById("piston-audio").play()

    if(doorState < 7){
        window.setTimeout(openDoor, 600)
    }

    if(doorState == 5) {
        document.getElementById("map-download").style.display = 'unset';
        document.getElementById("true-foreground").classList.toggle("visible", true)
    }
}

let releasedate = new Date('12:00:00 PM EST December 25, 2025');

var tickinterval = window.setInterval(tick, 10);

function tick() {
    // Countdown tick
    let realtitle = '<img src="/maps/TKL4/demoicon.png" class="syllica-logo" draggable="false" onclick="location.href = \'/countdown/\';">The Kitatcho Laboratories: <br>Chapter 4 DEMO';

    let currentdate = new Date((new Date() - 0) + 0);
    let difference = releasedate - currentdate;

    if(difference >= 0) {
        document.getElementById("ctdn-title").innerHTML = '01:00:00:00';
        document.getElementById("ctdn-title").classList.toggle("countdown", true);

        let datediff = new Date(difference);

        function rn(n) {
            n = n.toString();
            if(n.length == 1) {
                n = '0' + n;
            }

            return '<span style="width: 1.2em; font-family: MinecraftTen; display: inline-block; text-align: middle;">' + n + '</span>';
        }

        document.getElementById("ctdn-title").innerHTML = (rn(datediff.getUTCDate() - 1) + ':' + rn(datediff.getUTCHours()) + ':' + rn(datediff.getUTCMinutes()) + ':' + rn(datediff.getUTCSeconds()));
    } else {
        document.getElementById("ctdn-title").innerHTML = realtitle;
        document.getElementById("ctdn-title").classList.toggle("countdown", false);
        document.getElementById("ctdn-title").classList.toggle("release-title", true);

        clearInterval(tickinterval);

        openDoor();
    }
}