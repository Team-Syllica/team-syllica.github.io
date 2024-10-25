let contentData = {};
let articleData = {};
let teamData = {};

function loadGrid() {
  // Switch the page to Grid Mode
  document.getElementById("main-page-waiting").style.display = 'none';
  document.getElementById("main-page-grid").style.display = 'block';
  document.getElementById("main-page-article").style.display = 'none';

  let grid = new DocumentFragment();
  document.getElementById("maps-grid").innerHTML = "";
  for(let map of contentData.maps) {
    if(map.hide_in_grid) continue;
    
    let card = document.createElement("div");
    card.classList = 'map-grid-card';
    card.setAttribute("map-id", map.id);

    let cover = document.createElement("img");
    cover.classList = ['map-grid-cover-image'];
    cover.draggable = false;
    let coverEntry = map.cover || map.slideshow.find(entry => entry.cover && entry.type === 'image') || map.slideshow.find(entry => entry.type === 'image')
    cover.src = coverEntry.source;
    if(coverEntry.pixelated) cover.style.imageRendering = 'pixelated';
    card.appendChild(cover);

    let title = document.createElement("h2");
    title.classList = ['map-grid-title'];
    title.innerHTML = map.name;
    card.appendChild(title);

    let description = document.createElement("p");
    description.classList = ['map-grid-description'];
    description.innerHTML = "Loading description...";
    fetch(map.description).then(response => response.text()).then((desc) => {
      let descHtml = markdownit({html: true}).render(desc)
      let descText = descHtml.replace(/<[^>]*>/g, '')
      let cutText = (descText.length < 300 ? descText : descText.substring(0, 300) + " ...")

      description.innerHTML = cutText;
    })
    card.appendChild(description);

    function createSimpleButton(title, classList, clickCallback) {
      let button = document.createElement("button");
      button.classList = classList;
      button.innerHTML = title;
      button.onclick = clickCallback;
      return button;
    }

    let buttonpanel = document.createElement("div");
    buttonpanel.classList = ['map-grid-button-panel'];
    buttonpanel.appendChild(createSimpleButton('Download', ['download-button'], function() {
      location.href = '/maps/?id=' + map.id + "&download=latest";
    }))
    buttonpanel.appendChild(document.createTextNode(" "))
    buttonpanel.appendChild(createSimpleButton('Read More', ['download-button button-blue'], function() {
      location.href = '/maps/?id=' + map.id;
    }))
    card.appendChild(buttonpanel);

    grid.append(card);
  }

  document.getElementById("maps-grid").append(grid)
}

