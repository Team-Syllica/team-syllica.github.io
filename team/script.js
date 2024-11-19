let teamData = false;
async function getData() {
    teamData = await fetch('/team/members.json').then(response => response.json());
    
    renderPage()
}

function renderPage () {
    let memberNames = Object.keys(teamData).filter(name => !name.startsWith("//"));

    function generateCard (member, membername) {
        let card = document.createElement("div");
        card.classList = ['team-card'];

        let picture = document.createElement("img");
        picture.src = member.picture;
        picture.classList = ['team-card-image'];
        card.appendChild(picture);

        let cardcontent = document.createElement("div");
        cardcontent.classList = ['team-card-content'];

        let cardtop = document.createElement("div");
        cardtop.classList = ['team-card-top'];

        let cardtopleft = document.createElement("div");
        cardtopleft.classList = ['team-card-top-left'];

        let playername = document.createElement("h2");
        playername.classList = ['team-card-name']
        playername.innerHTML = membername;
        cardtopleft.appendChild(playername);

        let cardinfobar = document.createElement("div");
        cardinfobar.classList = ['team-card-infobar'];

        let pronouns = document.createElement("span");
        pronouns.classList = ['team-card-pronouns'];
        pronouns.innerHTML = member.pronouns;
        cardinfobar.appendChild(pronouns);

        cardinfobar.appendChild(document.createTextNode(" • "));

        let status = document.createElement("span");
        status.classList = ['team-card-pronouns'];
        status.innerHTML = member.team_status;
        cardinfobar.appendChild(status);

        cardtopleft.appendChild(cardinfobar);

        let quote = document.createElement("span");
        quote.classList = ['team-card-quote'];
        quote.innerHTML = member.quote;
        cardtopleft.appendChild(quote);        

        cardtop.appendChild(cardtopleft);

        let cardtopright = document.createElement("div");
        cardtopright.classList = ['team-card-top-right'];

        cardtopright.append(generateSocials(member.socials, 'team-card-social-link'));

        cardtop.appendChild(cardtopright);

        cardcontent.appendChild(cardtop);
        cardcontent.appendChild(document.createElement("hr"));

        let description = document.createElement("div");
        description.classList = ['team-card-description']
        description.innerText = member.description;
        cardcontent.appendChild(description);

        cardcontent.appendChild(document.createElement("br"));
        let responsibilities = document.createElement("span");
        responsibilities.classList = ['team-card-roles'];
        responsibilities.innerHTML = member.roles.join(", ");
        cardcontent.appendChild(responsibilities);

        card.appendChild(cardcontent);
        return card;
    }

    document.getElementById("team-content").innerHTML = "";
    for(let membername of memberNames) {
        let member = teamData[membername];
        let card = generateCard(member, membername);

        document.getElementById('team-content').appendChild(card);
    }
}

getData()