import {
    Vector3,
    MinecraftBlockTypes,
    MinecraftItemTypes,
    ItemStack,
    Location,
    BlockLocation,
    world,
    Player,
    system,
    Scoreboard,
    EnchantmentList,
} from "@minecraft/server";
import {
    ActionFormData,
    MessageFormData,
    ModalFormData,
    ActionFormResponse,
} from "@minecraft/server-ui";
import lmd5 from "./md5.js";
//import { http } from "@minecraft/server-net";

import { banned_item } from "./config/banned_item_list_.js";
import { emojis } from "./config/custom_emoji_list.js";
import { dangerous_block_broken_list,
    dangerous_block_place_list,
    banned_block_place_list,
    banned_block_broken_list,
} from "./config/special_block_list.js";
import { ore_list } from "./config/ore_list.js";
import { log, add_history } from "./logging.js";
import {
    Scoreboard,
    Location,
    dim,
    VanillaWorld,
    Logger,
    EventListener,
    EntityBase
} from "./yoni/index.js";
import * as PermissionUtils from "./PermissionUtils.js";

const logger = new Logger("EarthDLL");

//md5加盐，用之前最好改一下，正式投入使用后不建议改
//加盐会导致hash值发生变化，这可以增加攻击难度
let md5_salts = "EarthDLL";

function sum_md5_by_hex(input) {
    return lmd5.hex_md5(input + md5_salts);
}

var time_board = false;
var infoEntity;
var entities_count = 0;
var tps_ms = 0;
var trades = [];
var beload = false;
var command_list = [
    "reset",
    "cd",
    "菜单",
    "talk",
    "私聊",
    "tp",
    "传送",
    "死",
    "die",
];
var ui_path = "textures/ui/";
var tooltips =
    "欢迎来到§e无名氏生存服务器§r"
    +"\n聊天框输入 §ecd§r 或 §e菜单§r 进入主菜单"
    +"\n§e使用矿物双击方块§r打开菜单"
    +"\n严查§4矿物透视§r，保证玩家公平";

function changeTotalBar(player, texts) {
    var text = texts;
    if (text !== "") {
        text += "\n";
    }
    var ui = new ModalFormData()
        .title("公告修改")
        .textField(texts, "新一行内容", "")
        .toggle("结束", false);
    ui.show(player).then((result) => {
        text += result.formValues[0];
        if (result.formValues[1] === false) {
            changeTotalBar(player, text);
        } else {
            tooltips = text;
        }
    });
}

var ideas = [];
var boards = [];
var logs = [];
var history = [];
var tps = 0;
var pistons = 0;
var pistons_now = 0;
var spawn = 0;
var spawn_now = 0;
var ban_list = [];
var works = [];
var entities_test = [
    "minecraft:wolf",
    "minecraft:parrot",
    "minecraft:donkey",
    "minecraft:horse",
    "minecraft:mule",
    "minecraft:cat",
];

//定义各维度的名字
world.getDimension("minecraft:overworld").name = "§b主世界§r";
world.getDimension("minecraft:the_end").name = "§5末地§r";
world.getDimension("minecraft:nether").name = "§4下界§r";

//创建存储用记分项
Scoreboard.getObjective("play_time")
    ?? Scoreboard.addObjective("play_time", "dummy", "游玩时间");

Scoreboard.getObjective("score")
    ?? Scoreboard.addObjective("score", "dummy", "贡献值");
    
Scoreboard.getObjective("coin")
    ?? Scoreboard.addObjective("coin", "dummy", "金币");

Scoreboard.getObjective("show1")
    ?? Scoreboard.addObjective("show1", "dummy", "游玩时间");

Scoreboard.getObjective("show2")
    ?? Scoreboard.addObjective("show2", "dummy", "游玩时间");

const spawn_point = new Location({ x: -2, y: 70, z: 50 });

const overworld = world.getDimension("minecraft:overworld");

var safe_place = [spawn_point];

//初始化获取队伍信息
/*初始化信息方法
        /summon npc 0 -63 0
        /tag @e[type=npc] add serverInfomation

*/


function script_check_run(command) {
    for (const player of World.getPlayers()) {
        if (player.hasTag("op-work")
        && player.hasTag("script-check")
        ){
            player.fetchCommand(command);
        }
    }
}

function get_pos_str(entity) {
    let location = new Location(entity);
    let { x, y, z } = location.toBlockLocation();
    return `(${x}，${y}，${z})`;
}
//你也许很好奇为什么这两个函数长得那么像
//因为我在Location处理了实体与方块的坐标获取
//你只需要调用就行了，不用管传的是方块还是实体
function get_block_pos_str(block) {
    let location = new Location(block);
    let { x, y, z } = location.toBlockLocation();
    return `(${x}，${y}，${z})`;
}

function save_trades(text) {
    trades.push(text);
    infoEntity.addTag(text);
}

function delete_trades(text) {
    if (trades.indexOf(text) > -1) {
        trades.splice(trades.indexOf(text), 1);
    }
    infoEntity.removeTag(text);
}
world.events.beforeDataDrivenEntityTriggerEvent.subscribe((event) => {
    return 0;
    if (event.entity.typeId === "minecraft:player") {
        switch (event.id) {
            case "server:open_chest":
                event.entity.chesting = true;
                break;
            case "server:open_chest":
                event.entity.chesting = false;
                break;
        }
    } else {
    }
});


