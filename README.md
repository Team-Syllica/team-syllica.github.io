# Team Syllica website!
The Team Syllica website, hosting all of our map content and handy guides on how to play!

## Pages
- [`/`](https://syllica.team/) - The homepage of the website
- [`/team/`](https://syllica.team/team/) - Meet the Team
- [`/maps/`](https://syllica.team/maps/) - All our released maps. Params:
  - `?id=TKL1` - The map page with ID "TKL1". If no ID matches content.json, this field is ignored and the maps grid is loaded instead.
  - `&shader_info` - Requires a valid Map ID, optional. Opens the Shader Info popup, if it exists.
  - `&server_info` - Requires a valid Map ID, optional.Opens the Server Info popup, if it exists for the article. Takes priority over Shader Info.
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

Each map has a `releases` array, containing "release objects". Only official stable releases of each map are published on this website, betas are left in the Discord Server.

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