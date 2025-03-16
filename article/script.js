let articleData = false;
async function getData() {
    let params = new URLSearchParams(location.search);
    if(!params.has("id")) location.href = '/';

    try {
        articleData = await fetch('/article/'+ params.get("id") +'.md').then(response => response.text());
    } catch(e) {
        location.href = '/';
    }
    
    renderPage()
}

function renderPage () {
    document.getElementById("article-content").innerHTML = markdown.render(articleData);

    // Make the first title the article's title
    document.querySelector("h1").classList.toggle("title", true);
    document.querySelector("h1").classList.toggle("center-title", true);
}

getData()