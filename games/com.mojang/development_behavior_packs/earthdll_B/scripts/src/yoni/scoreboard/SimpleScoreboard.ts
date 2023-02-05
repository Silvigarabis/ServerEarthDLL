// @ts-nocheck
import { StatusCode, VanillaScoreboard, Minecraft } from "../basis.js";
import { Command } from "../command.js";

import Objective from "./Objective.js";
import Entry from "./Entry.js";
 
/**
 * @typedef {import("../entity.js").YoniEntity} YoniEntity
 */

/**
 * 可用的显示位。
 * @enum
 */
export const DisplaySlot = {
    /**
     * 在暂停菜单中显示。
     */
    list: "list",
    /**
     * 在屏幕右侧显示。
     */
    sidebar: "sidebar",
    /**
     * 在玩家名字下方显示。
     */
    belowname: "belowname",
}

/**
 * 记分项中每条项目的排序方式。
 * @enum
 */
export const ObjectiveSortOrder = {
    /**
     * 以正序排列项目（A-Z）。
     */
    "ascending": "ascending",
    /**
     * 以倒序排列项目（Z-A）。
     */
    "descending": "descending",
}

/**
 * 描述了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptions
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective} objective - 显示的记分项。
 */


/**
 * 定义了显示位上显示的记分项，以及显示方式。
 * @interface
 * @typedef DisplayOptionsDefines
 * @property {ObjectiveSortOrder} [sortOrder] - 记分项的项目显示在此位置上时，项目排序的方式。
 * @property {Objective|Minecraft.ScoreboardObjective|string} objective - 显示的记分项。
 */

/**
 * 记分板包括了记分项，分数持有者以及他们的分数。
 */
export default class SimpleScoreboard {
    /**
     * @type {Map<string, Objective>}
     */
    static #objectives = new Map();
    
    /**
     * 在记分板上添加新的记分项。
     * @param {string} name - 新的记分项的名称（标识符）。
     * @param {string} criteria - 记分项的准则，永远都应该是 `"dummy"`。
     * @param {string} [displayName] - 为新添加的记分项指定显示名称，
     * 若不指定则将 `name` 作为显示名称。
     * @returns {Objective} 添加的记分项的对象。
     * @throws 若准则不为 `"dummy"` ，抛出错误。
     * @throws 若 `name` 指定的记分项已经存在，抛出错误。
     */
    static addObjective(name, criteria="dummy", displayName = name){
        if (!name || typeof name !== "string")
            throw new TypeError("Objective name not valid!");
        if (SimpleScoreboard.getObjective(name) !== null)
            throw new Error("Objective "+name+" existed!");
        if (criteria !== "dummy")
            throw new Error("Unsupported criteria: " + criteria);
        if (!name || typeof name !== "string")
            throw new TypeError("Objective display name not valid!");
        
        let vanillaObjective = VanillaScoreboard.addObjective(name, displayName);
        
        let newObjective = new Objective({
            scoreboard: SimpleScoreboard,
            name, criteria, displayName,
            vanillaObjective
        });
        SimpleScoreboard.#objectives.set(name, newObjective);
        
        return newObjective;
    }
    
    /**
     * 移除记分板上的记分项。
     * @param {string|Objective|Minecraft.ScoreboardObjective} nameOrObjective - 要移除的记分项，
     * 字符串将作为记分项的标识符。
     * @returns {boolean} 是否成功移除了记分项。
     */
    static removeObjective(nameOrObjective){
        let objectiveId;
        if (nameOrObjective instanceof Objective || nameOrObjective instanceof Minecraft.ScoreboardObjective){
            objectiveId = nameOrObjective.id;
        } else {
            objectiveId = nameOrObjective;
        }
        if (objectiveId && typeof objectiveId === "string"){
            if (SimpleScoreboard.#objectives.has(objectiveId)){
                SimpleScoreboard.#objectives.delete(objectiveId);
            }
            try {
                return VanillaScoreboard.removeObjective(objectiveId);
            } catch {
                return false;
            }
        } else {
            throw new TypeError("unknown error while removing objective");
        }
    }
    
