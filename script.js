function getExternalContent(page, callback = function(htmltext){}) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                callback(this.responseText)
            } else {
                console.error('404 Not found: ' + page)
            }
        }
    };
    request.open("GET", page, true);
    request.send()
}

function embedScript(source) { // Embeds a script in the header of the page
    let script = document.createElement("script");
    script.defer = true;
    script.src = source;
    document.head.appendChild(script);
}

function init() {
    // Initialize and build the website by adding embedded code

    // Add markdown.js to the page
    embedScript('/assets/js/markdown.js')

    // Navbar
    getExternalContent('/navbar.html', (response) => {document.getElementById("navbar").innerHTML = response;})

    // Footer
    getExternalContent('/footer.html', (response) => {document.getElementById("footer").innerHTML = response;})
}

init()

function showPopup(content) {
    if(!document.getElementById("popup") || !document.getElementById("overlay")) return;

    document.getElementById("popup-content").innerHTML = content;

    document.getElementById("popup").style.display = "block";
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