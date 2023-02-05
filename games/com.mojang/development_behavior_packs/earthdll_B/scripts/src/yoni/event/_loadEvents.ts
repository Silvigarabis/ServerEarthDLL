import { logger } from "./logger.js";

// @ts-nocheck
const eventList = [
  "./entity/EntityMovementEvent.js",
  "./player/PlayerDeadEvent.js",
  "./player/PlayerRespawnEvent.js",
  "./player/PlayerJoinedEvent.js",
  "./player/PlayerTeleportDimensionEvent.js",
  "./world/raid/RaidTriggerEvent.js",
  "./world/TickEvent.js",
];

eventList.map(path=>import(path)).forEach(pro => pro.catch(logger.error));