    /**
     * 获取名称为 `name` 的记分项对象。
     * @param {string|Minecraft.ScoreboardObjective} name - 可以代表记分项的值。
     * @param {boolean} autoCreateDummy - 如果为 `true` ，在未找到对应记分项时，创建新的记分项并返回。
     * @returns 若不存在由 `name` 指定的记分项，且未设置 `autoCreateDummy` 为 `true`，返回 `null`。
     */
    static getObjective(name, autoCreateDummy=false){
        let result = null;
        if (name instanceof Minecraft.ScoreboardObjective){
            name = name.id;
        }
        let record = SimpleScoreboard.#objectives.get(name);
        let vanillaObjective = VanillaScoreboard.getObjective(name);
        if (vanillaObjective == null && autoCreateDummy){
            vanillaObjective = VanillaScoreboard.addObjective(name, name);
        }
        //这种条件下，不会将记录的结果作为返回值
        if (record == null || record.isUnregistered()){
            //这种情况下，会创建对应的记分项对象，不可以合并判断条件
            if (vanillaObjective != null){
                result = new Objective(SimpleScoreboard, name, "dummy", vanillaObjective.displayName, vanillaObjective);
                SimpleScoreboard.#objectives.set(name, result);
            }
        } else {
            result = record;
        }
        return result;
    }
    
    /** 
     * 获取记分板上的所有记分项。
     * @returns {Objective[]} 包含了所有记分项对象的数组。
     */
    static getObjectives(){
        return Array.from(VanillaScoreboard.getObjectives())
            .map(obj=>SimpleScoreboard.getObjective(obj.id));
    }
    
    /**
     * 获得显示位上正在显示的内容的信息。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {DisplayOptions} - 显示位上显示的内容。
     */
    static getDisplayAtSlot(slot){
        let rt = VanillaScoreboard.getObjectiveAtDisplaySlot(slot);
        let result = {
            objective: rt.objective ?
                SimpleScoreboard.getObjective(rt.objective.id) :
                null
        };
        if ("sortOrder" in rt){
            result.sortOrder = rt.sortOrder;
        }
        return result;
    }
    
