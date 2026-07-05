# OBS setup — Dark Heart Labs · Anime Gothic

Canvas: **1920×1080** · Channel: **twitch.tv/darkheartlabs**

## 1. Import scene collection

1. Open **OBS Studio**
2. **Scene Collection → Import**
3. Select `obs/dark-heart-labs.anime-gothic.json`
4. If paths break after moving the repo, regenerate:

```bash
node scripts/generate-obs-collection.mjs
```

## 2. Scenes included

| Scene | Purpose |
|---|---|
| **Live** | Main stream — background, gameplay frame, chat, webcam, panels |
| **Starting Soon** | `starting soon animated.mp4` over background |
| **BRB** | BRB.png full screen |
| **Offline** | Offline.png full screen |
| **Alerts (hide until triggered)** | Subscriber + donation webm + stinger |

## 3. Wire your capture sources

The collection includes **frames and browser chat only**. Add:

1. **Live** scene → add **Display Capture** or **Game Capture**
2. Drag it **above** `BG · Main`, **below** `Frame · Gameplay`
3. Scale/crop gameplay into the frame opening (~380,70 at 58% scale)
4. Add **Video Capture Device** for webcam inside `Frame · Webcam` (bottom-right)

Suggested layer order (bottom → top):

1. BG · Main
2. Game Capture (your source)
3. Frame · Gameplay
4. Chat · Twitch Popout
5. Frame · Chatbox
6. Webcam (your source)
7. Frame · Webcam
8. Panel · Live Now
9. Panel · Rules

## 4. Chat popout

Browser source URL: `https://www.twitch.tv/popout/darkheartlabs/chat?popout=`

Log in once via **Interact** on the source if chat is blank.

## 5. Alerts & stinger

In **Alerts** scene:

- Trigger `Alert · New Subscriber` / `Alert · New Donation` via Streamlabs, OBS websocket, or manual scene switch
- `Stinger · Transition.webm` — use as **Scene Transition** or overlay in Streamlabs/OBS plugin

To set stinger as transition: **Settings → Scene Transitions → + → Stinger** → select `Transition.webm`.

## 6. Audio

Alert webms include audio if present in source files. Unmute sources in the mixer as needed.

## 7. Stream output

**Settings → Video:** 1920×1080, 30 FPS (matches collection).

**Settings → Stream:** Twitch → connect **darkheartlabs**.
