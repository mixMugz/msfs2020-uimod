>Tested and work perfect with v.1.12.13.0 (SimUpdate 2)

<h4 align="center">
  <img alt="MSFS2020" src="logo.png">
</h4>

***This is the hub of my small UI mod's for game Microsoft Flight Simulator 2020.***

---
<h2 align="center">WARNING!</h2>
<h3>If you have installed any of my mod downloaded before `27 Dec 2020`, please remove it. This version is not compatible with old mods and may lead to problems.</h3>

---

![Discord](https://img.shields.io/discord/395223818869669889?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/mixMugz/msfs2020-uimod) ![GitHub All Releases](https://img.shields.io/github/downloads/mixMugz/msfs2020-uimod/total)

## About MOD's

1. **uimod-mugz-addcontrols**: This mod adds missing device images to the interface and shows how you can change the image of an existing device. For example, the pictures of the keyboard and mouse have been changed. Within the framework of the project, i can collect a list of all known devices. To do this, all what i need a PID device and its image in transparent PNG format with a resolution of 1200x1200.
2. **uimod-mugz-hiddentooltip**: This mod turns off all hover tooltips by default, but makes it possible to turn them ON if desired. It is enough to hold down the "ALT" key when you hover. Also, the size of the tooltips themselves has been reduced and transparency has been added (For correct operation, you must enable Show tooltip in the game).
3. **uimod-mugz-hiddenui**: This CORE mod add ability to toggle in game UI ellement (such POI/Waypoints/Gates/HUD/Nameplates, if they are enabled) on the fly by pressing one button. By default it's `BackSpace` key. For correct operation, you must install my other mod for every desired UI element. Also use F12 or NumLock key for separately toggle IngameMarkers or Hud.
4. **uimod-mugz-tinyhud**: This mod add ability to toggle InGameHud on the fly (Required: *uimod-mugz-hiddenui* mod).
5. **uimod-mugz-tinyplates**: This is tiny nameplates to replace the default monstrous ones. In addition, added functionality to turn it on/off on the fly (Required: *uimod-mugz-hiddenui* mod).
6. **uimod-mugz-tinypoi**: This is tiny POI/City/Airport nameplates. Smaller text/icon and removed Black background. In addition, added functionality to turn it on/off on the fly (Required: *uimod-mugz-hiddenui* mod).
7. **uimod-mugz-worldmap**: This small style correction for WorldMap POI/City/Airport names. Added separator for UI scale less 80%, changed smaller font size for city names and corrected line spaces.

## Known issue

- **uimod-mugz-hiddenui** is not compatible with **msfs-toolbar-nohandle** mod. This mod is integrated now.

## Installation

Just download from [release](https://github.com/mixMugz/msfs2020-uimod/releases) page archive pack and install what you need to `Community` folder.

## Removal

Just remove those folders from `Community` folder.

## FAQ

- Q: "How i can change shortcut key?"<br>A: "Change variables in `uimod-mugz-hiddenui\html_ui\mJS\mugzUI.js`. You can get the keycode on the website: https://keycode.info/

- Q: "I don't like you tinynameplates mod, can i use another mod or selfmaded?"<br>A: 'Yes! [These](https://github.com/clompsy/msfs_nameplates) nameplates must also be compatible with **uimod-mugz-hiddenui**. You can put them instead **uimod-mugz-tinyplates**. For self maded just add in *IGM_AirTraffic.css* - :root definition and change *igm-airtraffic-3d* display style to *display: var(--tgl-flex);*

- Q: "Is it compatible with the new version of the game?"<br>A: "Please! Always disable all mods before installing a new patch. Switch on with caution at your own risk. I do not exclude that my mods may not work correctly in the new version of the game. If the mod is not compatible, I will try to fix it as soon as possible."

## Finaly

>You can support my future development. Just...
<h4 align="center">
  <a href="https://paypal.me/mixmugz" title="Donate for beer"><img alt="Beer" src="beer.jpg"></a>
</h4>