function loadArticle() {
  // Switch the page to Article Mode
  document.getElementById("main-page-waiting").style.display = 'none';
  document.getElementById("main-page-grid").style.display = 'none';
  document.getElementById("main-page-article").style.display = 'block';

  // Title
  document.getElementById("map-title").innerHTML = articleData.name;
  document.title = "Team Syllica | " + articleData.name;

  // Description
  getExternalContent(articleData.description, (content => {
    let renderedDescription = markdownit({html: true}).render(content)
    document.getElementById("map-description").innerHTML = renderedDescription
  }));

  // Changelog
  if(articleData.changelog) {
    getExternalContent(articleData.changelog, (content => {
      let renderedChangelog = markdownit({html: true}).render(content);
      document.getElementById("map-changelog").innerHTML = renderedChangelog;
    }));
  }

  // Tags
  document.getElementById("tags").innerHTML = "";
  for(let tag of articleData.tags) {
    let tagEl = document.createElement("a");
    tagEl.innerHTML = tag;
    document.getElementById("tags").appendChild(tagEl)

    if(articleData.tags.indexOf(tag) != articleData.tags.length-1) {
      document.getElementById("tags").appendChild(document.createTextNode(", "))
    }
  }

  // Latest release info
  let originalRelease = articleData.releases.find(release => release.version.map.version === '1.0') || false;
  let latestRelease = articleData.releases[0];
  document.getElementById('map-stats-mapversion').innerHTML = latestRelease.version.map.version;
  document.getElementById('map-stats-mcversion').innerHTML = latestRelease.version.game.version;
  document.getElementById('map-stats-playtime').innerHTML = latestRelease.playtime + "h";

  // Get other info
  let updatedDate = 'Unknown';
  if(latestRelease.mediafire_quickkey) {
    fetch('https://www.mediafire.com/api/1.5/file/get_info.php?quick_key='+ latestRelease.mediafire_quickkey +'&response_format=json', {}).then(response => response.json()).then((releasedata) => {
      let filesize = ((Math.round((parseFloat(releasedata.response.file_info.size) / 1000000) * 10) / 10) + "MB") || "Unknown";
      document.getElementById('map-stats-filesize').innerHTML = filesize;

      updatedDate = new Date(releasedata.response.file_info.created).toLocaleDateString()
      document.getElementById('map-stats-updated').innerHTML = updatedDate;

      document.getElementById("map-download").onclick = function() {
        window.open(latestRelease.link)
      }
    })
  } else {
    document.getElementById('map-stats-filesize').innerHTML = "Unknown";
    document.getElementById('map-stats-updated').innerHTML = "Unknown";
    document.getElementById('map-stats-published').innerHTML = "Unknown";
  }

  if(originalRelease && originalRelease.mediafire_quickkey) {
    fetch('https://www.mediafire.com/api/1.5/file/get_info.php?quick_key='+ originalRelease.mediafire_quickkey +'&response_format=json', {}).then(response => response.json()).then((releasedata) => {
      let updatedDate = new Date(releasedata.response.file_info.created).toLocaleDateString()
      document.getElementById('map-stats-published').innerHTML = updatedDate;
    })
  } else {
    document.getElementById('map-stats-published').innerHTML = "Unknown";
  }

  // Buttons
  if(articleData.walkthrough_link) {
    document.getElementById("map-walkthrough").style.display = "unset";
    document.getElementById("map-walkthrough").onclick = function() {
      window.open(articleData.walkthrough_link)
    }
  } else {
    document.getElementById("map-walkthrough").style.display = "none";
  }

  if(articleData.server_info) {
    document.getElementById("map-servers").style.display = "unset";
    if(articleData.server_info.type === 'popup') {
      // Fetch data
      fetch(articleData.server_info.source).then((response) => response.text()).then((mdData) => {
        let renderedPage = markdownit({html: true}).render(mdData);

        document.getElementById("map-servers").onclick = function() {
          showPopup(renderedPage)
        }
      })
    } else if(articleData.server_info.type === 'link') {
      document.getElementById("map-servers").onclick = function() {
        window.open(articleData.server_info.source)
      }
    }
  } else {
    document.getElementById("map-servers").style.display = "none";
  }

  if(articleData.shader_info) {
    document.getElementById("map-shaders").style.display = "unset";
    if(articleData.shader_info.type === 'popup') {
      // Fetch data
      fetch(articleData.shader_info.source).then((response) => response.text()).then((mdData) => {
        let renderedPage = markdownit({html: true}).render(mdData);

        document.getElementById("map-shaders").onclick = function() {
          showPopup(renderedPage)
        }
      })
    } else if(articleData.shader_info.type === 'link') {
      document.getElementById("map-shaders").onclick = function() {
        window.open(articleData.shader_info.source)
      }
    }
  } else {
    document.getElementById("map-shaders").style.display = "none";
  }

  if(articleData.resource_pack) {
    document.getElementById("map-rp").style.display = "unset";
    document.getElementById("map-rp").onclick = function() {
      window.open(articleData.resource_pack.link)
    }
  } else {
    document.getElementById("map-rp").style.display = "none";
  }
  
  // Credits
  document.getElementById("credits-list").innerHTML = "";
  for(let entry of articleData.credits) {
    let trueEntry = Object.assign((Object.keys(teamData).includes(entry.name) ? teamData[entry.name] : {}), entry)

    let card = document.createElement("div");
    card.classList = ['credits-card'];

    let faceEl = document.createElement('canvas');
    faceEl.classList = ['player-face'];
    faceEl.width = 8;
    faceEl.height = 8;

    // Render the face from the player's current skin
    function drawFace(texture) {
      let ctx = faceEl.getContext('2d');

      let img = new Image()
      img.src = texture;

      img.onload = function() {
        ctx.fillRect(0, 0, faceEl.width, faceEl.height);
        ctx.drawImage(img, 8, 8, 8, 8, 0, 0, faceEl.width, faceEl.height);
        ctx.drawImage(img, 40, 8, 8, 8, 0, 0, faceEl.width, faceEl.height);
      }
    }
    fetch('https://api.ashcon.app/mojang/v2/user/' + entry.name).then((response) => response.json()).then(data => {
      drawFace('data:image/png;base64,' + data.textures.skin.data)
    })

    card.appendChild(faceEl);

    card.appendChild(document.createTextNode(" "));

    let playername = document.createElement("b");
    playername.innerHTML = entry.name;
    card.appendChild(playername);

    card.appendChild(document.createElement("br"));
    
    let roles = document.createElement("span");
    roles.innerHTML = trueEntry.roles.join(", ");
    card.appendChild(roles);

    document.getElementById("credits-list").appendChild(card);
  }

  // Slideshow
  if(articleData.slideshow) {
      document.getElementById("map-slideshow-slides").innerHTML = "";
      document.getElementById("map-slideshow-progress").innerHTML = "";
  
      for(let i = 0; i < articleData.slideshow.length; i++) {
          let slidedata = articleData.slideshow[i];

          let dot = document.createElement("span")
          dot.classList = ["dot"];
          dot.setAttribute("onclick", "setCurrentSlide(" + (i + 1) + ")");
          document.getElementById("map-slideshow-progress").append(dot)

          let slide = document.createElement("div");
          slide.classList = ['map-slideshow-slide fade'];
          let progresslabel = document.createElement('div');
          progresslabel.classList = ['numbertext'];
          progresslabel.innerHTML = (i + 1) + " / " + articleData.slideshow.length
          slide.appendChild(progresslabel);

          if(slidedata.type === 'image') {
              let content = document.createElement("img");
              content.classList = ['map-slideshow-slide-content'];

              content.src = slidedata.source;
              if(slidedata.pixelated) content.style.imageRendering = 'pixelated';
              slide.appendChild(content)
          } else if (slidedata.type === 'youtube_embed') {
              let content = document.createElement("iframe");
              content.classList = ['map-slideshow-slide-content'];

              content.src = slidedata.source;
              content.setAttribute("title", "YouTube video player");
              content.setAttribute("frameborder", "0");
              content.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
              content.setAttribute("referrerpolicy", "strict-origin-when-cross-origin")
              content.setAttribute("allowfullscreen", "")

              slide.appendChild(content)
          }

          if(slidedata.caption) {
              let cap = document.createElement("div");
              cap.classList = ['map-slideshow-caption']
              cap.innerHTML = slidedata.caption;
              slide.appendChild(cap);
          }

          document.getElementById("map-slideshow-slides").appendChild(slide)
      }

      let slideIndex = 1;
      showSlides(slideIndex);
  }

  // Past versions popup
  document.getElementById("map-past-version-content").innerHTML = '';
  for(let release_entry of articleData.releases) {
    function createCell(content) {
      let cell = document.createElement("td")
      cell.innerHTML = content;
      return cell;
    }

    let row = document.createElement("tr");
    row.appendChild(createCell(release_entry.version.map.version))
    row.appendChild(createCell(release_entry.version.game.version))

    let date = createCell('loading...')
    let size = createCell('loading...')
    row.appendChild(date)
    row.appendChild(size)

    fetch('https://www.mediafire.com/api/1.5/file/get_info.php?quick_key='+ release_entry.mediafire_quickkey +'&response_format=json', {}).then(response => response.json()).then((releasedata) => {
      let filesize = ((Math.round((parseFloat(releasedata.response.file_info.size) / 1000000) * 10) / 10) + "MB") || "Unknown";
      size.innerHTML = filesize;

      let dateString = new Date(releasedata.response.file_info.created).toLocaleDateString()
      date.innerHTML = dateString;
    })

    row.appendChild(createCell("<a href='"+ release_entry.link +"' target='_blank'>MediaFire</a>"))
    document.getElementById("map-past-version-content").appendChild(row);
  }
}

