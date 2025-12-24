# Team Syllica website!
The Team Syllica website, hosting all of our map content and handy guides on how to play!

## Pages
- [`/`](https://syllica.team/) - The homepage of the website
- [`/team/`](https://syllica.team/team/) - Meet the Team
- [`/maps/`](https://syllica.team/maps/) - All our released maps. Params:
  - `?id=TKL1` - The map page with ID "TKL1". If no ID matches content.json, this field is ignored and the maps grid is loaded instead.
  - `&shader_info` - Requires a valid Map ID, optional. Opens the Shader Info popup, if it exists.
  - `&server_info` - Requires a valid Map ID, optional. Opens the Server Info popup, if it exists for the article. Takes priority over Shader Info.
  - `&walkthrough` - Requires a valid Map ID, optional. Redirects to the map's walkthrough video, if it exists. Takes priority over opening popups.
  - `&download` - Requires a valid Map ID, optional. Opens a download redirect. Takes priority over all others. 
    - `download=latest` - Redirects to the latest released download of the opened map.
    - `download=rp` - Redirects to the resource pack download of the latest released version of the opened map, if it exists. Otherwise, does nothing.
    - `download=1.1` - Redirects to the v1.1 download of the opened map, if it exists. Otherwise, does nothing.
  - `#v-1-1` - Scrolls the page to the header titled "v1.1" in the changelog. 

## Content
Some JSON files are maintained on this website and can be used in external tools.

### Maps
All of our latest map info can very easily be accessed by reading [/maps/content.json](https://syllica.team/maps/content.json). This will allow links to things such as marketing images and icons, full Markdown versions of all changelogs, official notes on server/shader compatibility and mapmaker credits as they apear in-game. 

Each map is represented in the JSON file using objects.
```json
{
  "id": "MAP1", // The map's ID (shown in in-game debug codes)
  "name": "My Map: Chapter 1", // The map's title. Will be used on the article page as the title
  "cover": { "type": "image", "source": "/maps/MAP1/cover.png" }, // The cover image. Optional. Must be of type "image". Used to display the map in the maps grid. If unspecified, defaults to the first "image" type element in the slideshow
  "icon": { "type": "image", "source": "/maps/MAP1/icon.png" }, // The map's icon to be displayed in the navigation bar

  "releases": [ /*...*/ ], // See section below. Contains release objects
  "resource_pack": {
      "map_version": "1.0", // The MAP VERSION (not MC version) that the Resource Pack is for. Only one RP can be defined at a time.
      "link": "https://www.mediafire.com/file/KEY/MAP1-v1.0_Resources.zip/file", // The link to the mediafire download
      "mediafire_quickkey": "KEY" // The mediafire file's quickkey (used for fetching stats from the MediaFire API)
  },

  "tags": [ // Tags to be used in an upcoming search feature
    "singleplayer", "puzzle", "custom_music", "custom_textures", "story", "kitatcho", "team_syllica"
  ],

  "credits": [
      {
          "name": "Person", // The person's name. /team/members.json will autofill the undeclared fields in each object according to this value
          "roles": ["Director", "Builds", "Textures", "Music", "Storywriting", "Puzzle Design"],
          "main_team": true // Whether this credit would appear as a main team member or not
      },
      {
          "name": "NicoSlayerr",
          "roles": ["Builds"],
          "main_team": true,
          "skin": "/assets/img/skins/NicoSlayerr.png"
      }
  ],
  
  "slideshow": [ // All items in this slideshow must be either youtube_embed or image.
      { "type": "youtube_embed", "source": "https://www.youtube-nocookie.com/embed/YT_VIDEO_ID" },
      { "type": "image", "source": "/maps/MAP1/title.png" },
      { "type": "image", "source": "/maps/MAP1/showcase_1.png" },
      { "type": "image", "source": "/maps/MAP1/showcase_2.png" },
      { "type": "image", "source": "/maps/MAP1/showcase_3.png" }
  ],

  "server_info": {
      "type": "popup", // "popup" or "link" (required). "popup" will show a custom popup generated from a markdown file, whereas "link" will be an external redirect. 
      "source": "/maps/MAP1/server_info.md" // The link to the source material (an external link or markdown file)
  },
  "shader_info": {
      "type": "popup", // "popup" or "link" (required). "popup" will show a custom popup generated from a markdown file, whereas "link" will be an external redirect. 
      "source": "/maps/MAP1/shader_info.md" // The link to the source material (an external link or markdown file)
  },

  "description": "/maps/MAP1/description.md", // The map's description. Will be appended before the changelog in the map's article
  "changelog": "/maps/MAP1/changelog.md", // The changelog of the map in markdown format. Required.
  "walkthrough_link": "link to an external page", // A link to the walkthrough (optional). If present, will show a "walkthrough" button on the map's article page
  "promotion": false, // Whether this is included as promotional content (e.g. content not produced by Team Syllica)

  "custom_page": "/maps/MAP1/page.html" // Optional. A custom HTML page that replaces the entire article.
}
```

#### Releases
Each map has a `releases` array, containing "release objects". Only official stable releases of each map are published on this website, betas are left in the Discord Server.

Example of a release object:
```json
{
    "version": {
        "map": { "id": "TKL1", "dev": 0, "version": "1.7", "beta": 0 },
        "game": { "data_version": 4189, "version": "1.21.4" }
    },
    "link": "https://www.mediafire.com/file/mrkmdadq21fqlss/(v1.7)+The+Kitatcho+Laboratories+1.zip/file",
    "mediafire_quickkey": "mrkmdadq21fqlss",
    "playtime": 2.5,
    "warning": {
        "source": "/maps/TKL1/warnings/download.md"
    }
}
```

`releases[0]` will always be the latest release, `releases[1]` the second latest, and so on. The precise release date of each release can be extracted via the [MediaFire API](https://www.mediafire.com/developers/core_api/1.5/getting_started/), making use of the `mediafire_quickkey` field. 

`playtime` is measured in hours. 

The `version` object holds Team Syllica versioning data. This object is identical to the SNBT object found inside the map (as of recent versions) at `(map)/data/command_storage_syllica.nbt`. It can also be accessed in-game on all maps with `/data get storage syllica:version`.   

`version.map`: `dev` and `beta` are booleans which are stored as `0`/`1` to reflect the NBT byte format. `id` is the Map ID, which should be identical to that found in the release object. `version` is this release's version as listed on the website, in-game and in the changelog.

`version.game`: `data_version` is the [Minecraft: Java Edition Data Version](https://minecraft.wiki/w/Data_version#List_of_data_versions) for which the map was built. `version` is a string representation of the same Minecraft version.

`warning` (optional) will show a popup with the contents specified at `warning.source` before allowing the user to download that version. 

### Team Details
Info about current Team Syllica members is available at [/team/members.json](https://syllica.team/team/members.json). 