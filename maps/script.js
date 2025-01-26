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
      let descHtml = markdown.render(desc)
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

async function loadArticle() {
  // Switch the page to Article Mode
  document.getElementById("main-page-waiting").style.display = 'none';
  document.getElementById("main-page-grid").style.display = 'none';
  document.getElementById("main-page-article").style.display = 'block';

  // Title
  document.getElementById("map-title").innerHTML = articleData.name;
  document.title = "Team Syllica | " + articleData.name;

  // Description
  let descriptionContent = await fetch(articleData.description).then((responseContent) => responseContent.text());
  let renderedDescription = markdown.render(descriptionContent)
  document.getElementById("map-description").innerHTML = renderedDescription;

  // Changelog
  if(articleData.changelog) {
    let changelogContent = await fetch(articleData.changelog).then((responseContent) => responseContent.text());
    let renderedChangelog = markdown.render(changelogContent)
    document.getElementById("map-changelog").innerHTML = renderedChangelog;
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
        downloadRelease(latestRelease, true);
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
        let renderedPage = markdown.render(mdData);

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
        let renderedPage = markdown.render(mdData);

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

    let card_top = document.createElement("div");
    card_top.classList = ['credits-card-title'];

    let card_name = document.createElement("div");
    card_name.classList = ['credits-card-name'];

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
    if(trueEntry.skin) {
      // Use the predefined skin file present in the user data
      drawFace(trueEntry.skin)
    } else {
      // Fetch the last known skin from the Minecraft: Java Edition username using the ashcon.app API
      fetch('https://api.ashcon.app/mojang/v2/user/' + trueEntry.name).then((response) => response.json()).then(data => {
        drawFace('data:image/png;base64,' + data.textures.skin.data)
      })
    }

    card_name.appendChild(faceEl);
    card_name.appendChild(document.createTextNode(" "));

    let playername = document.createElement("b");
    playername.innerHTML = trueEntry.name;
    card_name.appendChild(playername);
    card_top.appendChild(card_name);

    // Render socials
    let card_socials = document.createElement("div");
    card_socials.classList = ['credits-card-socials'];

    let socials = trueEntry.socials || {};
    card_socials.append(generateSocials(socials, 'credits-card-social-link'));
    card_top.appendChild(card_socials);

    card.appendChild(card_top);
    
    let card_description = document.createElement("div");
    card_description.classList = ['credits-card-description'];

    let roles = document.createElement("span");
    roles.innerHTML = trueEntry.roles.join(", ");
    card_description.appendChild(roles);

    card.appendChild(card_description);

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

    let linkCell = document.createElement("td");
    let link = document.createElement('a');
    link.onclick = function() {
      downloadRelease(release_entry);
    }
    link.innerHTML = 'Download';
    link.href = 'javascript:void(0)';

    linkCell.appendChild(link);
    row.appendChild(linkCell);

    document.getElementById("map-past-version-content").appendChild(row);
  }

  return;
}

async function getArticle() {
  teamData = await fetch('/team/members.json').then(response => response.json());

  let params = new URLSearchParams(location.search);

  contentData = await fetch('./content.json').then(resp => resp.json());
  loadGrid();

  // No id parameter
  if(!params.has("id")){
    return false;
  }

  // The ID specified exists
  let data = contentData.maps.find(map => params.get("id") == map.id)
  if(data){
    articleData = data;

    // Determine what to do with the page
    await initializeArticle();
    if(params.has('download')) {
      if(params.get('download') == 'latest') {
        // Download the latest release
        let latestRelease = articleData.releases[0];
        downloadRelease(latestRelease);
      } else if(params.get('download') == 'rp' && articleData.resource_pack) {
        // Download the resource pack
        location.href = articleData.resource_pack.link;
      } else {
        // Find the specified version
        let targetVersion = params.get('download')
        let release = articleData.releases.find(entry => entry.version.map.version == targetVersion) || false;
        if(!release) {
          // No release found that specifies the download version, load article instead
          
          return;
        } else {
          // A release object was found, download it
          downloadRelease(release)
        }
      }
    } else {
      // The parameters do not have a download argument, load the article as-is

      // Scroll to the hash and apply animation
      let referencedElement = document.getElementById(location.hash.replace("#", ""))
      if(referencedElement) {
        referencedElement.scrollIntoViewIfNeeded({behavior:'smooth'});
        referencedElement.classList.toggle('target', true)
        //referencedElement.nextElementSibling.classList.toggle('target', true)
      }
      return;
    }

    async function initializeArticle() {
      await loadArticle();
      if(params.has('walktrhough') && articleData.walkthrough_link) {
        location.href = articleData.walkthrough_link
      } else if(params.has('server_info') && articleData.server_info) {
        if(articleData.server_info.type === 'popup') {
          // Fetch data
          fetch(articleData.server_info.source).then((response) => response.text()).then((mdData) => {
            let renderedPage = markdown.render(mdData);
            showPopup(renderedPage)
          })
        } else if(articleData.server_info.type === 'link') {
          location.href = articleData.server_info.source
        }
      } else if(params.has('shader_info') && articleData.shader_info) {
        if(articleData.shader_info.type === 'popup') {
          // Fetch data
          fetch(articleData.shader_info.source).then((response) => response.text()).then((mdData) => {
            let renderedPage = markdown.render(mdData);
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
}

getArticle()

// Download
function downloadRelease(releaseobj, new_window = false) {
  if(!releaseobj.warning) {
    if(new_window){
      window.open(releaseobj.link);
    } else {
      location.href = releaseobj.link;
    }
  } else {
    fetch(releaseobj.warning.source).then((response) => response.text()).then((mdData) => {
      let renderedPage = markdown.render(mdData);

      renderedPage += '<br><button class="download-button" id="map-download" onclick="downloadRelease({link: \''+ releaseobj.link +'\'}, '+ new_window +')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>download</title><path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"></path></svg><span>Map Download</span></button>';

      closePopup()
      showPopup(renderedPage)
    })
  }
}

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