async function getArticle() {
  teamData = await fetch('/team/members.json').then(response => response.json());

  let params = new URLSearchParams(location.search);

  // No id parameter
  if(!params.has("id")){
    getExternalContent('./content.json', (content => {
      contentData = JSON.parse(content)
      loadGrid();
    }))

    return false;
  }

  // Has an id parameter
  getExternalContent('./content.json', (content => {
      contentData = JSON.parse(content)

      // The ID specified exists
      let data = contentData.maps.find(map => params.get("id") == map.id)
      if(data){
        articleData = data;

        // Determine what to do with the page
        if(params.has('download')) {
          if(params.get('download') == 'latest') {
            // Download the latest release
            let latestRelease = articleData.releases[0];
            location.href = latestRelease.link;
          } else if(params.get('download') == 'rp' && articleData.resource_pack) {
            // Download the resource pack
            location.href = articleData.resource_pack.link;
          } else {
            // Find the specified version
            let targetVersion = params.get('download')
            let release = articleData.releases.find(entry => entry.version.map.version == targetVersion) || false;
            if(!release) {
              // No release found that specifies the download version, load article instead
              initializeArticle();
              return;
            } else {
              location.href = release.link;
            }
          }
        } else {
          // The parameters do not have a download argument, load the article as-is
          initializeArticle();
          return;
        }

        function initializeArticle() {
          loadArticle();
          if(params.has('server_info') && articleData.server_info) {
            if(articleData.server_info.type === 'popup') {
              // Fetch data
              fetch(articleData.server_info.source).then((response) => response.text()).then((mdData) => {
                let renderedPage = markdownit({html: true}).render(mdData);
                showPopup(renderedPage)
              })
            } else if(articleData.server_info.type === 'link') {
              location.href = articleData.server_info.source
            }
          } else if(params.has('shader_info') && articleData.shader_info) {
            if(articleData.shader_info.type === 'popup') {
              // Fetch data
              fetch(articleData.shader_info.source).then((response) => response.text()).then((mdData) => {
                let renderedPage = markdownit({html: true}).render(mdData);
                showPopup(renderedPage)
              })
            } else if(articleData.shader_info.type === 'link') {
              location.href = articleData.shader_info.source
            }
          }
        }
      } else {
        loadGrid();
        return;
      }
  }))
}

getArticle()

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

function showPastVersionsPopup() {
  if(!document.getElementById("overlay")) return;

  document.getElementById("past-versions-popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";

  document.body.style.overflow = 'hidden';
}