function reload_all() {
    var run_time = Date.now();
    world
        .getDimension("minecraft:overworld")
        .runCommandAsync("fill 1 -64 1 -1 -60 -1 bedrock");
    world.say("§e正在加载服务器信息");
    const option = {
        location: new Location(0, -63, 0),
        closest: 1,
        tags: ["serverInfomation"],
    };
    var entity = Array.from(
        world.getDimension("minecraft:overworld").getEntities(option)
    );
    if (entity.length === 1) {
        if (entity[0].typeId === "minecraft:npc") {
            entity = entity[0];
            infoEntity = entity;
            var tags = entity.getTags();
            for (var cf = 0; cf < tags.length; cf++) {
                if (tags[cf].indexOf("team，") === 0) {
                    load_team(tags[cf]);
                }
                if (tags[cf].indexOf("team_id，") === 0) {
                    team_id = parseInt(tags[cf].split("，")[1]);
                }
                if (tags[cf].indexOf("trade，") === 0) {
                    trades.push(tags[cf]);
                }
            }
            world.say("§e服务器信息加载完成");
            beload = true;
        }
    } else {
        world.say("§e服务器信息加载失败,目标出错");
    }
    script_check_run(
        `tellraw @s {"rawtext":[{"text":"` +
            "加载用时" +
            String(Date.now() - run_time) +
            `"}]}`
    );
}

/*setting使用帮助
第一位：聊天设置

*/

function get_shares() {
    var players = world.getAllPlayers();
    var texts = [];
    for (var cf = 0; cf < players.length; cf++) {
        if (get_tag(players[cf], "sharePos,") !== "") {
            //world.say("hi")
            texts.push(players[cf].name + "," + get_tag(players[cf], "sharePos,"));
        }
    }
    //world.say(String(texts))
    return texts;
}

function block_test(block, is_name = false, type = 0) {
    var name = "";
    if (is_name === true) {
        name = block;
    } else {
        name = block.typeId;
    }
    if (type === 0) {
        if (dangerous_block_broken_list.indexOf(name) !== -1) {
            return "danger";
        }
        if (banned_block_broken_list.indexOf(name) !== -1) {
            return "kick";
        }
    } else {
        if (dangerous_block_place_list.indexOf(name) !== -1) {
            return "danger";
        }
        if (banned_block_place_list.indexOf(name) !== -1) {
            return "kick";
        }
    }
    return "none";
}

function entity_test(entity) {
    if (entities_test.indexOf(entity.typeId) !== -1) {
        return true;
    } else {
        return false;
    }
}


function clear_tag(player) {
    var tags = player.getTags();
    for (var cf = 0; cf < tags.length; cf++) {
        player.removeTag(tags[cf]);
    }
}

function get_tag(player, tag) {
    var tags = player.getTags();
    var goal = "";
    for (var cf = 0; cf < tags.length; cf++) {
        if (tags[cf].indexOf(tag) !== -1) {
            goal = tags[cf];
        }
    }
    return goal;
}

function add_score(player, count, push = false) {
    if (push === true) {
        player.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"§e获得` + String(count) + `贡献值"}]}`
        );
    }
    player.runCommandAsync("scoreboard players add @s score " + String(count));
}

function get_score(player) {
    var score = 0;
    try {
        score = world.scoreboard.getObjective("score").getScore(player.scoreboard);
    } catch (any) {
    } finally {
    }
    return score;
}

function set_score(player, count, push = false) {
    if (push === true) {
        player.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"§e贡献值被设置为` +
                String(count) +
                `"}]}`
        );
    }
    player.runCommandAsync("scoreboard players set @s score " + String(count));
}

world.events.itemStartCharge.subscribe((event) => {
    //world.say("1")
});
world.events.entityCreate.subscribe((event) => {
    spawn_now++;
});

world.events.entityHit.subscribe((event) => {
    if (event.entity.typeId === "minecraft:player") {
        var item = event.entity
            .getComponent("minecraft:inventory")
            .container.getItem(event.entity.selectedSlot);
        if (typeof item === "object") {
            if (item.typeId === "minecraft:paper") {
                var lores = item.getLore();
                if (lores.indexOf("passpaper") !== -1) {
                    add_score(event.entity, item.amount * 70, true);
                    event.entity
                        .getComponent("minecraft:inventory")
                        .container.setItem(
                            event.entity.selectedSlot,
                            new ItemStack(MinecraftItemTypes.apple, 0, 0)
                        );
                }
            }
            if (ore_list.indexOf(item.typeId) !== -1) {
                cdBar(event.entity);
            }
        }
    }
});

