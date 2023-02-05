// @ts-nocheck
//导出各种东西
//同时修改globalThis

//防止被狗咬死（实际测试中，发现如果游戏很卡，还是会被咬死（掉到1tps的时候）
import "./WatchBird.js";
import {
    EntityBase,
    Entity,
    Player,
    SimulatedPlayer,
    YoniEntity,
    YoniPlayer,
    YoniSimulatedPlayer
} from "./entity.js";
import {
    Minecraft,
    Gametest,
    MinecraftGui,
    VanillaWorld,
    VanillaScoreboard,
    VanillaEvents,
    dim,
    runTask
} from "./basis.js";
import { Logger, log } from "./util/Logger.js";
import { World } from "./world.js";
import { Command } from "./command.js";
import {
    EventListener,
    EventTypes,
    EventSignal,
    events,
} from "./event.js";
import { Scoreboard, Entry, Objective } from "./scoreboard.js";
import {
    Schedule,
    YoniScheduler
} from "./schedule.js";
import { isDebug, injectGlobal, debug } from "./debug.js";
import * as YoniUtilUtils from "./util/utils.js";
import { ChatCommand } from "./util/ChatCommand.js";
import { Location } from "./Location.js";

export const Utils = (()=>{
    let obj = {};
    for (let key in YoniUtilUtils){
        obj[key] = YoniUtilUtils[key];
    }
    return obj;
})();

export const Yoni = {
    isDebug,
    injectGlobal,
    debug,
}

export const Vanilla = {
    Minecraft,
    MinecraftGui,
    Gametest,
    world: VanillaWorld,
    EventTypes: VanillaEvents,
    Scoreboard: VanillaScoreboard
}

export {
    isDebug,
    
    EventTypes,
    EventListener,
    EventSignal,
    events,
    
    Scoreboard,
    Objective,
    Entry,
    
    World,
    
    dim,
    Minecraft,
    MinecraftGui,
    Gametest,
    VanillaWorld,
    VanillaEvents,
    VanillaScoreboard,
    runTask,
    
    Logger,
    log,
    console,
    
    YoniScheduler,
    Schedule,
    
    Command,
    ChatCommand,
    
    EntityBase,
    Player,
    Entity,
    SimulatedPlayer,
    YoniEntity,
    YoniPlayer,
    YoniSimulatedPlayer,
    
    Utils,
    Location
}

if (injectGlobal){
    globalThis.Yoni = Yoni;
    globalThis.dim = dim;
    globalThis.runTask = runTask;
    globalThis.Logger = Logger;
    globalThis.world = World;
    globalThis.EntityBase = EntityBase;
    globalThis.Entity = Entity;
    globalThis.YoniEntity = Entity;
    globalThis.Player = Player;
    globalThis.SimulatedEntity = SimulatedPlayer;
    globalThis.EventTypes = EventTypes;
    globalThis.EventListener = EventListener;
    globalThis.Command = Command;
    globalThis.Scoreboard = Scoreboard;
    globalThis.ScoreboardEntry = Entry;
    globalThis.ScoreboardObjective = Objective;
    globalThis.YoniScheduler = YoniScheduler;
    globalThis.Schedule = Schedule;
    globalThis.ChatCommand = ChatCommand;
    globalThis.Minecraft = Minecraft;
    
    globalThis.Vanilla = Vanilla;
    
    globalThis.Location = Location;
    globalThis.YoniUtils = Utils;
}
