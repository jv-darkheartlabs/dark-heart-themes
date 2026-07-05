#!/usr/bin/env node
/**
 * Generates OBS scene collection with absolute asset paths for this machine.
 * Run: node scripts/generate-obs-collection.mjs
 */
import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const assets = join(root, "assets", "anime-gothic-pack");

const p = (...parts) => join(assets, ...parts);

function imageSource(name, file) {
  const uuid = randomUUID();
  return {
    source: {
      id: "image_source",
      name,
      uuid,
      versioned_id: "image_source",
      settings: { file, unload_when_not_visible: false },
      mixers: 0,
      sync: 0,
      flags: 0,
      volume: 1,
      balance: 0.5,
      enabled: true,
      muted: false,
      "push-to-mute": false,
      "push-to-mute-delay": 0,
      "push-to-talk": false,
      "push-to-talk-delay": 0,
      hotkeys: {},
      deinterlace_mode: 0,
      deinterlace_field_order: 0,
      monitoring_type: 0,
      private_settings: {},
    },
    uuid,
  };
}

function mediaSource(name, file, loop = true) {
  const uuid = randomUUID();
  return {
    source: {
      id: "ffmpeg_source",
      name,
      uuid,
      versioned_id: "ffmpeg_source",
      settings: {
        local_file: file,
        looping: loop,
        restart_on_activate: true,
        close_when_inactive: false,
        hw_decode: true,
      },
      mixers: 255,
      sync: 0,
      flags: 0,
      volume: 1,
      balance: 0.5,
      enabled: true,
      muted: false,
      "push-to-mute": false,
      "push-to-mute-delay": 0,
      "push-to-talk": false,
      "push-to-talk-delay": 0,
      hotkeys: {},
      deinterlace_mode: 0,
      deinterlace_field_order: 0,
      monitoring_type: 0,
      private_settings: {},
    },
    uuid,
  };
}

function browserSource(name, url) {
  const uuid = randomUUID();
  return {
    source: {
      id: "browser_source",
      name,
      uuid,
      versioned_id: "browser_source",
      settings: {
        url,
        width: 720,
        height: 1020,
        fps: 30,
        shutdown: true,
        restart_when_active: false,
      },
      mixers: 255,
      sync: 0,
      flags: 0,
      volume: 1,
      balance: 0.5,
      enabled: true,
      muted: false,
      "push-to-mute": false,
      "push-to-mute-delay": 0,
      "push-to-talk": false,
      "push-to-talk-delay": 0,
      hotkeys: {},
      deinterlace_mode: 0,
      deinterlace_field_order: 0,
      monitoring_type: 0,
      private_settings: {},
    },
    uuid,
  };
}

function sceneItem(name, sourceUuid, id, pos, scale, bounds = null) {
  const item = {
    name,
    source_uuid: sourceUuid,
    visible: true,
    locked: false,
    rot: 0,
    scale_ref: { x: 1920, y: 1080 },
    align: 5,
    bounds_type: bounds ? 1 : 0,
    bounds_align: 0,
    bounds: bounds ?? { x: 0, y: 0 },
    crop_left: 0,
    crop_top: 0,
    crop_right: 0,
    crop_bottom: 0,
    id,
    group_item_backup: false,
    pos,
    scale,
    scale_filter: "disable",
    blend_method: "default",
    blend_type: "normal",
    show_transition: { duration: 0 },
    hide_transition: { duration: 0 },
    private_settings: {},
  };
  return item;
}

const bg = imageSource("BG · Main", p("Background Screens", "Background.png"));
const brb = imageSource("BG · BRB", p("Background Screens", "BRB.png"));
const offline = imageSource("BG · Offline", p("Background Screens", "Offline.png"));
const chatFrame = imageSource("Frame · Chatbox", p("Frames", "Chatbox.png"));
const gameFrame = imageSource("Frame · Gameplay", p("Frames", "Gameplay frame.png"));
const camFrame = imageSource("Frame · Webcam", p("Frames", "Webcam frame.png"));
const livePanel = imageSource("Panel · Live Now", p("Alerts Panels", "Live now.png"));
const rulesPanel = imageSource("Panel · Rules", p("Alerts Panels", "rules.png"));
const startingSoon = mediaSource(
  "Media · Starting Soon",
  p("Screen Transition Alerts Background", "starting soon animated.mp4"),
  true
);
const alertSub = mediaSource(
  "Alert · New Subscriber",
  p("Screen Transition Alerts Background", "new subscriber animated.webm"),
  false
);
const alertDonation = mediaSource(
  "Alert · New Donation",
  p("Screen Transition Alerts Background", "new donation animated.webm"),
  false
);
const stinger = mediaSource(
  "Stinger · Transition",
  p("Screen Transition Alerts Background", "Transition.webm"),
  false
);
const chatBrowser = browserSource(
  "Chat · Twitch Popout",
  "https://www.twitch.tv/popout/darkheartlabs/chat?popout="
);