world.events.beforeChat.subscribe((event) => {
    event.cancel = true;
    if (command_list.indexOf(event.message) !== -1) {
        switch (event.message) {
            case "reset":
                if (PermissionUtils.is_admin(event.sender) === true) {
                    var npc = world
                        .getDimension("minecraft:overworld")
                        .spawnEntity("minecraft:npc", new Location(0, -63, 0));
                    npc.addTag("serverInfomation");
                }
                break;
            case "cd":
            case "菜单":
                event.sender.runCommandAsync("damage @s 0 entity_attack");
                cdBar(event.sender);
                break;
            case "talk":
            case "私聊":
                event.sender.runCommandAsync("damage @s 0 entity_attack");
                WaittalkBar(event.sender);
                break;
            case "tp":
            case "传送":
                event.sender.runCommandAsync("damage @s 0 entity_attack");
                WaitposBar(event.sender);
                break;
            case "die":
            case "死":
                event.sender.kill();
                break;
        }
    } else {
        var message = event.message;
        message = message.replace(/§./g, "");
        for (var cf = 0; cf < emojis.length; cf++) {
            message = message.replaceAll(emojis[cf][1], emojis[cf][0]);
            message = message.replaceAll(emojis[cf][2], emojis[cf][0]);
        }
        var mode = get_tag(event.sender, "talk_mode,").slice(10);
        if (mode !== "0" && mode !== "") {
            var index = "";
            if (mode === "1") {
                index = get_team_by_player(event.sender, 0);
            } else {
                index = get_team_by_player(event.sender, 1);
            }
            if (index !== "") {
                var say = "[§e队伍§r]§b" + event.sender.name + "§r >> " + message;
                var players = world.getAllPlayers();
                for (var cf = 0; cf < players.length; cf++) {
                    if (teams[index].member.indexOf(players[cf].name) !== -1) {
                        players[cf].runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"` + say + `"}]}`
                        );
                    }
                }
            } else {
                var say = "[§e无队伍§r]§b" + event.sender.name + "§r >> " + message;
                world.say(say);
                add_history(say);
            }
        } else {
            add_score(event.sender, 2);
            var say =
                "[" +
                event.sender.dimension.name +
                "]§b" +
                event.sender.name +
                "§r >> " +
                message;
            world.say(say);
            add_history(say);
        }
    }
});

world.events.projectileHit.subscribe((event) => {
    if (event.source instanceof Player && typeof event.entityHit == "object") {
        if (event.projectile.typeId != "minecraft:fishing_hook") {
            event.source.runCommandAsync("playsound random.orb @s");
        }
    }
});

function sureBar(player) {
    var id = system.runSchedule(function () {
        var ui = new MessageFormData()
            .title("请注意")
            .body("此区域禁止破坏方块")
            .button1("OK");
        system.clearRunSchedule(id);
        var promise = ui.show(player);
    }, 10);
}

function banBar(player) {
    var id = system.runSchedule(function () {
        var ui = new MessageFormData()
            .title("系统警告")
            .body("涉嫌恶意行为，你已被封禁")
            .button1("好的")
            .button2("退出游戏");
        system.clearRunSchedule(id);
        ui.show(player).then((result) => {
            if (result.selection == 0) {
                player.kill();
            }
        });
    }, 5);
}

function warnBar(player) {
    var id = system.runSchedule(function () {
        var ui = new MessageFormData()
            .title("系统警告")
            .body("系统监测到你的恶意行为，给予一次警告！")
            .button1("好的")
            .button2("退出游戏");
        system.clearRunSchedule(id);
        ui.show(player).then((result) => {
            log("玩家" + player.name + "被警告一次", false);
            if (result.selection == 0) {
                player.runCommandAsync("gamemode 0 @s");
                player.kill();
            }
        });
    }, 5);
}

function cdBar(player) {
    var id = system.runSchedule(function () {
        system.clearRunSchedule(id);
        var text =
            "\n敬爱的玩家：" +
            player.name +
            "\n你的贡献：" +
            String(get_score(player)) +
            "\n你的游玩时间：" +
            String(
                world.scoreboard.getObjective("play_time").getScore(player.scoreboard)
            );
        var ui = new ActionFormData()
            .title("主菜单")
            .body("(打开主菜单会受到一个假伤害，请忽略)\n欢迎来到服务器" + text)
            .button("坐标点 / 传送", ui_path + "paste.png")
            .button("玩家互动", ui_path + "FriendsIcon.png")
            .button("我的", ui_path + "permissions_member_star.png")
            .button("服务器信息", ui_path + "servers.png")
            .button("公告", ui_path + "icon_sign.png")
            .button("自杀", ui_path + "strength_effect.png");
        if (player.hasTag("op," + player.name) === true) {
            ui = ui.button("管理界面", ui_path + "op.png");
        }

        ui.show(player).then((result) => {
            switch (result.selection) {
                case 0:
                    posBar(player);
                    break;
                case 1:
                    playerBar(player);
                    break;
                case 2:
                    meBar(player);
                    break;
                case 3:
                    serverBar(player);
                    break;
                case 4:
                    show_board(player);
                    break;
                case 5:
                    player.kill();
                    break;
                case 6:
                    opBar(player);
                    break;
            }
        });
    }, 15);
}

function talkBar(player) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name);
    }
    var ui = new ModalFormData()
        .title("私聊")
        .dropdown("选择玩家", names, 0)
        .textField("私聊消息", "此处输入消息(话费：5贡献)", "")
        .toggle("要求对方立刻回复", false);

    ui.show(player).then((result) => {
        add_score(player, -5);
        var say = result.formValues[1];
        for (var cf = 0; cf < emojis.length; cf++) {
            say = say.replaceAll(emojis[cf][1], emojis[cf][0]);
            say = say.replaceAll(emojis[cf][2], emojis[cf][0]);
        }
        var text = "[§e私聊§r]§b" + player.name + "§r > §b你§r >>" + String(say);
        players[result.formValues[0]].runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"` + text + `"}]}`
        );
        if (result.formValues[2] === true) {
            text = "[§e私聊§r]§b" + player.name + "§r >> " + String(say);
            replyBar(players[result.formValues[0]], player, text);
        }
        text =
            "[§e私聊§r]§b你§r > §b" +
            players[result.formValues[0]].name +
            "§r >>" +
            String(say);
        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text + `"}]}`);
    });
}

