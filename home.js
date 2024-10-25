let contentData = {};

function loadHomepage() {
    document.getElementById("map-slideshow-slides").innerHTML = "";
    document.getElementById("map-slideshow-progress").innerHTML = "";

    let maps = contentData.maps.filter(map => !map.hide_in_grid);

    for(let i = 0; i < maps.length; i++) {
        let slidedata = maps[i];

        let dot = document.createElement("span")
        dot.classList = ["dot"];
        dot.setAttribute("onclick", "setCurrentSlide(" + (i + 1) + ")");
        document.getElementById("map-slideshow-progress").append(dot)

        let slide = document.createElement("div");
        slide.classList = ['map-slideshow-slide fade'];
        let progresslabel = document.createElement('div');
        progresslabel.classList = ['numbertext'];
        progresslabel.innerHTML = (i + 1) + " / " + maps.length
        slide.appendChild(progresslabel);

        let cover = document.createElement("img");
        cover.classList = ['map-slideshow-slide-content'];
        let coverEntry = slidedata.cover || slidedata.slideshow.find(entry => entry.cover && entry.type === 'image') || slidedata.slideshow.find(entry => entry.type === 'image')
        cover.src = coverEntry.source;
        if(coverEntry.pixelated) cover.style.imageRendering = 'pixelated';
        slide.appendChild(cover)

        let cap = document.createElement("div");
        cap.classList = ['map-slideshow-caption']
        
        /*let button = document.createElement("button");
        button.classList = ['download-button button-blue'];
        button.innerHTML = "Read More";
        cap.appendChild(button)*/
        
        cap.innerHTML = "<a href='/maps/?id=" + slidedata.id +"'>"+ slidedata.name +"</a>";

        slide.appendChild(cap);

        document.getElementById("map-slideshow-slides").appendChild(slide)
    }

    let slideIndex = 1;
    showSlides(slideIndex);
}

fetch('./maps/content.json').then(response => response.json()).then((result) => {
    contentData = result;
    loadHomepage();
});

// Slideshow
let slideIndex = 1;
showSlides(slideIndex);

function addSlides(n) {
  showSlides(slideIndex += n);
}

function setCurrentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("map-slideshow-slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "flex";
  dots[slideIndex-1].className += " active";
}