const sources = [
  bg,
  brb,
  offline,
  chatFrame,
  gameFrame,
  camFrame,
  livePanel,
  rulesPanel,
  startingSoon,
  alertSub,
  alertDonation,
  stinger,
  chatBrowser,
].map((x) => x.source);

function makeScene(name, items) {
  const uuid = randomUUID();
  return {
    scene: {
      name,
      uuid,
      id: randomUUID(),
      versioned_id: "scene",
      settings: {
        id_counter: items.length + 1,
        custom_size: false,
        items,
      },
    },
    uuid,
  };
}

const liveItems = [
  sceneItem("BG · Main", bg.uuid, 1, { x: 0, y: 0 }, { x: 1, y: 1 }),
  sceneItem(
    "Frame · Gameplay",
    gameFrame.uuid,
    2,
    { x: 380, y: 70 },
    { x: 0.58, y: 0.58 }
  ),
  sceneItem(
    "Frame · Chatbox",
    chatFrame.uuid,
    3,
    { x: 20, y: 30 },
    { x: 0.42, y: 0.42 }
  ),
  sceneItem(
    "Chat · Twitch Popout",
    chatBrowser.uuid,
    4,
    { x: 95, y: 120 },
    { x: 0.34, y: 0.34 },
    { x: 340, y: 880 }
  ),
  sceneItem(
    "Frame · Webcam",
    camFrame.uuid,
    5,
    { x: 1480, y: 720 },
    { x: 0.22, y: 0.22 }
  ),
  sceneItem(
    "Panel · Live Now",
    livePanel.uuid,
    6,
    { x: 1320, y: 40 },
    { x: 0.55, y: 0.55 }
  ),
  sceneItem(
    "Panel · Rules",
    rulesPanel.uuid,
    7,
    { x: 380, y: 900 },
    { x: 0.45, y: 0.45 }
  ),
];

const brbItems = [
  sceneItem("BG · BRB", brb.uuid, 1, { x: 0, y: 0 }, { x: 1, y: 1 }),
];

const offlineItems = [
  sceneItem("BG · Offline", offline.uuid, 1, { x: 0, y: 0 }, { x: 1, y: 1 }),
];

const startingItems = [
  sceneItem("BG · Main", bg.uuid, 1, { x: 0, y: 0 }, { x: 1, y: 1 }),
  sceneItem(
    "Media · Starting Soon",
    startingSoon.uuid,
    2,
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ),
];

const alertsItems = [
  sceneItem("BG · Main", bg.uuid, 1, { x: 0, y: 0 }, { x: 1, y: 1 }),
  sceneItem(
    "Alert · New Subscriber",
    alertSub.uuid,
    2,
    { x: 560, y: 140 },
    { x: 0.85, y: 0.85 }
  ),
  sceneItem(
    "Alert · New Donation",
    alertDonation.uuid,
    3,
    { x: 560, y: 140 },
    { x: 0.85, y: 0.85 }
  ),
  sceneItem(
    "Stinger · Transition",
    stinger.uuid,
    4,
    { x: 0, y: 0 },
    { x: 1, y: 1 }
  ),
];

const live = makeScene("Live", liveItems);
const brbScene = makeScene("BRB", brbItems);
const offlineScene = makeScene("Offline", offlineItems);
const startingScene = makeScene("Starting Soon", startingItems);
const alertsScene = makeScene("Alerts (hide until triggered)", alertsItems);

const collection = {
  current_scene: "Live",
  current_program_scene: "Live",
  scene_order: [
    { name: "Live" },
    { name: "Starting Soon" },
    { name: "BRB" },
    { name: "Offline" },
    { name: "Alerts (hide until triggered)" },
  ],
  name: "Dark Heart Labs · Anime Gothic",
  sources,
  scenes: [
    live.scene,
    startingScene.scene,
    brbScene.scene,
    offlineScene.scene,
    alertsScene.scene,
  ],
  groups: [],
  transitions: [],
  quick_transitions: [],
  saved_projectors: [],
  current_transition: "Fade",
  transition_duration: 300,
  resolution: { x: 1920, y: 1080 },
  fps: 30,
};

const out = join(root, "streaming", "anime-gothic", "obs", "dark-heart-labs.anime-gothic.json");
writeFileSync(out, JSON.stringify(collection, null, 2));
console.log(`Wrote ${out}`);