function getKeyBar(player) {
    var ui = new ModalFormData()
        .title("获取钥匙")
        .textField("Key名", "key的显示名称", "密码纸")
        .textField("密码", "此处输入密码(手续费：75贡献*数量)(不能含:)", "")
        .textField("箱子主人", "主人名字", player.name)
        .dropdown("公开", ["不公开", "公开到我创建的队伍", "公开到我加入的队伍"], 0)
        .slider("获取Key数量", 1, 64, 1);

    ui.show(player).then((result) => {
        add_score(player, -75 * result.formValues[4], true);
        var item = new ItemStack(MinecraftItemTypes.paper, result.formValues[4], 0);
        item.nameTag = result.formValues[0];
        var lores = [
            "passpaper",
            "password:" + sum_md5_by_hex(result.formValues[1]),
            "owner:" + result.formValues[2],
        ];
        if (result.formValues[3] === 1) {
            var index = get_team_by_player(player, 0);
            if (index !== "") {
                lores.push("team:" + teams[index].id);
            }
        }
        if (result.formValues[3] === 2) {
            var index = get_team_by_player(player, 1);
            if (index !== "") {
                lores.push("team:" + teams[index].id);
            }
        }

        item.setLore(lores);
        //world.say(String(item.getLore()))
        player.dimension.spawnItem(
            item,
            new BlockLocation(
                Math.round(player.location.x),
                Math.round(player.location.y),
                Math.round(player.location.z)
            )
        );
        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"已生成Key"}]}`);
    });
}


function replyBar(player, self, last_text) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name);
    }
    var ui = new ModalFormData()
        .title("私聊回复")
        .textField(last_text + "\n\n回复消息", "此处输入消息(话费：5贡献)", "")
        .toggle("要求对方立刻回复", true);

    ui.show(player).then((result) => {
        add_score(self, -5);
        var text =
            "[§e私聊§r]§b" +
            self.name +
            "§r > §b你§r >>" +
            String(result.formValues[0]);
        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text + `"}]}`);
        if (result.formValues[1] === true) {
            text =
                "[§e私聊§r]§b" + self.name + "§r >> " + String(result.formValues[0]);
            replyBar(self, player, last_text + "\n" + text);
        }
        text =
            "[§e私聊§r]§b你§r > §b" +
            player.name +
            "§r >>" +
            String(result.formValues[0]);
        self.runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text + `"}]}`);
    });
}

function WaittalkBar(player) {
    var id = system.runSchedule(function () {
        talkBar(player);
        system.clearRunSchedule(id);
    }, 15);
}

function WaitposBar(player) {
    var id = system.runSchedule(function () {
        posBar(player);
        system.clearRunSchedule(id);
    }, 15);
}

function serverBar(player) {
    var serverInfo =
        "服务器运行时间：" +
        String(system.currentTick / 20) +
        "s\n服主：EarthDLL\n服主QQ：2562577144\n服务器到期时间：2023.3.12";
    var selfInfo =
        "\n玩家名字：" + player.name + "\n是否拥有管理：" + String(player.isOp());
    if (PermissionUtils.is_admin(player) === true) {
        selfInfo += "\nTags：" + String(player.getTags());
    }
    var ui = new ActionFormData()
        .title("服务器信息")
        .body(serverInfo + selfInfo)
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png")
        .button("意见反馈", ui_path + "book_edit_default.png")
        .button("帮助", ui_path + "how_to_play_button_default.png")
        .button("查看日志记录", ui_path + "feedIcon.png");
    ui.show(player).then((result) => {
        if (result.selection === 1) {
            ideaBar(player);
        }
        if (result.selection === 3) {
            historyCheckBar(player, false);
        }
        if (result.selection === 0) {
            cdBar(player);
        }
        if (result.selection === 2) {
            helpBar(player);
        }
    });
}

function helpBar(player) {
    var text =
        "问：如何获取贡献？答：挖掘方块，死亡，聊天等参与服务器的行为都可以获取贡献,注：队伍聊天要消耗贡献,,问：贡献不足会有什么影响？,答：菜单功能会受到限制，但不影响正常游戏";
    var ui = new ActionFormData()
        .title("帮助界面")
        .body(text.replaceAll(",", "\n"))
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        }
    });
}

function emojiBar(player) {
    var text =
        "/笑脸  /xl,,/苦脸  /kl,,/死  /si,,/白眼  /by,,/开心  /kx,,/流口水  /lks,,/无语  /wy,,/搞怪  /gg,,/猥琐  /ws,,/哭  /ku,,/冷/leng,,/生气  /sq,,/帅  /shuai,,/害羞  /hx,,/魔鬼  /mg,,/所以呢  /syn,,/笑哭  /xk,,/口罩  /kz,,/亲  /qin,,聊天框输入";
    var ui = new ActionFormData()
        .title("emojis")
        .body(text.replaceAll(",", "\n"))
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        }
    });
}