    static #getIdOfObjective(any){
         if (any instanceof Objective || any instanceof Minecraft.ScoreboardObjective){
             return any.id;
         } else if (any && typeof any === "string"){
             return any;
         } else {
             throw new TypeError("unknown objective");
         }
    }
    
    /**
     * 设置显示位上显示的记分项，并允许额外的设置。
     * @param {DisplaySlot} slot - 显示位。
     * @param {DisplayOptionDefines} settings - 显示位的设置。
     * @returns {Objective} 显示位先前显示的记分项的对象，若先前未显示任何记分项，返回 `undefined` 。
     */
    static setDisplayAtSlot(slot, settings){
        let objective = SimpleScoreboard.getObjective(SimpleScoreboard.#getIdOfObjective(settings?.objective));
        
        if (objective == null){
            throw new Error("Unknown objective in settings");
        }
        
        let settingArg;
        try { //兼容旧版
            if ("sortOrder" in settings){
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(
                    objective.vanillaObjective,
                    settings.sortOrder
                );
            } else {
                settingArg = new Minecraft.ScoreboardObjectiveDisplayOptions(
                    objective.vanillaObjective
                );
            }
        } catch { //新版本修改为接口
            settingArg = {
                objective: objective.vanillaObjective
            };
            if ("sortOrder" in settings){
                settingArg.sortOrder = settings.sortOrder
            }
        }
        let lastDisplayingObjective = VanillaScoreboard.setObjectiveAtDisplaySlot(
            slot,
            settingArg
        );
        if (lastDisplayingObjective == undefined)
            return undefined;
        return SimpleScoreboard.getObjective(lastDisplayingObjective.id);
    }
    
    /**
     * 清空显示位上正显示的记分项。
     * @param {DisplaySlot} slot - 显示位。
     * @returns {Objective} 显示位先前显示的记分项，若无，返回 `null` 。
     */
    static clearDisplaySlot(slot){
        let rt = VanillaScoreboard.clearObjectiveAtDisplaySlot(slot);
        if (rt?.id !== undefined){
            return SimpleScoreboard.getObjective(rt.id);
        } else {
            return null;
        }
    }
    
    /**
     * 获取记分板上记录的所有分数持有者。
     * @yields {Entry}
     */
    static * getEntries(){
        for (let scbid of VanillaScoreboard.getParticipants())
            yield Entry.getEntry({ scbid, type: scbid.type });
    }
    
    /**
     * 移除记分板的所有记分项。
     */
    static removeAllObjectives(){
        Array.from(VanillaScoreboard.getObjectives())
            .forEach(obj=>{
                SimpleScoreboard.removeObjective(obj);
            });
    }
    
    /**
     * 以异步方式重置分数持有者的分数。
     * @param {(entry:Entry) => boolean} [filter] - 可选的过滤器函数，
     * 将所有分数持有者的 `Entry` 对象依次传入，若得到 `true` ，则重置
     * 此分数持有者的分数，否则将不会重置。
     * @returns {Promise<number>} 重置了多少分数持有者的分数。
     */
    static async postResetAllScores(filter = null){
        if (arguments.length === 0){
            let rt = await Command.add(Command.PRIORITY_HIGHEST, "scoreboard players reset *");
            if (rt.statusCode !== StatusCode.success){
                throw new Error(rt.statusMessage);
            } else {
                return rt.successCount;
            }
        }
        let resolve;
        let promise = new Promise((re)=>{
            resolve = re;
        });
        let entries = Array.from(SimpleScoreboard.getEntries());
        let successCount = 0;
        let doneCount = 0;
        let successCountAdder = ()=>{
            successCount++;
        };
        let resolveIfDone = ()=>{
            if (++doneCount === entries.length){
                resolve(successCount);
            }
        };
        entries.filter(filter).forEach((id)=>{
            SimpleScoreboard.postResetScore(id)
                .then(successCountAdder)
                .finally(resolveIfDone);
        });
        return promise;
    }
    
    /**
     * 重置记分板上指定分数持有者的所有分数记录。
     * @param {Entry|Minecraft.ScoreboardIdentity|Minecraft.Entity|Minecraft.Player|string|number|YoniEntity} entry - 可能对应分数持有者的值。
     * @throws 当分数持有者为虚拟玩家，并且世界上存在与其名字相同的玩家时，抛出 `NameConflictError`。
     * @throws 未能在世界上找到分数持有者的实体对象时，抛出错误。
     */
    static async postResetScore(entry){
        if (!(entry instanceof Entry))
            entry = Entry.guessEntry(entry);
        
        if (entry.type === EntryType.PLAYER || entry.type === EntryType.ENTITY){
            let ent = entry.getEntity();
            if (ent == null){
                throw new Error("Could not find the entity");
            }
            let rt = await Command.addExecuteParams(Command.PRIORITY_HIGHEST, ent, "scoreboard", "players", "reset", "@s");
            if (rt.statusCode != StatusCode.success){
                throw new Error("Could not set score, maybe entity or player disappeared?");
            }
        } else if ([...VanillaWorld.getPlayers({name: entry.displayName})].length === 0){
            let rt = await Command.add(Command.PRIORITY_HIGHEST,
                Command.getCommandMoreStrict("scoreboard", "players", "reset", entry.displayName));
            if (rt.statusCode !== StatusCode.success){
                throw new Error(rt.statusMessage);
            }
        } else {
            throw new NameConflictError(entry.displayName);
        }
    }
}

export { SimpleScoreboard }