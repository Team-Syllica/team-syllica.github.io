function embedScript(source, defer = true) { // Embeds a script in the header of the page
    let script = document.createElement("script");
    script.defer = defer;
    script.src = source;
    document.head.appendChild(script);
}

function init() {
    // Initialize and build the website by adding embedded code

    // Add markdown.js to the page
    /*embedScript('/assets/js/markdown-it.js', true)
    embedScript('/assets/js/markdown-it-named-headers.js', true)
    embedScript('/assets/js/markdown-handler.js', true)*/

    // Navbar
    fetch('/navbar.html').then((response) => response.text()).then((content) => {
        document.getElementById("navbar").innerHTML = content;
    })

    // Footer
    fetch('/footer.html').then((response) => response.text()).then((content) => {
        document.getElementById("footer").innerHTML = content;
    })
}

init()

function showPopup(content) {
    if(!document.getElementById("popup") || !document.getElementById("overlay")) return;

    document.getElementById("popup-content").innerHTML = content;

    document.getElementById("popup").style.display = "flex";
    document.getElementById("overlay").style.display = "block";

    document.body.style.overflow = 'hidden';
}

function closePopup() {
    Array.from(document.getElementsByClassName("popup")).forEach((el) => {
        el.style.display = "none";
    })
    document.getElementById("overlay").style.display = "none";

    document.body.style.overflow = 'auto';
}

// Generate a bar of social media links
function generateSocials(socials, button_class = 'social-link') {
    let socialsbar = new DocumentFragment();
    
    if(socials.bluesky) { 
        let bluesky = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        bluesky.setAttributeNS(null, 'viewBox', '-75 -75 680 680');
        bluesky.setAttributeNS(null, 'fill', 'currentColor');
        bluesky.classList = [button_class];
        bluesky.innerHTML = '<title>BlueSky</title><path xmlns="http://www.w3.org/2000/svg" d="M123.121 33.6637C188.241 82.5526 258.281 181.681 284 234.873C309.719 181.681 379.759 82.5526 444.879 33.6637C491.866 -1.61183 568 -28.9064 568 57.9464C568 75.2916 558.055 203.659 552.222 224.501C531.947 296.954 458.067 315.434 392.347 304.249C507.222 323.8 536.444 388.56 473.333 453.32C353.473 576.312 301.061 422.461 287.631 383.039C285.169 375.812 284.017 372.431 284 375.306C283.983 372.431 282.831 375.812 280.369 383.039C266.939 422.461 214.527 576.312 94.6667 453.32C31.5556 388.56 60.7778 323.8 175.653 304.249C109.933 315.434 36.0535 296.954 15.7778 224.501C9.94525 203.659 0 75.2916 0 57.9464C0 -28.9064 76.1345 -1.61183 123.121 33.6637Z" />';
        bluesky.onclick = function () {
            window.open(socials.bluesky);
        }

        socialsbar.append(bluesky)
    }

    if(socials.twitter) {
        let twitter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        twitter.setAttributeNS(null, 'viewBox', '0 0 24 24');
        twitter.setAttributeNS(null, 'fill', 'currentColor');
        twitter.classList = [button_class];
        twitter.innerHTML = '<title>Twitter</title><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />';
        twitter.onclick = function () {
            window.open(socials.twitter);
        }

        socialsbar.append(twitter)
    }

    if(socials.youtube) {
        let youtube = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        youtube.setAttributeNS(null, 'viewBox', '0 0 24 24');
        youtube.setAttributeNS(null, 'fill', 'currentColor');
        youtube.classList = [button_class];
        youtube.innerHTML = '<title>YouTube</title><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z" />';
        youtube.onclick = function () {
            window.open(socials.youtube);
        }

        socialsbar.append(youtube)
    }

    if(socials.twitch) {
        let twitch = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        twitch.setAttributeNS(null, 'viewBox', '0 0 24 24');
        twitch.setAttributeNS(null, 'fill', 'currentColor');
        twitch.classList = [button_class];
        twitch.innerHTML = '<title>Twitch</title><path d="M11.64 5.93H13.07V10.21H11.64M15.57 5.93H17V10.21H15.57M7 2L3.43 5.57V18.43H7.71V22L11.29 18.43H14.14L20.57 12V2M19.14 11.29L16.29 14.14H13.43L10.93 16.64V14.14H7.71V3.43H19.14Z" />';
        twitch.onclick = function () {
            window.open(socials.twitch);
        }

        socialsbar.append(twitch)
    }

    /*if(socials.discord) {
        let discord = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        discord.setAttributeNS(null, 'viewBox', '0 -20 127.14 126.36');
        discord.setAttributeNS(null, 'fill', 'currentColor');
        discord.classList = [button_class];
        discord.innerHTML = '<title>Discord</title><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>';
        discord.onclick = function () {
            window.open(socials.discord);
        }

        socialsbar.append(discord)
    }*/

    if(socials.instagram) {
        let instagram = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        instagram.setAttributeNS(null, 'viewBox', '0 0 24 24');
        instagram.setAttributeNS(null, 'fill', 'currentColor');
        instagram.classList = [button_class];
        instagram.innerHTML = '<title>Instagram</title><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />';
        instagram.onclick = function () {
            window.open(socials.url);
        }

        socialsbar.append(instagram)
    }

    if(socials.url) {
        let external_url = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        external_url.setAttributeNS(null, 'viewBox', '0 0 24 24');
        external_url.setAttributeNS(null, 'fill', 'currentColor');
        external_url.classList = [button_class];
        external_url.innerHTML = '<title>Website</title><path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" />';
        external_url.onclick = function () {
            window.open(socials.url);
        }

        socialsbar.append(external_url)
    }

    return socialsbar;
}