function posBar(player) {
    var ui = new ActionFormData()
        .title("坐标点界面")
        .body(
            "选择返回坐标\n你的贡献值：" +
                String(get_score(player)) +
                "\n返回死亡地点花费200贡献\n传送地点花费100贡献"
        )
        .button("设置坐标点", ui_path + "settings_glyph_color_2x.png")
        .button("传送到玩家", ui_path + "icon_multiplayer.png")
        .button("上一次死亡地点", ui_path + "wither_effect.png");
    for (var cf = 0; cf < 10; cf++) {
        var text = get_tag(player, "pos" + String(cf) + ",");
        if (text === "") {
            ui = ui.button("坐标点" + String(cf + 1) + "(未设置)");
        } else {
            var name = "";
            if (typeof text.split(",")[5] === "string") {
                name = world.getDimension(text.split(",")[5]).name;
            } else {
                name = "未知";
            }
            ui = ui.button("[" + name + "]" + text.split(",")[1]);
        }
    }
    if (get_tag(player, "sharePos,") === "") {
        ui = ui.button("共享点", ui_path + "share_google.png");
    } else {
        var tag = get_tag(player, "sharePos,").split(",");
        ui = ui.button(
            "共享点 - [" + world.getDimension(tag[5]).name + "]" + tag[1],
            ui_path + "share_google.png"
        );
    }
    ui = ui
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png")
        .button("世界共享点", ui_path + "mashup_world.png")
        .button("队伍共享点", ui_path + "dressing_room_skins.png")
        .button("出生点", ui_path + "heart_new.png")
        .button("随机传送");
    ui.show(player).then((result) => {
        if (result.selection >= 3 && result.selection <= 12) {
            var goal_text = get_tag(
                player,
                "pos" + String(result.selection - 3) + ","
            );
            if (goal_text !== "") {
                add_score(player, -100, true);
                goal_text = goal_text.split(",");
                player.runCommandAsync(
                    "tp @s " + goal_text[2] + " " + goal_text[3] + " " + goal_text[4]
                );
            } else {
                posBar(player);
            }
        }
        if (result.selection === 1) {
            tpPlayerBar(player);
        }
        if (result.selection === 0) {
            setPosBar(player);
        }

        if (result.selection === 2) {
            if (typeof player.diePos == "object") {
                add_score(player, -200, true);
                player.teleport(
                    { x: player.diePos[1], y: player.diePos[2], z: player.diePos[3] },
                    world.getDimension(player.diePos[0]),
                    player.rotation.x,
                    player.rotation.y
                );
            }
        }
        if (result.selection === 13) {
            var thing = get_tag(player, "sharePos,");
            if (thing === "") {
                posBar(player);
            } else {
                thing = thing.split(",");
                player.runCommandAsync(
                    "tp @s " + thing[2] + " " + thing[3] + " " + thing[4]
                );
            }
        }
        if (result.selection === 14) {
            cdBar(player);
        }
        if (result.selection == 15) {
            worldPosBar(player);
        }
        if (result.selection == 16) {
            teamPosBar(player);
        }
        if (result.selection == 17) {
            player.teleport(
                spawn_point,
                overworld,
                player.rotation.x,
                player.rotation.y
            );
        }
        if (result.selection == 18) {
            add_score(player, 20, true);
            player.runCommandAsync(
                `tellraw @s {"rawtext":[{"text":"§e正在执行传送"}]}`
            );
            player.runCommandAsync("spreadplayers ~ ~ 10000 50000 @s");
        }
    });
}


function worldPosBar(player) {
    var ui = new ActionFormData()
        .title("世界共享点")
        .body("当前世界共享点(需要玩家在线)")
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    var shares = get_shares();
    for (var cf = 0; cf < shares.length; cf++) {
        var things = shares[cf].split(",");
        ui = ui.button(
            things[0] + " - [" + world.getDimension(things[6]).name + "]" + things[2]
        );
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        } else {
            var thing = shares[result.selection - 1].split(",");
            player.runCommandAsync(
                "tp @s " + thing[3] + " " + thing[4] + " " + thing[5]
            );
        }
    });
}

function opBar(player) {
    var ui = new ActionFormData()
        .title("管理员界面")
        .body("选择设置")
        .button("查看意见反馈", ui_path + "comment.png")
        .button("查看警告日志", ui_path + "WarningGlyph.png")
        .button("贡献值设置", ui_path + "settings_glyph_color_2x.png")
        .button("修改公告", ui_path + "book_edit_default.png")
        .button("删除约定", ui_path + "redX1.png")
        .button("查看玩家日志", ui_path + "feedIcon.png")
        .button("封禁玩家", "textures/blocks/barrier.png")
        .button("查看所有队伍", ui_path + "dressing_room_skins.png")
        .button("工作模式", ui_path + "anvil_icon.png")
        .button("玩家物品栏", ui_path + "selected_hotbar_slot.png")
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    if (PermissionUtils.is_admin(player) === true) {
        ui.show(player).then((result) => {
            if (result.selection === 0) {
                ideaCheckBar(player);
            }
            if (result.selection === 1) {
                logCheckBar(player);
            }
            if (result.selection === 4) {
                deleteTimeBar(player);
            }
            if (result.selection === 5) {
                historyCheckBar(player, true);
            }
            if (result.selection === 7) {
                teamCheckBar(player);
            }
            if (result.selection === 8) {
                opWorkBar(player);
            }
            if (result.selection === 10) {
                cdBar(player);
            }
            if (result.selection === 9) {
                inCheckBar(player);
            }
            if (result.selection === 6) {
                chooseBanBar(player);
            }
            if (result.selection === 3) {
                changeTotalBar(player, "");
            }
            if (result.selection === 2) {
                setScoreBar(player);
            }
        });
    }
}

function setScoreBar(player) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name + " 贡献值：" + String(get_score(players[cf])));
    }
    var ui = new ModalFormData()
        .title("贡献值设置界面")
        .dropdown("选择玩家", names, 0)
        .dropdown("操作", ["添加贡献值", "设置贡献值"], 0)
        .textField("值", "键入值", "");

    ui.show(player).then((result) => {
        switch (result.formValues[1]) {
            case 0:
                add_score(
                    players[result.formValues[0]],
                    parseInt(result.formValues[2]),
                    true
                );
                break;
            case 1:
                set_score(
                    players[result.formValues[0]],
                    parseInt(result.formValues[2]),
                    true
                );
                break;
        }
        cdBar(player);
    });
}

function ideaCheckBar(player) {
    var ui = new ActionFormData()
        .title("意见反馈收集界面")
        .body(String(ideas).replaceAll(",", "\n"))
        .button("清空")
        .button("返回上一级", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            ideas = [];
        }
        if (result.selection === 1) {
            opBar(player);
        }
    });
}

function historyCheckBar(player, can_clear = false, page = 0) {
    var ui = new ActionFormData()
        .title("玩家历史记录界面 - 第" + String(page + 1) + "页")
        .body(
            String(history.slice(page * 100, page * 100 + 99)).replaceAll(",", "\n")
        )

        .button("返回上一级", ui_path + "arrow_dark_left_stretch.png")
        .button("查找", ui_path + "magnifyingGlass.png")
        .button("上一页")
        .button("下一页");
    if (can_clear === true) {
        ui = ui.button("清空");
    }
    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        }
        if (result.selection === 1) {
            historyFindBar(player);
        }
        if (result.selection === 2 && page > 0) {
            historyCheckBar(player, can_clear, page - 1);
        }
        if (result.selection === 3) {
            historyCheckBar(player, can_clear, page + 1);
        }
        if (result.selection === 4) {
            history = [];
        }
    });
}


function meBar(player) {
    var text =
        "玩家名称：" + player.name + "\n我的贡献：" + String(get_score(player));
    var ui = new ActionFormData()
        .title("我的")
        .body(text)
        .button("我的队伍", ui_path + "dressing_room_customization.png")
        .button("我所在的队伍", ui_path + "dressing_room_skins.png")
        .button("获取箱子钥匙", ui_path + "accessibility_glyph_color.png")
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 3) {
            cdBar(player);
        }
        if (result.selection === 2) {
            getKeyBar(player);
        }
        if (result.selection === 0) {
            myTeamBar(player);
        }
        if (result.selection === 1) {
            myAddTeamBar(player);
        }
    });
}

function opWorkBar(player) {
    var ui = new ActionFormData()
        .title("管理员工作模式")
        .body("打开工作模式后，可无视任何限制(例如密码箱)。");
    if (player.hasTag("op-work") === false) {
        ui = ui.button("打开工作模式");
    } else {
        ui = ui.button("关闭工作模式");
    }
    ui = ui.button("返回上一级");
    if (player.hasTag("op-work") === true) {
        ui = ui
            .button("切换观察者模式")
            .button("切换生存模式")
            .button("传送到玩家")
            .button("获取工作效果(隐身+夜视)");
        if (player.hasTag("script-check") === true) {
            ui = ui.button("关闭脚本监视");
        } else {
            ui = ui.button("打开脚本监视");
        }
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            if (player.hasTag("op-work")) {
                player.removeTag("op-work");
                player.removeTag("script-check");
                player.runCommandAsync(`gamemode 0 @s`);
                player.runCommandAsync(`effect @s clear`);
            } else {
                player.addTag("op-work");
            }
            opWorkBar(player);
        }
        if (result.selection === 2) {
            opWorkBar(player);
            player.runCommandAsync(`gamemode spectator @s`);
        }
        if (result.selection === 1) {
            opBar(player);
        }
        if (result.selection === 3) {
            opWorkBar(player);
            player.runCommandAsync(`gamemode 0 @s`);
        }
        if (result.selection === 4) {
            opTpBar(player);
        }
        if (result.selection === 5) {
            opWorkBar(player);
            player.runCommandAsync(`effect @s invisibility 1000 1 true`);
            player.runCommandAsync(`effect @s night_vision 1000 1 true`);
        }
        if (result.selection === 6) {
            if (player.hasTag("script-check")) {
                player.removeTag("script-check");
            } else {
                player.addTag("script-check");
            }
            opWorkBar(player);
        }
    });
}

function setPosBar(player) {
    var ui = new ActionFormData()
        .title("坐标点设置")
        .body("选择操作\n删除坐标点手续费：20贡献")
        .button("设置坐标点信息", ui_path + "settings_glyph_color_2x.png")
        .button("删除坐标点", ui_path + "redX1.png")
        .button("返回上一级", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            choosePosBar(player, 0);
        }
        if (result.selection === 1) {
            choosePosBar(player, 1);
        }
        if (result.selection === 2) {
            posBar(player);
        }
    });
}

function choosePosBar(player, mode) {
    var ui = new ActionFormData().title("坐标点设置").body("选择要操作的坐标点");
    for (var cf = 0; cf < 10; cf++) {
        var text = get_tag(player, "pos" + String(cf) + ",");
        if (text === "") {
            ui = ui.button("坐标点" + String(cf + 1) + "(未设置)");
        } else {
            var name = "";
            if (typeof text.split(",")[5] === "string") {
                name = world.getDimension(text.split(",")[5]).name;
            } else {
                name = "未知";
            }
            ui = ui.button("[" + name + "]" + text.split(",")[1]);
        }
    }
    var share = get_tag(player, "sharePos,");
    if (share === "") {
        ui = ui.button("共享点(未设置)");
    } else {
        ui = ui.button("共享点 - " + share.split(",")[1]);
    }

    ui = ui.button("队伍共享点");
    ui = ui.button("取消", ui_path + "redX1.png");

    ui.show(player).then((result) => {
        if (result.selection > 9) {
            if (result.selection === 12) {
                posBar(player);
            }
            if (result.selection === 11) {
                chooseTeamPosBar(player);
            }
            if (result.selection === 10) {
                if (mode === 1) {
                    var goal_text = get_tag(player, "sharePos,");
                    if (goal_text !== "") {
                        player.removeTag(goal_text);
                        add_score(player, -20, true);
                    }
                    posBar(player);
                } else {
                    changePosBar(player, result.selection);
                }
            }
        } else {
            if (mode === 1) {
                var goal_text = get_tag(player, "pos" + String(result.selection) + ",");
                if (goal_text !== "") {
                    player.removeTag(goal_text);
                    add_score(player, -20, true);
                }
                posBar(player);
            } else {
                changePosBar(player, result.selection);
            }
        }
    });
}
function changePosBar(player, index) {
    var name = get_tag(player, "pos" + String(index) + ",");
    if (name !== "") {
        name = name.split(",")[1];
    }

    var real_pos = [""];
    var poses = ["当前位置"];
    for (var cf = 0; cf < 10; cf++) {
        var text = get_tag(player, "pos" + String(cf) + ",");
        if (text !== "") {
            var d_name = "";
            if (typeof text.split(",")[5] === "string") {
                d_name = world.getDimension(text.split(",")[5]).name;
            } else {
                d_name = "未知";
            }
            poses.push("[" + d_name + "]" + text.split(",")[1]);
            real_pos.push(text);
        }
    }

    var ui = new ModalFormData()
        .title("设置坐标点")
        .textField(
            "坐标名称(设置手续费：20贡献)",
            "坐标点" + String(index + 1),
            name
        )
        .dropdown("选择坐标位置", poses, 0);

    ui.show(player).then((result) => {
        if (index !== 10) {
            var set = get_tag(player, "pos" + String(index) + ",");
            if (set !== "") {
                player.removeTag(set);
            }
            add_score(player, -20, true);
            if (result.formValues[1] === 0) {
                player.addTag(
                    "pos" +
                        String(index) +
                        "," +
                        result.formValues[0].replaceAll(",", "") +
                        "," +
                        String(player.location.x) +
                        "," +
                        String(player.location.y) +
                        "," +
                        String(player.location.z) +
                        "," +
                        player.dimension.id
                );
            } else {
                var thing = real_pos[result.formValues[1]].split(",");
                player.addTag(
                    "pos" +
                        String(index) +
                        "," +
                        result.formValues[0].replaceAll(",", "") +
                        "," +
                        thing[2] +
                        "," +
                        thing[3] +
                        "," +
                        thing[4] +
                        "," +
                        player.dimension.id
                );
            }
            posBar(player);
        } else {
            var set = get_tag(player, "sharePos," + String(index) + ",");
            if (set !== "") {
                player.removeTag(set);
            }
            add_score(player, -20, true);
            if (result.formValues[1] === 0) {
                player.addTag(
                    "sharePos," +
                        result.formValues[0].replaceAll(",", "") +
                        "," +
                        String(player.location.x) +
                        "," +
                        String(player.location.y) +
                        "," +
                        String(player.location.z) +
                        "," +
                        player.dimension.id
                );
            } else {
                var thing = real_pos[result.formValues[1]].split(",");
                player.addTag(
                    "sharePos," +
                        result.formValues[0].replaceAll(",", "") +
                        "," +
                        thing[2] +
                        "," +
                        thing[3] +
                        "," +
                        thing[4] +
                        "," +
                        player.dimension.id
                );
            }

            posBar(player);
        }
    });
}

function logCheckBar(player) {
    var ui = new ActionFormData()
        .title("日志界面")
        .body(String(logs).replaceAll(",", "\n"))
        .button("清空")
        .button("返回上一级", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            logs = [];
        }
        if (result.selection === 1) {
            opBar(player);
        }
    });
}

function historyResultBar(player, text) {
    var results = [];
    for (var cf = 0; cf < history.length; cf++) {
        if (history[cf].indexOf(text) !== -1) {
            results.push(history[cf]);
        }
    }
    var ui = new ActionFormData()
        .title("玩家日志结果")
        .body(String(results).replaceAll(",", "\n"))
        .button("返回上一级", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            logCheckBar(player);
        }
    });
}

function tradeBar(player) {
    var ui = new ActionFormData()
        .title("交易界面")
        .body("和玩家们一起交易吧~")
        .button("添加交易", ui_path + "book_addtextpage_default.png")
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");
    for (var cf = 0; cf < trades.length; cf++) {
        var things = trades[cf].split("，");
        var mode = "";
        switch (things[1]) {
            case "0":
                mode = "卖出";
                ui = ui.button(mode + " - " + things[3] + "*" + things[4]);
                break;
            case "1":
                mode = "交换";
                ui = ui.button(
                    mode +
                        " - " +
                        things[3] +
                        "*" +
                        things[5] +
                        "=" +
                        things[4] +
                        "*" +
                        things[6]
                );
                break;
            case "2":
                mode = "回收";
                ui = ui.button(mode + " - " + things[3] + "*" + things[4]);
                break;
        }
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            addTradeBar(player);
        }
        if (result.selection === 1) {
            cdBar(player);
        }
        if (result.selection > 1) {
            tradeInfoBar(player, trades[result.selection - 2]);
        }
    });
}

function addTradeBar(player) {
    var ui = new ActionFormData()
        .title("添加交易界面")
        .body("添加你的交易吧~")
        .button("取消", ui_path + "arrow_dark_left_stretch.png")
        .button("卖出")
        .button("交换")
        .button("回收");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            tradeBar(player);
        }
        if (result.selection > 0) {
            setTradeBar(player, result.selection - 1);
        }
    });
}

function tradeInfoBar(player, text) {
    var things = text.split("，");
    var show = "";
    switch (things[1]) {
        case "0":
            show = "卖出\n";
            show += "发起人：" + things[2] + "\n\n";
            show +=
                "卖出物品：" +
                things[3] +
                "\n卖出数量：" +
                things[4] +
                "\n价格/每个物品：" +
                things[5] +
                "\n交易地点：" +
                things[6];
            break;
        case "1":
            show = "交换\n";
            show += "发起人：" + things[2] + "\n\n";
            show +=
                "卖家：\n卖出物品：" +
                things[3] +
                "\n卖出数量：" +
                things[5] +
                "\n\n买家\n交换物品：" +
                things[4] +
                "\n交换数量：" +
                things[6] +
                "\n\n交换地点：" +
                things[7];
            break;
        case "2":
            show = "回收\n";
            show += "发起人：" + things[2] + "\n\n";
            show +=
                "回收物品：" +
                things[3] +
                "\n回收数量：" +
                things[4] +
                "\n价格/每个物品：" +
                things[5] +
                "\n交易地点：" +
                things[6];
            break;
    }
    var ui = new ActionFormData()
        .title("交易详情")
        .body(show)
        .button("返回上一页", ui_path + "arrow_dark_left_stretch.png");
    if (player.name === things[2]) {
        ui = ui.button("删除交易信息");
    }
    ui.show(player).then((result) => {
        if (result.selection === 0) {
            tradeBar(player);
        }
        if (result.selection === 1) {
            delete_trades(text);
            tradeBar(player);
        }
    });
}

function setTradeBar(player, mode) {
    var ui = new ModalFormData().title("设置交易内容");
    if (mode === 0) {
        ui = ui
            .textField("卖出物品", "在此输入", "绿帽子")
            .textField("卖出数量", "在此输入", "64")
            .textField("价格/每个物品", "在此输入", "5绿宝石")
            .textField("交易地点", "在此输入", "出生点");
    }
    if (mode === 1) {
        ui = ui
            .textField("卖方物品", "在此输入", "绿帽子")
            .textField("买方物品", "在此输入", "红帽子")
            .textField("卖方数量", "在此输入", "1")
            .textField("买方数量", "在此输入", "2")
            .textField("交易地点", "在此输入", "出生点");
    }
    if (mode === 2) {
        ui = ui
            .textField("回收物品", "在此输入", "绿帽子")
            .textField("回收数量", "在此输入", "114514")
            .textField("回收价格", "在此输入", "64绿宝石/组")
            .textField("交易地点", "在此输入", "出生点");
    }
    ui.show(player).then((result) => {
        var text = "trade，";
        text += String(mode) + "，" + player.name + "，";
        switch (mode) {
            case 0:
            case 2:
                text +=
                    result.formValues[0] +
                    "，" +
                    result.formValues[1] +
                    "，" +
                    result.formValues[2] +
                    "，" +
                    result.formValues[3];
                break;
            case 1:
                text +=
                    result.formValues[0] +
                    "，" +
                    result.formValues[1] +
                    "，" +
                    result.formValues[2] +
                    "，" +
                    result.formValues[3] +
                    "，" +
                    result.formValues[4];
                break;
        }
        save_trades(text);
        tradeBar(player);
    });
}


system.events.beforeWatchdogTerminate.subscribe((event) => {
    add_history("脚本运行异常，原因：" + event.terminateReason);
    event.cancel = true;
});
