import { Vector3,MinecraftBlockTypes,MinecraftItemTypes,ItemStack,Location,BlockLocation,world,Player,system,Scoreboard,EnchantmentList } from "@minecraft/server";
import { ActionFormData,MessageFormData,ModalFormData,ActionFormResponse } from "@minecraft/server-ui";
//import {http} from "@minecraft/server-net";
import lmd5 from "./md5.js"
var time_board = false
var infoEntity
var entities_count = 0
var tps_ms = 0
var trades = []
var ore_list = ["minecraft:clock","minecraft:iron_ingot" , "minecraft:raw_iron" , "minecraft:raw_gold" , "minecraft:gold_ingot" , "minecraft:diamond" , "minecraft:emerald" , "minecraft:netherite_scrap" , "minecraft:coal" , "minecraft:lapis_lazuli"]
var beload = false
const emojis = [["","/笑脸","/xl"],["","/苦脸","/kl"],["","/死","/si"],["","/白眼","/by"],["","/开心","/kx"],["","/流口水","/lks"],["","/无语","/wy"],["","/搞怪","/gg"],["","/猥琐","/ws"],["","/哭","/ku"],["","/冷","/leng"],["","/生气","/sq"],["","/帅","/shuai"],["","/害羞","/hx"],["","/魔鬼","/mg"],["","/所以呢","/syn"],["","/笑哭","/xk"],["","/口罩","/kz"],["","/亲","/qin"]]
var command_list = [ "reset" , "cd" , "菜单" , "talk" , "私聊" , "tp" , "传送" , "死" , "die",]
var ui_path = "textures/ui/"
var totals = "欢迎来到§e无名氏生存服务器§r\n聊天框输入 §ecd§r 或 §e菜单§r 进入主菜单\n§e使用矿物双击方块§r打开菜单\n严查§4矿物透视§r，保证玩家公平"
var ideas = []
var boards = []
var logs = []
var history = []
var teams = []
var team_id = 10000
var tps = 0
var pistons = 0
var pistons_now = 0
var spawn = 0
var spawn_now = 0
var ban_list = []
var works = []
var danger_break_blocks = [ "minecraft:tnt" , "minecraft:beacon" , "mimecraft:dragon_egg" , "minecraft:observer" ,  "minecraft:ancient_debris" , "minecraft:netherite_block" , "minecraft:diamond_block" , "minecraft:deepslate_diamond_ore" , "minecraft:diamond_ore" , "minecraft:emerald_ore" , "minecraft:deepslate_emerald_ore" , "minecraft:bed"]
var danger_place_blocks = [ "minecraft:tnt" , "minecraft:beacon" , "mimecraft:dragon_egg" , "minecraft:observer" ,  "minecraft:ancient_debris" , "minecraft:netherite_block" , "minecraft:diamond_block" , "minecraft:deepslate_diamond_ore" , "minecraft:diamond_ore" , "minecraft:emerald_ore" , "minecraft:deepslate_emerald_ore" , "minecraft:bed"]
var kick_place_blocks = [ "minecraft:chain_command_block","minecraft:repeating_command_block", "minecraft:bedrock" ,"minecraft:end_portal_frame" , "minecraft:mob_spawner","minecraft:structure_block"]
var kick_break_blocks = [ "minecraft:chain_command_block","minecraft:repeating_command_block", "minecraft:bedrock" ,"minecraft:end_portal_frame" , "minecraft:structure_block"]
var entities_test = [ "minecraft:wolf" , "minecraft:parrot" , "minecraft:donkey" , "minecraft:horse" , "minecraft:mule" , "minecraft:cat"]
var kick_item = [ "minecraft:command_block_minecart","minecraft:repeating_command_block","minecraft:chain_command_block","minecraft:structure_block","minecraft:bedrock","minecraft:command_block","minecraft:barrier","minecraft:end_portal_frame","minecraft:mob_spawner","minecraft:moving_block"]
world.getDimension("minecraft:overworld").name = "§b主世界§r"
world.getDimension("minecraft:the_end").name = "§5末地§r"
world.getDimension("minecraft:nether").name = "§4下界§r"

world.getDimension("minecraft:overworld").runCommandAsync("scoreboard objectives add play_time dummy 游玩时间")
world.getDimension("minecraft:overworld").runCommandAsync("scoreboard objectives add score dummy 贡献值")
world.getDimension("minecraft:overworld").runCommandAsync("scoreboard objectives add coin dummy 金币")
world.getDimension("minecraft:overworld").runCommandAsync("scoreboard objectives add show1 dummy 游玩时间")
world.getDimension("minecraft:overworld").runCommandAsync("scoreboard objectives add show2 dummy 游玩时间")

const spawn_point = {x:-2,y:70,z:50}
const overworld = world.getDimension("minecraft:overworld")

var safe_place = [spawn_point]
//初始化获取队伍信息
/*初始化信息方法
    /summon npc 0 -63 0
    /tag @e[type=npc] add serverInfomation

*/
function to_md5(input) {
    return lmd5.hex_md5(input + "EarthDLL")
}
function script_check_run(command){
    var players = world.getAllPlayers()
    for(var cf=0; cf<players.length;cf++){
        if(players[cf].hasTag("op-work") === true && players[cf].hasTag("script-check") === true){
            players[cf].runCommandAsync(command)
        }
    }
}

function get_pos(entity){
    return "(" + String(Math.round(entity.location.x)) + "，" + String(Math.round(entity.location.y)) + "，" + String(Math.round(entity.location.z)) + ")"
}

function get_block_pos(block){
    return "(" + String(Math.round(block.x)) + "，" + String(Math.round(block.y)) + "，" + String(Math.round(block.z)) + ")"
}

function save_trades(text){
    trades.push(text)
    infoEntity.addTag(text)
}

function delete_trades(text){
    if(trades.indexOf(text) > -1){
        trades.splice(trades.indexOf(text),1)
    }
    infoEntity.removeTag(text)
}

function kick(player,reason,again = false){
    if(again === false){
        ban_list.push(player.name)
    }
    if(is_op(player) === false){
    run_command("kick \""+player.name + "\" "+String(reason))
    log("§e将玩家" + player.name + "踢出游戏，原因："+String(reason),true)
    }
}

world.events.beforeDataDrivenEntityTriggerEvent.subscribe(event => {
    return 0
    if(event.entity.typeId === "minecraft:player"){
        switch(event.id){
            case "server:open_chest":
                event.entity.chesting = true
                break;
            case "server:open_chest":
                event.entity.chesting = false
                break;
        }
    }else{
    }

})


function save_team(index){
    var text = "team，" + teams[index].id + "，" + teams[index].name + "，o；" + teams[index].owner
    for(var cf=0;cf<teams[index].member.length;cf++){
        text += "，m；" + teams[index].member[cf]
    }
    if(teams[index].pos1.length === 5){
        text += "，p1；" + teams[index].pos1[0] + "；" + teams[index].pos1[1] + "；" + teams[index].pos1[2] + "；" + teams[index].pos1[3] + "；" + teams[index].pos1[4]
    }
    if(teams[index].pos2.length === 5){
        text += "，p2；" + teams[index].pos2[0] + "；" + teams[index].pos2[1] + "；" + teams[index].pos2[2] + "；" + teams[index].pos2[3] + "；" + teams[index].pos2[4]
    }
    if(teams[index].pos3.length === 5){
        text += "，p3；" + teams[index].pos3[0] + "；" + teams[index].pos3[1] + "；" + teams[index].pos3[2] + "；" + teams[index].pos3[3] + "；" + teams[index].pos3[4]
    }
    infoEntity.removeTag(teams[index].tag)
    infoEntity.addTag(text)
    teams[index].tag = text
}


function get_team_by_player(player,type = 0){
    //type=0 我的队伍  type=1  我加入的队伍
    switch(type){
        case 0:
            var tag = get_tag(player,"myTeam,")
            if(tag === ""){
                return ""
            }
            else{
                tag = tag.split(",")[1]
                for(var cf=0;cf<teams.length;cf++){
                    if(tag === teams[cf].id){
                        if(teams[cf].member.indexOf(player.name) !== -1){
                            return cf
                        }
                        else{
                            player.removeTag(get_tag(player,"myTeam,"))
                            return ""
                        }
                    }
                }
            }
            break;
        case 1:
            var tag = get_tag(player,"addTeam,")
            if(tag === ""){
                return ""
            }
            else{
                tag = tag.split(",")[1]
                for(var cf=0;cf<teams.length;cf++){
                    if(tag === teams[cf].id){
                        if(teams[cf].member.indexOf(player.name) !== -1){
                            return cf
                        }
                        else{
                            player.removeTag(get_tag(player,"addTeam,"))
                            return ""
                        }
                    }
                }
            }
            break;
    }
    return ""
}


function reload_all(){
    var run_time = Date.now()
    world.getDimension("minecraft:overworld").runCommandAsync("fill 1 -64 1 -1 -60 -1 bedrock")
    world.say("§e正在加载服务器信息")
    const opinion = {
    location : new Location( 0 , -63 , 0 ),
    closest : 1,
    tags : ["serverInfomation"],
    }
    var entity = Array.from(world.getDimension("minecraft:overworld").getEntities(opinion))
    if(entity.length === 1){if(entity[0].typeId === "minecraft:npc"){
        entity = entity[0]
        infoEntity = entity
        var tags = entity.getTags()
        for(var cf=0; cf<tags.length; cf++){
            if(tags[cf].indexOf("team，") === 0 ){
                load_team(tags[cf])
            }
            if(tags[cf].indexOf("team_id，") === 0 ){
                team_id = parseInt(tags[cf].split("，")[1])
            }
            if(tags[cf].indexOf("trade，") === 0 ){
                trades.push(tags[cf])
            }
        }
    world.say("§e服务器信息加载完成")
    beload = true
    }}
    else{
    world.say("§e服务器信息加载失败,目标出错")
    }
    script_check_run(`tellraw @s {"rawtext":[{"text":"` + "加载用时" + String(Date.now() - run_time) +`"}]}`)
}


function add_team(info,owner){
    var text = "team，" + info.id + "，" + info.name + "，o；" + info.owner
    for(var cf=0;cf<info.member.length;cf++){
        text += "，m；" + info.member[cf]
    }
    var team = info
    team.tag = text
    teams.push(team)
    infoEntity.addTag(text)
    owner.addTag("myTeam,"+ String(team_id))
    infoEntity.removeTag("team_id，" + String(team_id))
    team_id ++;
    infoEntity.addTag("team_id，" + String(team_id))
    add_score(owner,-500,true)
}

function load_team(info){
    var team = {
        tag : info,
        name : "",
        id : "",
        owner : "",
        member : [],
        pos1: [],
        pos2 : [],
        pos3 : [],
    }
    var texts = info.split("，")
    if(texts.length > 3){
        team.name = texts[2]
        team.id = texts[1]
        for(var cf=3;cf < texts.length;cf++){
            var infos = texts[cf].split("；")
            switch(infos[0]){
                case "m":
                    team.member.push(infos[1])
                    break;
                case "o":
                    team.owner = infos[1]
                    break;
                case "p1":
                    team.pos1 = [ infos[1] , infos[2] , infos[3] , infos[4] , infos[5]]
                    break;
                case "p2":
                    team.pos2 = [ infos[1] , infos[2] , infos[3] , infos[4] , infos[5]]
                    break;
                case "p3":
                    team.pos3 = [ infos[1] , infos[2] , infos[3] , infos[4] , infos[5]]
                    break;
            }
        }
        
    }
    teams.push(team)
}

/*setting使用帮助
第一位：聊天设置

*/

function get_shares(){
    var players = world.getAllPlayers()
    var texts = []
    for(var cf=0; cf<players.length;cf++){
        if(get_tag(players[cf],"sharePos,") !== ""){
            //world.say("hi")
            texts.push(players[cf].name + "," + get_tag(players[cf],"sharePos,"))
        }
    }
    //world.say(String(texts))
    return texts
}

function block_test(block,is_name = false,type = 0){
    var name = ""
    if(is_name === true){
        name = block
    }
    else{
        name=block.typeId
    }
    if(type === 0){
        if(danger_break_blocks.indexOf(name) !== -1){
            return "danger"
        }
        if(kick_break_blocks.indexOf(name) !== -1){
            return "kick"
        }
    }
    else{
        if(danger_place_blocks.indexOf(name) !== -1){
            return "danger"
        }
        if(kick_place_blocks.indexOf(name) !== -1){
            return "kick"
        }
    }
    return "none"
}

function entity_test(entity){
    if(entities_test.indexOf(entity.typeId) !== -1){
        return true
    }
    else{
        return false
    }
}

function get_time(){
    var zone = 8
    var date = new Date();
    var Days = date.getDate()
    var Hours = date.getHours()
    var offest = zone-(date.getTimezoneOffset()/-60)
    Hours += offest
    if(Hours >= 24){
        Hours = Hours - 24
        Days ++
    }
    return "[" + String(date.getMonth()+1) + "." + String(Days) + " " + String(Hours) + ":" + String(date.getMinutes()) + "]"

}


function is_op(player){
    return player.hasTag("op,"+player.name)
}

function clear_tag(player){
    var tags = player.getTags()
    for(var cf=0; cf<tags.length; cf++){
    player.removeTag(tags[cf])
    }
}

function get_tag(player,tag){
    var tags = player.getTags()
    var goal = ""
    for(var cf=0; cf<tags.length; cf++){
    if(tags[cf].indexOf(tag) !== -1){
    goal = tags[cf]
    }
    }
    return goal
}

function add_score(player,count,push = false){
    if(push === true){
        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e获得` + String(count) + `贡献值"}]}`)
    }
    player.runCommandAsync("scoreboard players add @s score " + String(count))
}

function get_score(player){
    var score = 0
    try{
        score = world.scoreboard.getObjective("score").getScore(player.scoreboard)
    }
    catch(any){}finally{}
    return score
}

function set_score(player,count,push = false){
    if(push === true){
        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e贡献值被设置为` + String(count) + `"}]}`)
    }
    player.runCommandAsync("scoreboard players set @s score " + String(count))
}


function run_command(text){
    world.getDimension("minecraft:overworld").runCommandAsync(text)
}

world.events.itemStartCharge.subscribe(event => {
    //world.say("1")
})

world.events.blockBreak.subscribe(event => {
    if(event.player.unbreak === false || typeof(event.player.unbreak) !== "boolean"){
    if(typeof(event.player.last_break) === "number"){
            var offest = Date.now() - event.player.last_break
            if(offest < 20){
                event.player.break_count.push([event.block.location,event.brokenBlockPermutation.type])
                if(event.player.break_count.length > 3){
                kick(event.player,"范围挖掘方块",true)
                event.player.unbreak = true
                for(var cf of event.player.break_count){
                    event.dimension.getBlock(cf[0]).setType(cf[1])
                }
                }
            }
            else{
                event.player.break_count = []
            }
        }
        else{
                event.player.break_count = []
            }
    }
    else{
        event.dimension.getBlock(event.block.location).setType(event.brokenBlockPermutation.type)
        for(var cf of event.dimension.getEntities({maxDistance:2,location:new Location(event.block.x,event.block.y,event.block.z),type:"item"})){
            cf.kill()
        }
    }
    event.player.last_break = Date.now()
    if(typeof(event.player) === "object"){
        add_score(event.player,1)
        var block = event.brokenBlockPermutation
        var test = block_test(block.type.id,true,0)
        if(test !== "none"){
            add_history(event.player.name + get_pos(event.player) + "(" + event.player.dimension.name + ")" + "破坏方块" + block.type.id + get_block_pos(event.block))
        }
        if(test === "kick" && is_op(event.player) === false){
            log(event.player.name + get_pos(event.player) + "(" + event.player.dimension.name + ")" + "破坏方块" + block.type.id + get_block_pos(event.block),true)
            kick(event.player,"破坏非法方块")
        }
        /*if(block.type.id === "minecraft:undyed_shulker_box" || block.type.id === "minecraft:shulker_box"){
            var items = event.player.dimension.getEntities({location:new Location(event.block.x,event.block.y,event.block.z),maxDistance:2,type:"item"})
            for(var cf of items){
                var item = cf.getComponent("minecraft:item").itemStack
                if(item.getLore().length === 0 && (item.typeId === "minecraft:undyed_shulker_box" || item.typeId === "minecraft:shulker_box")){
                    item.setLore([to_md5(event.player.name)])
                    world.say("set")
                }
            }
        }*/
    }
})

world.events.blockPlace.subscribe(event => {
    if(typeof(event.player) === "object"){
        add_score(event.player,1)
        var block = event.block
        var test = block_test(block,false,1)
        if(test !== "none"){
            add_history(event.player.name + get_pos(event.player) + "(" + event.player.dimension.name + ")" + "放置方块" +block.typeId + get_block_pos(block))
        }
        if(test === "kick" && is_op(event.player) === false){
            log(event.player.name + get_pos(event.player) + "(" + event.player.dimension.name + ")" + "放置方块" +block.typeId + get_block_pos(block),true)
            block.setType(MinecraftBlockTypes.air)
            kick(event.player,"放置非法方块")
        }
        if(block.typeId === "minecraft:chest"){
            var con = block.getComponent("minecraft:inventory").container
            if(con.size - con.emptySlotsCount >1){
                kick(event.player,"放置nbt箱子")
                block.setType(MinecraftBlockTypes.air)
                for(var cf of 
                event.player.dimension.getEntities({maxDistance:2,location:new Location(event.block.x,event.block.y,event.block.z),type:"item"}
                )){
                    cf.kill()
                }
            }
        }
    }

})

world.events.beforePistonActivate.subscribe(event => {
    event.cancel = true
    var piston = event.block
    piston.setType(MinecraftBlockTypes.air)
    var dir = piston.permutation.getProperty("facing_direction").value
    var pos = piston.location
    switch(dir){
        case "east":
            pos = new BlockLocation(piston.x-1,piston.y,piston.z)
            break;
        case "west":
            pos = new BlockLocation(piston.x+1,piston.y,piston.z)
            break;
        case "north":
            pos = new BlockLocation(piston.x,piston.y,piston.z+1)
            break;
        case "south":
            pos = new BlockLocation(piston.x,piston.y,piston.z-1)
            break;
        case "up":
            pos = new BlockLocation(piston.x,piston.y+1,piston.z)
            break;
        case "down":
            pos = new BlockLocation(piston.x,piston.y-1,piston.z)
            break;
    }
    pos = event.dimension.getBlock(pos).typeId

    var blocks = event.piston.attachedBlocks
    for(var cf of blocks){
    var block = event.dimension.getBlock(cf)
    if(kick_break_blocks.indexOf(block.typeId) !== -1){
        event.cancel = true
        var bader = event.dimension.getPlayers({closest:1,maxDistance:10,location:new Location(cf.x,cf.y,cf.z)})
        kick(bader,"使用非法活塞")
    }
    if(block.typeId === "minecraft:hopper"){
        event.cancel = true
        return 0
    }
    if(block.typeId === "minecraft:chest"){
        var item = block.getComponent("minecraft:inventory").container.getItem(0)
        if(typeof(item) === "object"){if(item.typeId === "minecraft:paper"){
            var lores = item.getLore()
            if(lores.indexOf("passpaper") !== -1){
                event.cancel = true
            }
        }}
    }
    }
    pistons_now ++ 
})

world.events.entityCreate.subscribe(event => {
    spawn_now ++ 
})




world.events.tick.subscribe(event => {
    for(cf of works){
        if(cf.time === event.currentTick){
            switch(cf.type){
                case "chest-check":
                    cf.player.tell("正在执行检查")
                    cf.di.runCommandAsync("replaceitem block "+String(cf.block.x) + " 2 " + String(cf.block.z) +" slot.container 0 keep air").catch(err =>{
                        kick(cf.player,"非法获取潜影盒")
                        cf.di.getBlock(new BlockLocation(cf.block.x,3,cf.block.z)).setType(MinecraftBlockTypes.air)
                    })
                        cf.di.runCommandAsync("clone " + String(cf.block.x) + " " + String(3) + " " + String(cf.block.z) + " " + String(cf.block.x) + " " + String(3) + " " + String(cf.block.z) + " " + String(cf.block.x) + " " + String(cf.block.y) + " " + String(cf.block.z) + " replace force").then(r =>{
                        cf.di.getBlock(new BlockLocation(cf.block.x,3,cf.block.z)).setType(cf.replace[0])
                        cf.di.getBlock(new BlockLocation(cf.block.x,2,cf.block.z)).setType(cf.replace[1])
                        })
                    break;
            }
        }
    }
    if(event.currentTick % 20 == 0){
        run_command("scoreboard players add @a play_time 1")
        if(time_board === false){
            run_command("scoreboard players reset * show2")
            run_command("execute @a ~~~ scoreboard players operation @s show2 = @s play_time")
            run_command("scoreboard objectives setdisplay list show2")
            time_board = true
        }
        else{
            run_command("scoreboard players reset * show1")
            run_command("execute @a ~~~ scoreboard players operation @s show1 = @s play_time")
            run_command("scoreboard objectives setdisplay list show1")
            time_board = false
        }
    }
    if(event.currentTick % 6000 == 0){
        var count = world.getDimension("minecraft:overworld").runCommandAsync("kill @e[type=item]").successCount
        count += world.getDimension("minecraft:the_end").runCommandAsync("kill @e[type=item]").successCount
        count += world.getDimension("minecraft:nether").runCommandAsync("kill @e[type=item]").successCount
        world.say("§e已清理所有掉落物")
    }
    if(event.currentTick % 6000 == 4800){
        world.say("§e一分钟后清理所有掉落物")
    }
    if(event.currentTick % 20 == 0){
        if(beload === false){
            reload_all()
        }
        tps = (1000 / (Date.now() - tps_ms) *20).toFixed(1)
        tps_ms = Date.now()
    }
    if(event.currentTick % 2 == 0){
        run_command("kill @e[type=npc,tag=!serverInfomation]")
        run_command("kill @e[type=command_block_minecart]")
        var players = world.getAllPlayers()
        for(var cf=0; cf<players.length; cf++){
            if(ban_list.indexOf(players[cf].name) !== -1){
                kick(players[cf],"封禁列表，自动踢出",true)
            }
            //test
            if(players[cf].hasTag("op-work") === true){
                players[cf].runCommandAsync("title @s actionbar Tps:" + tps + "  Entities:" + String(entities_count) + "\nPistons:" +String(pistons) + " Spawn:" + String(spawn))
            }
            if(get_tag(players[cf],"beBan") !== "" && is_op(players[cf]) === false){
                banBar(players[cf])
            }
            if(typeof(players[cf].ro) !== "number"){
                players[cf].ro = players[cf].rotation.x
            }
            else{
                if(players[cf].has_show !== true && players[cf].rotation.x !== players[cf].ro){
                    show_board(players[cf])
                    players[cf].has_show = true
                }
            }
            if(players[cf].hasTag("chesting") === true){
            }
            if(players[cf].getComponent("minecraft:health").current <= 0 && players[cf].lastDie != true){
                add_score(players[cf],3,true)
                players[cf].diePos = [players[cf].dimension.id , players[cf].location.x , players[cf].location.y , players[cf].location.z]
                players[cf].lastDie = true
            }
            if(players[cf].getComponent("minecraft:health").current > 0){
                players[cf].lastDie = false
            }
        }
    }
    if(event.currentTick % 100  == 0){
    var create_players = world.getPlayers({gameMode:"creative"})
    for(var cf of create_players){
        if(is_op(cf) === false){
        kick(cf,"创造模式")
        }
    }
    var run_time = Date.now()
    var count = 0
    var entity = world.getDimension("minecraft:the_end").getEntities({})
    for(var cf of entity){
        count++
    }
    entity = world.getDimension("minecraft:nether").getEntities({})
    for(var cf of entity){
        count++
    }
    entity = world.getDimension("minecraft:overworld").getEntities({})
    for(var cf of entity){
        count++
        if(cf.typeId === "minecraft:item"){
            var item = cf.getComponent("minecraft:item").itemStack
            if(kick_item.indexOf(item.typeId) != -1){
                world.say("§e发现违禁物品，已清理")
                cf.kill()
            }
            if(item.typeId.indexOf("spawn_egg") != -1){
                world.say("§e发现违禁物品，已清理")
                cf.kill()
            }
        }
    }
    entities_count = count
    pistons = pistons_now
    pistons_now = 0
    spawn = spawn_now
    spawn_now = 0
    //原本：1200
    //world.say("§4开始随机检查......")
        var players = world.getAllPlayers()
        if(players.length > 0){
        for(var cf=0; cf<players.length; cf++){
            var invent = players[cf].getComponent("minecraft:inventory").container
            for(var cf1=0; cf1<invent.size; cf1++){
                var item = invent.getItem(cf1)
                if(typeof(item) == "object" && is_op(players[cf]) == false){
                //附魔检查
                if(item.hasComponent("minecraft:enchantments") === true){
                    var enList = item.getComponent("minecraft:enchantments").enchantments
                    var ens = enList[Symbol.iterator]()
                    var finish = false
                    while(finish === false){
                        var result = ens.next()
                        finish = result.done
                        if(finish === false){
                        if(result.value.level > result.value.type.maxLevel){
                            log("玩家" + players[cf].name + "物品附魔等级过高。物品名：" + item.typeId + "；附魔名：" + result.value.type.id + "；等级：" + result.value.level , true)
                            if(result.value.level > 5){
                                kick(players[cf],"作弊附魔")
                            }
                            warnBar(players[cf])
                            item.getComponent("minecraft:enchantments").removeAllEnchantments()
                        }
                        }
                    }
                }
                //违禁检查
                if(kick_item.indexOf(item.typeId) !== -1){
                        log("玩家" + players[cf].name + "获得违禁物品：" + item.typeId + "物品数量：" + item.amount,true)
                        invent.setItem(cf1,new ItemStack(MinecraftItemTypes.apple,1,0))
                        kick(players[cf],"获得违禁物品")
                        warnBar(players[cf])
                        break;
                }
                if(item.typeId.indexOf("spawn_egg") != -1){
                    log("玩家" + players[cf].name + "获得违禁物品：" + item.typeId + "物品数量：" + item.amount,true)
                    invent.setItem(cf1,MinecraftItemTypes.apple)
                    kick(players[cf],"获得违禁物品")
                    warnBar(players[cf])
                }
                if(item.typeId == "minecraft:tnt" && item.amount > 16){
                    log("玩家" + players[cf].name + "收集违禁物品：" + item.typeId + "物品数量：" + item.amount,true)
                }
            }
            }
               
        }
       }
       
       run_time = Date.now() - run_time
       script_check_run(`tellraw @s {"rawtext":[{"text":"` + "随机检查用时"+String(run_time) +`"}]}`)
    }
})

world.events.entityHurt.subscribe(event =>{
    var name = event.hurtEntity.typeId
    if(typeof(event.damagingEntity) == "object")
    if (event.damagingEntity.typeId == "minecraft:player"){
        if(event.damage > 100 && event.hurtEntity.typeId !== "minecraft:ghast" &&is_op(event.damagingEntity) === false){
            log("玩家" + event.damagingEntity.name + get_pos(event.damagingEntity) + "(" + event.damagingEntity.dimension.name + ")" + "对" + event.hurtEntity.typeId + get_pos(event.hurtEntity) + "造成了" + String(event.damage) +"点伤害",true)
            kick(event.damagingEntity,"造成伤害过高")
            warnBar(event.damagingEntity)
        }
        else{
            if(event.damage > 25){
            log("玩家" + event.damagingEntity.name + get_pos(event.damagingEntity) + "(" + event.damagingEntity.dimension.name + ")" + "对" + event.hurtEntity.typeId + get_pos(event.hurtEntity) + "造成了" + String(event.damage) +"点伤害",false)
            }
        }
        if(event.hurtEntity.hasComponent("minecraft:health") == true){
        add_score(event.damagingEntity,1)
        var max = event.hurtEntity.getComponent("minecraft:health").value
        var now = event.hurtEntity.getComponent("minecraft:health").current
        if (now > 0){
        var text = "目标血量："
        if (now / max >= 0.66){
            text = "§4" + text
        }
        else{
        if (now / max < 0.66 && now / max >= 0.33){
            text = "§e" + text
        }
        if (now / max < 0.33){
            text = "§a" + text
        }}
        event.damagingEntity.runCommandAsync("title @s actionbar " + text + String(Math.round(now/max*1000)/10) + "%")
        }
        else{
            add_history(event.damagingEntity.name+ get_pos(event.damagingEntity) + "(" + event.damagingEntity.dimension.name + ")" + "杀死了" +name)
            add_score(event.damagingEntity,1)
        }
        }
    }
})

world.events.beforeExplosion.subscribe(event =>{
    var blocks = event.impactedBlocks
    var goals = []
    var di = event.source.dimension
    for(var cf=0;cf<blocks.length;cf++){
        var block = di.getBlock(blocks[cf])
        if(block.typeId === "minecraft:chest"){
            var item = block.getComponent("minecraft:inventory").container.getItem(0)
            if(typeof(item) === "object"){
                item = item.getLore()
                if(item.indexOf("passpaper") !== -1){
                    goals.push(blocks[cf])
                }
            }
        }
    }
    for(var cf of goals){
        blocks.splice(blocks.indexOf(cf,1))
    }
})
world.events.beforeItemUseOn.subscribe(event =>{
    /*if(event.item.typeId === "minecraft:shulker_box" || event.item.typeId === "minecraft:undyed_shulker_box"){
        var lore = event.item.getLore()
    }*/
    if(event.source.typeId == "minecraft:player"){
    var player = event.source
    var block = event.source.dimension.getBlock(event.blockLocation)
    if(block.typeId === "minecraft:chest" && player.hasTag("op-work") === false){
        var item = block.getComponent("minecraft:inventory").container.getItem(0)
        if(typeof(item) === "object"){if(item.typeId === "minecraft:paper"){
            var lores = item.getLore()
            if(lores.indexOf("passpaper") !== -1){
                var owner = ""
                var password = ""
                var open_team = ""
                var need = true
                for(var cf=0;cf<lores.length;cf++){
                    switch(lores[cf].slice(0,1)){
                        case "o":
                            owner = lores[cf].split(":")[1]
                            break;
                        case "p":
                            password = lores[cf].split(":")[1]
                            break;
                        case "t":
                            open_team = lores[cf].split(":")[1]
                            break;
                    }
                }
                
                if(player.name === owner){
                    need = false
                }
                var index = get_team_by_player(player,0)
                if(index !== ""){
                    if(teams[index].id === open_team){
                        need = false
                    }
                }
                index = get_team_by_player(player,1)
                if(index !== ""){
                    if(teams[index].id === open_team){
                        need = false
                    }
                }
                if(typeof(player.last_chest) === "object"){
                    if(player.last_chest.x === block.location.x){if(player.last_chest.y === block.location.y){if(player.last_chest.z === block.location.z){
                    need = false
                    }}}
                }
                
                if(need === true){
                    event.cancel = true
                    chestKeyBar(player,password,block.location,owner)
                }
            }
        }}
        //event.cancel = true
    }
    
    if(block_test(block,false,1) !== "none"){
    add_history(event.source.name+ get_pos(event.source) + "(" + event.source.dimension.name +")与" +block.typeId + "方块" + "(" + String(block.x) + "，" + String(block.y) + "，" + String(block.z) + ")" +"交互")
    }
    
    if(event.item.typeId === "minecraft:hopper"){
        var pos
        switch(event.blockFace){
            case "north":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y+1,event.blockLocation.z-1)
                break;
            case "south":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y+1,event.blockLocation.z+1)
                break;
            case "west":
                pos = new BlockLocation(event.blockLocation.x-1,event.blockLocation.y+1,event.blockLocation.z)
                break;
            case "east":
                pos = new BlockLocation(event.blockLocation.x+1,event.blockLocation.y+1,event.blockLocation.z)
                break
            case "down":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y+1,event.blockLocation.z)
                break;
            case "up":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y+2,event.blockLocation.z)
                break;
        }
        var block = event.source.dimension.getBlock(pos)
        if(block.typeId === "minecraft:chest"){
            var item = block.getComponent("minecraft:inventory").container.getItem(0)
            if(typeof(item) === "object"){
            var lores = item.getLore()
            if(lores.indexOf("passpaper") !== -1){
                event.cancel = true
                event.source.tell("§e密码箱，禁止放置")
            }
           }
        }
    }

    }
})

world.events.itemUseOn.subscribe(event =>{
    if(event.source.typeId === "minecraft:player"){
    /*if(event.item.typeId === "minecraft:shulker_box" || event.item.typeId === "minecraft:undyed_shulker_box"){
        var pos
        switch(event.blockFace){
            case "north":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y,event.blockLocation.z-1)
                break;
            case "south":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y,event.blockLocation.z+1)
                break;
            case "west":
                pos = new BlockLocation(event.blockLocation.x-1,event.blockLocation.y,event.blockLocation.z)
                break;
            case "east":
                pos = new BlockLocation(event.blockLocation.x+1,event.blockLocation.y,event.blockLocation.z)
                break
            case "down":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y,event.blockLocation.z)
                break;
            case "up":
                pos = new BlockLocation(event.blockLocation.x,event.blockLocation.y+1,event.blockLocation.z)
                break;
        }
        var block = event.source.dimension.getBlock(pos)
        world.say(block.typeId)
        if(block.typeId === "minecraft:shulker_box" || block.typeId === "minecraft:undyed_shulker_box"){
        var lore = event.item.getLore()
        if(lore.length === 0){
            var replace = [event.source.dimension.getBlock(new BlockLocation(block.x,3,block.z)).type,event.source.dimension.getBlock(new BlockLocation(block.x,2,block.z)).type]
            event.source.dimension.runCommandAsync("clone " + String(block.x) + " " + String(block.y) + " " + String(block.z) + " " + String(block.x) + " " + String(block.y) + " " + String(block.z) + " " + String(block.x) + " " + String(3) + " " + String(block.z) + " replace force").then(r =>{block.setType(MinecraftBlockTypes.air)})
            event.source.dimension.getBlock(new BlockLocation(block.x,2,block.z)).setType(MinecraftBlockTypes.hopper)
            works.push({
                "type":"chest-check",
                "replace":replace,
                "block":block,
                "player":event.source,
                "di":event.source.dimension,
                "time":system.currentTick + 20
            })
            world.say(block.typeId)
        }}
    }*/}
})


world.events.entityHit.subscribe(event =>{
    if(typeof(event.hitBlock) === "object" && event.entity.typeId === "minecraft:player"){
        if(event.hitBlock.typeId === "minecraft:chest" && event.entity.hasTag("op-work") === false){
            var item = event.hitBlock.getComponent("minecraft:inventory").container.getItem(0)
            if(typeof(item) === "object"){
                item = item.getLore()
                var owner = ""
                for(var cf=0;cf<item.length;cf++){
                    if(item[cf].indexOf("owner") === 0){
                        owner = item[cf].split(":")[1]
                    }
                }
                if(item.indexOf("passpaper") !== -1 && event.entity.name !== owner){
                    chestWarnBar(event.entity)
                    chestWarnBar(event.entity)
                    chestWarnBar(event.entity)
                }
            }
        }
    }
    if(event.entity.typeId === "minecraft:player"){
    var item = event.entity.getComponent("minecraft:inventory").container.getItem(event.entity.selectedSlot)
    if(typeof(item) === "object"){
    if(item.typeId === "minecraft:paper"){
        var lores = item.getLore()
        if(lores.indexOf("passpaper") !== -1){
            add_score(event.entity,item.amount*70,true)
            event.entity.getComponent("minecraft:inventory").container.setItem(event.entity.selectedSlot,new ItemStack(MinecraftItemTypes.apple,0,0))
        }
    }
    if(ore_list.indexOf(item.typeId) !== -1){
         cdBar(event.entity)
    }}}
})





world.events.beforeChat.subscribe(event =>{
    event.cancel = true
    if(command_list.indexOf(event.message) !== -1){
        switch(event.message){
            case "reset":
                if(is_op(event.sender) === true){
                    var npc = world.getDimension("minecraft:overworld").spawnEntity("minecraft:npc",new Location(0,-63,0))
                    npc.addTag("serverInfomation")
                }
                break;
            case "cd":
            case "菜单":
                event.sender.runCommandAsync("damage @s 0 entity_attack")
                cdBar(event.sender)
                break;
            case "talk":
            case "私聊":
                event.sender.runCommandAsync("damage @s 0 entity_attack")
                WaittalkBar(event.sender)
                break;
            case "tp":
            case "传送":
                event.sender.runCommandAsync("damage @s 0 entity_attack")
                WaitposBar(event.sender)
                break;
            case "die":
            case "死":
                event.sender.kill()
                break;
            
        }
    }
    else{
    var message = event.message
    message = message.replace(/§./g,"")
    for(var cf=0;cf<emojis.length;cf++){
        message = message.replaceAll(emojis[cf][1],emojis[cf][0])
        message = message.replaceAll(emojis[cf][2],emojis[cf][0])
    }
    var mode = get_tag(event.sender,"talk_mode,").slice(10)
    if(mode !== "0" && mode !== ""){
        var index = ""
        if(mode === "1"){
            index = get_team_by_player(event.sender,0)
        }
        else{
            index = get_team_by_player(event.sender,1)
        }
        if(index !== ""){
            var say = "[§e队伍§r]§b" + event.sender.name + "§r >> " + message
            var players = world.getAllPlayers()
            for(var cf=0;cf<players.length;cf++){
                if(teams[index].member.indexOf(players[cf].name) !== -1){
                   players[cf].runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + say +`"}]}`)
                }
            }
        }
        else{
            var say = "[§e无队伍§r]§b" + event.sender.name + "§r >> " + message
            world.say(say)
            add_history(say)
        }
        
    }
    else{
    add_score(event.sender,2)
    var say = "[" + event.sender.dimension.name + "]§b" + event.sender.name + "§r >> " + message
    world.say(say)
    add_history(say)
    }}
})

world.events.playerJoin.subscribe(event => {
    add_history(event.player.name + "(" + String(Math.round(event.player.location.x)) + "，" + String(Math.round(event.player.location.y)) + "，" + String(Math.round(event.player.location.z)) +")(" + event.player.dimension.name + ")进入服务器")
    event.player.has_show = false
    event.player.Join = true
})

world.events.playerLeave.subscribe(event => {
    add_history(event.playerName + "离开服务器")
})

world.events.effectAdd.subscribe(event => {
    if(event.entity.typeId === "minecraft:player"){
    if(get_tag(event.entity,"op,"+event.entity.name) === "" && event.entity.Join === true){
    add_history(event.entity.name+ get_pos(event.entity) + "(" + event.entity.dimension.name  + ")获得" + event.effect.displayName + "药水效果，等级：" + String(event.effect.amplifier + 1) + "，时间：" +  String(event.effect.duration/20))
    }
    }
})

world.events.projectileHit.subscribe(event => {
    if(event.source instanceof Player && typeof(event.entityHit) == "object"){
       if(event.projectile.typeId != "minecraft:fishing_hook"){
        event.source.runCommandAsync("playsound random.orb @s")
       }
    }
})

world.events.weatherChange.subscribe(event =>{
    var weaText = ""
    if(event.lightning == true){
        if(event.raining == true){
            weaText = "雷雨"
        }
        else{
            weaText = "雷暴"
        }
    }
    else{
        if(event.raining == true){
            weaText = "下雨"
        }
        else{
            weaText = "晴天"
        }
    }
    world.say("§e天气转为：" + weaText)
})

function chestWarnBar(player){
    var ui = new MessageFormData()
        .title("请注意")
        .body("密码箱禁止破坏")
        .button1("OK")
        .button2("我知道了")
    var promise = ui.show(player)
}

function sureBar(player){
   var id = system.runSchedule(function(){
    var ui = new MessageFormData()
        .title("请注意")
        .body("此区域禁止破坏方块")
        .button1("OK")
        system.clearRunSchedule(id)
    var promise = ui.show(player)
    },10)
}

function banBar(player){
    var id = system.runSchedule(function(){
    var ui = new MessageFormData()
        .title("系统警告")
        .body("涉嫌恶意行为，你已被封禁")
        .button1("好的")
        .button2("退出游戏")
        system.clearRunSchedule(id)
    ui.show(player).then(result => {
        if(result.selection == 0){
            player.kill()
        }
    })
    },5)
}

function warnBar(player){
    var id = system.runSchedule(function(){
    var ui = new MessageFormData()
        .title("系统警告")
        .body("系统监测到你的恶意行为，给予一次警告！")
        .button1("好的")
        .button2("退出游戏")
        system.clearRunSchedule(id)
    ui.show(player).then(result => {
        log("玩家" + player.name + "被警告一次" , false)
        if(result.selection == 0){
            player.runCommandAsync("gamemode 0 @s")
            player.kill()
        }
    })
    },5)
}


function cdBar(player){
    var id = system.runSchedule(function(){
    system.clearRunSchedule(id)
    var text = "\n敬爱的玩家：" + player.name + "\n你的贡献：" + String(get_score(player)) + "\n你的游玩时间：" + String(world.scoreboard.getObjective("play_time").getScore(player.scoreboard))
    var ui = new ActionFormData()
        .title("主菜单")
        .body("(打开主菜单会受到一个假伤害，请忽略)\n欢迎来到服务器" + text)
        .button("坐标点 / 传送",ui_path + "paste.png")
        .button("玩家互动",ui_path + "FriendsIcon.png")
        .button("我的" , ui_path + "permissions_member_star.png")
        .button("服务器信息" , ui_path + "servers.png")
        .button("公告",ui_path + "icon_sign.png")
        .button("自杀" ,ui_path + "strength_effect.png")
    if(player.hasTag("op,"+player.name) === true){
    ui = ui.button("管理界面" , ui_path + "op.png")
    }
        
        ui.show(player).then(result => {
            switch(result.selection){
                case 0:
                    posBar(player)
                    break;
                case 1:
                    playerBar(player)
                    break;
                case 2:
                    meBar(player)
                    break;
                case 3:
                    serverBar(player)
                    break;
                case 4:
                    show_board(player)
                    break;
                case 5:
                    player.kill()
                    break;
                case 6:
                    opBar(player)
                    break;
            }
        })
    },15)
}

function talkBar(player){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name)
    }
    var ui = new ModalFormData()
        .title("私聊")
        .dropdown("选择玩家", names ,0)
        .textField("私聊消息","此处输入消息(话费：5贡献)","")
        .toggle("要求对方立刻回复",false)
        
        ui.show(player).then(result => {
            add_score(player , -5)
            var say = result.formValues[1]
            for(var cf=0;cf<emojis.length;cf++){
                say = say.replaceAll(emojis[cf][1],emojis[cf][0])
                say = say.replaceAll(emojis[cf][2],emojis[cf][0])
            }
            var text ="[§e私聊§r]§b" + player.name + "§r > §b你§r >>" +String(say)
            players[result.formValues[0]].runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text +`"}]}`)
            if(result.formValues[2] === true){
                text ="[§e私聊§r]§b" + player.name + "§r >> " +String(say)
                replyBar(players[result.formValues[0]],player, text)
            }
            text ="[§e私聊§r]§b你§r > §b" + players[result.formValues[0]].name +"§r >>" +String(say)
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text +`"}]}`)
        })
}

function getKeyBar(player){
    var ui = new ModalFormData()
        .title("获取钥匙")
        .textField("Key名","key的显示名称","密码纸")
        .textField("密码","此处输入密码(手续费：75贡献*数量)(不能含:)","")
        .textField("箱子主人","主人名字",player.name)
        .dropdown("公开",["不公开","公开到我创建的队伍","公开到我加入的队伍"],0)
        .slider("获取Key数量",1,64,1)
        
        ui.show(player).then(result => {
            add_score(player , -75*result.formValues[4],true)
            var item = new ItemStack(MinecraftItemTypes.paper,result.formValues[4],0)
            item.nameTag = result.formValues[0]
            var lores = ["passpaper" , "password:"+to_md5(result.formValues[1]) , "owner:" + result.formValues[2]]
            if(result.formValues[3] === 1){
                var index = get_team_by_player(player,0)
                if(index !== ""){
                    lores.push("team:" + teams[index].id)
                }
            }
            if(result.formValues[3] === 2){
                var index = get_team_by_player(player,1)
                if(index !== ""){
                    lores.push("team:" + teams[index].id)
                }
            }
            
            item.setLore(lores)
            //world.say(String(item.getLore()))
            player.dimension.spawnItem(item,new BlockLocation(Math.round(player.location.x), Math.round(player.location.y), Math.round(player.location.z)))
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"已生成Key"}]}`)
        })
}

function deleteMemberBar(player,index){
    var players = teams[index].member
    var ui = new ModalFormData()
        .title("删除成员")
        .dropdown("选择玩家(消耗50贡献)", players ,0)
        
        ui.show(player).then(result => {
            add_score(player , -50 , true)
            if(teams[index].member[result.formValues[0]] !== teams[index].owner){
                teams[index].member.splice(result.formValues[0],1)
                save_team(index)
            }
            myTeamBar(player)
        })
}

function turnTeamBar(player,index){
    var players = world.getAllPlayers()
    var real_players = []
    var names = []
    for(var cf=0; cf < players.length; cf++){
        if(teams[index].member.indexOf(players[cf].name) === -1){
        names.push(players[cf].name)
        real_players.push(players[cf])
        }
    }
    var ui = new ModalFormData()
        .title("队伍转让")
        .dropdown("选择玩家(消耗100贡献)", names ,0)
        
        ui.show(player).then(result => {
            add_score(player , -100 , true)
            if(teams[index].member[result.formValues[0]] !== teams[index].owner){
                teams[index].owner = names[result.formValues[0]]
                player.removeTag(get_tag(player,"myTeam,"))
                real_player.addTag("myTeam," + teams[index].id)
                save_team(index)
            }
            myTeamBar(player)
        })
}

function addMemberBar(player,index){
    var players = world.getAllPlayers()
    var real_players = []
    var names = []
    for(var cf=0; cf < players.length; cf++){
        if(teams[index].member.indexOf(players[cf].name) === -1){
        names.push(players[cf].name)
        real_players.push(players[cf])
        }
    }
    var ui = new ModalFormData()
        .title("添加成员")
        .dropdown("选择玩家(消耗50贡献)", names ,0)
        
        ui.show(player).then(result => {
            addTeamBar(real_players[result.formValues[0]],player,index)
        })
}

function replyBar(player,self,last_text){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name)
    }
    var ui = new ModalFormData()
        .title("私聊回复")
        .textField(last_text + "\n\n回复消息","此处输入消息(话费：5贡献)","")
        .toggle("要求对方立刻回复",true)
        
        ui.show(player).then(result => {
            add_score(self , -5)
            var text ="[§e私聊§r]§b" + self.name + "§r > §b你§r >>" +String(result.formValues[0])
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text +`"}]}`)
            if(result.formValues[1] === true){
                text ="[§e私聊§r]§b" + self.name + "§r >> " +String(result.formValues[0])
                replyBar(self, player , last_text + "\n" + text)
            }
            text ="[§e私聊§r]§b你§r > §b" + player.name +"§r >>" +String(result.formValues[0])
            self.runCommandAsync(`tellraw @s {"rawtext":[{"text":"` + text +`"}]}`)
        })
}

function WaittalkBar(player){
    var id = system.runSchedule(function(){
        talkBar(player)
        system.clearRunSchedule(id)
    },15)
}


function WaitposBar(player){
    var id = system.runSchedule(function(){
        posBar(player)
        system.clearRunSchedule(id)
    },15)
}



function serverBar(player){
    var serverInfo = "服务器运行时间：" + String(system.currentTick/20) + "s\n服主：EarthDLL\n服主QQ：2562577144\n服务器到期时间：2023.3.12"
    var selfInfo = "\n玩家名字：" + player.name + "\n是否拥有管理：" + String(player.isOp()) 
   if(is_op(player) === true){
   selfInfo += "\nTags：" + String(player.getTags())
   }
    var ui = new ActionFormData()
        .title("服务器信息")
        .body(serverInfo + selfInfo)
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        .button("意见反馈" , ui_path + "book_edit_default.png")
        .button("帮助", ui_path + "how_to_play_button_default.png")
        .button("查看日志记录" , ui_path + "feedIcon.png")
        ui.show(player).then(result => {
            if(result.selection === 1){
                ideaBar(player)
            }
            if(result.selection === 3){
                historyCheckBar(player,false)
            }
            if(result.selection === 0){
                cdBar(player)
            }
            if(result.selection === 2){
                helpBar(player)
            }
            
        })
}

function helpBar(player){
    var text = "问：如何获取贡献？答：挖掘方块，死亡，聊天等参与服务器的行为都可以获取贡献,注：队伍聊天要消耗贡献,,问：贡献不足会有什么影响？,答：菜单功能会受到限制，但不影响正常游戏"
    var ui = new ActionFormData()
        .title("帮助界面")
        .body(text.replaceAll(",","\n"))
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
        })
}

function emojiBar(player){
    var text = "/笑脸  /xl,,/苦脸  /kl,,/死  /si,,/白眼  /by,,/开心  /kx,,/流口水  /lks,,/无语  /wy,,/搞怪  /gg,,/猥琐  /ws,,/哭  /ku,,/冷/leng,,/生气  /sq,,/帅  /shuai,,/害羞  /hx,,/魔鬼  /mg,,/所以呢  /syn,,/笑哭  /xk,,/口罩  /kz,,/亲  /qin,,聊天框输入"
    var ui = new ActionFormData()
        .title("emojis")
        .body(text.replaceAll(",","\n"))
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
        })
}


function myTeamBar(player){
    var text = ""
    var index = get_team_by_player(player,0)
    if(index === ""){
        text = "您还没有队伍"
    }
    else{
         text += "队伍ID：" + teams[index].id
         text += "\n队名：" + teams[index].name
         text += "\n队主：" + teams[index].owner + "\n队员："
         for(var cf=0;cf<teams[index].member.length;cf++){
             text += teams[index].member[cf] + "，"
         }
    }
    var ui = new ActionFormData()
        .title("我的队伍")
        .body(text)
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        if(index === ""){
            ui = ui.button("创建我的队伍")
        }
        else{
            ui = ui.button("邀请新成员" , ui_path + "anvil-plus.png")
            .button("删除成员" , ui_path + "book_trash_default.png")
            .button("转让队伍")
            .button("解散队伍")
        }
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
            else{
                if(index === ""){
                    if(result.selection === 1){
                        createTeamBar(player)
                    }
                }
                else{
                    switch(result.selection){
                        case 1:
                            addMemberBar(player,index)
                            break;
                        case 2:
                            deleteMemberBar(player,index)
                            break;
                        case 3:
                            giveTeamBar(player,index)
                            break;
                        case 4:
                            deleteTeamBar(player,index)
                            break;
                    }
                }
            }
        })
}

function myAddTeamBar(player){
    var text = ""
    var index = get_team_by_player(player,1)
    if(index === ""){
        text = "您还没有加入队伍"
    }
    else{
         text += "队伍ID：" + teams[index].id
         text += "\n队名：" + teams[index].name
         text += "\n队主：" + teams[index].owner + "\n队员："
         for(var cf=0;cf<teams[index].member.length;cf++){
             text += teams[index].member[cf] + "，"
         }
    }
    var ui = new ActionFormData()
        .title("我加入的队伍")
        .body(text)
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        if(index !== ""){
            ui = ui.button("退出队伍", ui_path + "book_trash_default.png")
        }
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
            else{
                switch(result.selection){
                    case 1:
                        if(player.name !== teams[index].owner){
                            teams[index].member.splice(teams[index].member.indexOf(player.name),1)
                            save_team(index)
                        }
                        break;
                }
                }
        })
}

function createTeamBar(player){
    var ui = new ModalFormData()
        .title("创建队伍")
        .textField("队伍名称(创建队伍花费500贡献)","我的队伍","")
        
        ui.show(player).then(result => {
            var team = {
                name : result.formValues[0].replaceAll("，",""),
                id : String(team_id),
                owner : player.name,
                member : [player.name],
                tag : "",
                pos1 : [],
                pos2 : [],
                pos3 : [],
            }
            add_team(team,player)
            meBar(player)
        })
}


function posBar(player){
    var ui = new ActionFormData()
        .title("坐标点界面")
        .body("选择返回坐标\n你的贡献值：" + String(get_score(player)) + "\n返回死亡地点花费200贡献\n传送地点花费100贡献") 
        .button("设置坐标点" , ui_path + "settings_glyph_color_2x.png")
        .button("传送到玩家" , ui_path + "icon_multiplayer.png")
        .button("上一次死亡地点" , ui_path + "wither_effect.png")
        for(var cf=0;cf<10;cf++){
        var text = get_tag(player,"pos"+String(cf)+",")
        if(text === ""){
            ui = ui.button("坐标点"+String(cf+1)+"(未设置)")
        }
        else{
            var name = ""
            if(typeof(text.split(",")[5]) === "string"){
                name = world.getDimension(text.split(",")[5]).name
            }
            else{
                name = "未知"
            }
            ui = ui.button("[" + name + "]" + text.split(",")[1])
            
        }
        }
        if(get_tag(player,"sharePos,") === ""){
            ui = ui.button("共享点" , ui_path + "share_google.png")
        }
        else{
            var tag = get_tag(player,"sharePos,").split(",")
            ui = ui.button("共享点 - [" + world.getDimension(tag[5]).name + "]" + tag[1] , ui_path + "share_google.png")
        }
        ui = ui.button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        .button("世界共享点" , ui_path + "mashup_world.png")
        .button("队伍共享点" , ui_path + "dressing_room_skins.png")
        .button("出生点",ui_path + "heart_new.png")
        .button("随机传送")
        ui.show(player).then(result => {
            if(result.selection >= 3 && result.selection <= 12){
                var goal_text = get_tag(player,"pos" + String(result.selection-3) + ",")
                if(goal_text !== ""){
                    add_score(player,-100,true)
                    goal_text = goal_text.split(",")
                    player.runCommandAsync("tp @s " + goal_text[2] + " " + goal_text[3] + " " + goal_text[4])
                }
                else{
                    posBar(player)
                }
            }
            if(result.selection === 1){
                tpPlayerBar(player)
            }
            if(result.selection === 0){
                setPosBar(player)
            }
            
            if(result.selection === 2){
                if(typeof(player.diePos) == "object"){
                    add_score(player,-200,true)
                    player.teleport({x:player.diePos[1],y:player.diePos[2],z:player.diePos[3]},world.getDimension(player.diePos[0]),player.rotation.x,player.rotation.y)
                }
            }
            if(result.selection === 13){
                var thing = get_tag(player,"sharePos,")
                if(thing === ""){
                    posBar(player)
                }
                else{
                    thing = thing.split(",")
                    player.runCommandAsync("tp @s "+ thing[2] + " " + thing[3] + " " + thing[4])
                }
            }
            if(result.selection === 14){
                cdBar(player)
            }
            if(result.selection == 15){
                worldPosBar(player)
            }
            if(result.selection == 16){
                teamPosBar(player)
            }
            if(result.selection == 17){
                player.teleport(spawn_point,overworld,player.rotation.x,player.rotation.y)
            }
            if(result.selection == 18){
                add_score(player,20,true)
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e正在执行传送"}]}`)
                player.runCommandAsync("spreadplayers ~ ~ 10000 50000 @s")
            }
        })
}

function teamPosBar(player){
    var pos = []
    var ui = new ActionFormData()
        .title("队伍共享点")
        .body("当前队伍共享点")
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
    var index = get_team_by_player(player,0)
    if(index !== ""){
        if(teams[index].pos1.length === 5){
            pos.push(teams[index].pos1)
            ui = ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos1[1]).name + "]" + teams[index].pos1[0])
        }
        if(teams[index].pos2.length === 5){
            pos.push(teams[index].pos2)
            ui = ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos2[1]).name + "]" + teams[index].pos2[0])
        }
        if(teams[index].pos3.length === 5){
            pos.push(teams[index].pos3)
            ui = ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos3[1]).name + "]" + teams[index].pos3[0])
        }
    }
    var index = get_team_by_player(player,1)
    if(index !== ""){
        if(teams[index].pos1.length === 5){
            pos.push(teams[index].pos1)
            ui = ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos1[1]).name + "]" + teams[index].pos1[0])
        }
        if(teams[index].pos2.length === 5){
            pos.push(teams[index].pos2)
            ui = ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos2[1]).name + "]" + teams[index].pos2[0])
        }
        if(teams[index].pos3.length === 5){
            pos.push(teams[index].pos3)
            ui = ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos3[1]).name + "]" + teams[index].pos3[0])
        }
    }
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
            else{
                var thing = pos[result.selection - 1]
                player.runCommandAsync("tp @s "+ thing[2] + " " + thing[3] + " " + thing[4])
            }
        })
}

function worldPosBar(player){
    var ui = new ActionFormData()
        .title("世界共享点")
        .body("当前世界共享点(需要玩家在线)")
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
    var shares = get_shares()
    for(var cf=0; cf<shares.length; cf++){
        var things = shares[cf].split(",")
        ui = ui.button(things[0] + " - [" + world.getDimension(things[6]).name + "]" + things[2])
    }
    
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
            else{
                var thing = shares[result.selection - 1].split(",")
                player.runCommandAsync("tp @s "+ thing[3] + " " + thing[4] + " " + thing[5])
            }
        })
}

function opBar(player){
    var ui = new ActionFormData()
        .title("管理员界面")
        .body("选择设置")
        .button("查看意见反馈", ui_path + "comment.png")
        .button("查看警告日志" , ui_path + "WarningGlyph.png")
        .button("贡献值设置" , ui_path + "settings_glyph_color_2x.png")
        .button("修改公告" , ui_path + "book_edit_default.png")
        .button("删除约定" , ui_path + "redX1.png")
        .button("查看玩家日志" , ui_path + "feedIcon.png")
        .button("封禁玩家" , "textures/blocks/barrier.png")
        .button("查看所有队伍" , ui_path + "dressing_room_skins.png")
        .button("工作模式" , ui_path + "anvil_icon.png")
        .button("玩家物品栏" , ui_path + "selected_hotbar_slot.png")
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
        if(is_op(player) === true){
        ui.show(player).then(result => {
            if(result.selection === 0){
                ideaCheckBar(player)
            }
            if(result.selection === 1){
                logCheckBar(player)
            }
            if(result.selection === 4){
                deleteTimeBar(player)
            }
            if(result.selection === 5){
                historyCheckBar(player,true)
            }
            if(result.selection === 7){
                teamCheckBar(player)
            }
            if(result.selection === 8){
                opWorkBar(player)
            }
            if(result.selection === 10){
                cdBar(player)
            }
            if(result.selection === 9){
                inCheckBar(player)
            }
            if(result.selection === 6){
                chooseBanBar(player)
            }
            if(result.selection === 3){
                changeTotalBar(player,"")
            }
            if(result.selection === 2){
                setScoreBar(player)
            }
        })
        }
}

function setScoreBar(player){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name + " 贡献值：" + String(get_score(players[cf])))
    }
    var ui = new ModalFormData()
        .title("贡献值设置界面")
        .dropdown("选择玩家", names ,0)
        .dropdown("操作", ["添加贡献值","设置贡献值"] ,0)
        .textField("值","键入值","")
        
        ui.show(player).then(result => {
            switch(result.formValues[1]){
                case 0:
                    add_score(players[result.formValues[0]],parseInt(result.formValues[2]),true)
                    break;
                case 1:
                    set_score(players[result.formValues[0]],parseInt(result.formValues[2]),true)
                    break;
            
            }
            cdBar(player)
        })
}


function ideaCheckBar(player){
    var ui = new ActionFormData()
        .title("意见反馈收集界面")
        .body(String(ideas).replaceAll(",","\n"))
        .button("清空")
        .button("返回上一级" , ui_path + "arrow_dark_left_stretch.png")
        
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                ideas = []
            }
            if(result.selection === 1){
                opBar(player)
            }
        })
}

function historyCheckBar(player,can_clear = false,page = 0){
    var ui = new ActionFormData()
        .title("玩家历史记录界面 - 第"+String(page+1) + "页")
        .body(String(history.slice(page*100 , page*100 + 99)).replaceAll(",","\n"))
        
        .button("返回上一级" , ui_path + "arrow_dark_left_stretch.png")
        .button("查找" ,ui_path + "magnifyingGlass.png")
        .button("上一页")
        .button("下一页")
        if(can_clear === true){
        ui = ui.button("清空")
        }
        ui.show(player).then(result => {
            if(result.selection === 0){
                cdBar(player)
            }
            if(result.selection === 1){
                historyFindBar(player)
            }
            if(result.selection === 2 && page > 0){
                historyCheckBar(player,can_clear,page - 1)
            }
            if(result.selection === 3){
                historyCheckBar(player,can_clear,page + 1)
            }
            if(result.selection === 4){
                history = []
            }
        })
}

function teamCheckBar(player){
    var text = ""
    for(var cf=0;cf<teams.length;cf++){
        text += "ID：" + teams[cf].id
        text += "\n队伍名称：" + teams[cf].name
        text += "\n队主：" + teams[cf].owner
        for(var cf1=0;cf1<teams[cf].member.length;cf1++){
            text += "\n队员：" + teams[cf].member[cf1]
        }
        text += "\n"
    }
    var ui = new ActionFormData()
        .title("玩家队伍信息")
        .body(text)
        
        .button("返回上一级" , ui_path + "arrow_dark_left_stretch.png")
        ui.show(player).then(result => {
            if(result.selection === 0){
                opBar(player)
            }
        })
}

function meBar(player){
    var text = "玩家名称：" + player.name + "\n我的贡献：" + String(get_score(player))
    var ui = new ActionFormData()
        .title("我的")
        .body(text)
        .button("我的队伍" , ui_path + "dressing_room_customization.png")
        .button("我所在的队伍" , ui_path + "dressing_room_skins.png")
        .button("获取箱子钥匙" , ui_path + "accessibility_glyph_color.png")
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
        
        ui.show(player).then(result => {
            if(result.selection === 3){
                cdBar(player)
            }
            if(result.selection === 2){
                getKeyBar(player)
            }
            if(result.selection === 0){
                myTeamBar(player)
            }
            if(result.selection === 1){
                myAddTeamBar(player)
            }
        })
}

function opWorkBar(player){
    var ui = new ActionFormData()
        .title("管理员工作模式")
        .body("打开工作模式后，可无视任何限制(例如密码箱)。")
        if(player.hasTag("op-work") === false){
        ui = ui.button("打开工作模式")
        }
        else{
        ui = ui.button("关闭工作模式")
        }
        ui = ui.button("返回上一级")
        if(player.hasTag("op-work") === true){
    ui = ui.button("切换观察者模式")
        .button("切换生存模式")
        .button("传送到玩家")
        .button("获取工作效果(隐身+夜视)")
        if(player.hasTag("script-check") === true){
            ui = ui.button("关闭脚本监视")
        }
        else{
            ui = ui.button("打开脚本监视")
        }
        }
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                if(player.hasTag("op-work")){
                    player.removeTag("op-work")
                    player.removeTag("script-check")
                    player.runCommandAsync(`gamemode 0 @s`)
                    player.runCommandAsync(`effect @s clear`)
                }
                else{
                    player.addTag("op-work")
                }
                opWorkBar(player)
            }
            if(result.selection === 2){
                opWorkBar(player)
                player.runCommandAsync(`gamemode spectator @s`)
            }
            if(result.selection === 1){
                opBar(player)
            }
            if(result.selection === 3){
                opWorkBar(player)
                player.runCommandAsync(`gamemode 0 @s`)
            }
            if(result.selection === 4){
                opTpBar(player)
            }
            if(result.selection === 5){
                opWorkBar(player)
                player.runCommandAsync(`effect @s invisibility 1000 1 true`)
                player.runCommandAsync(`effect @s night_vision 1000 1 true`)
            }
             if(result.selection === 6){
                if(player.hasTag("script-check")){
                    player.removeTag("script-check")
                }
                else{
                    player.addTag("script-check")
                }
                opWorkBar(player)
            }
        })
}

function setPosBar(player){
    var ui = new ActionFormData()
        .title("坐标点设置")
        .body("选择操作\n删除坐标点手续费：20贡献")
        .button("设置坐标点信息", ui_path + "settings_glyph_color_2x.png")
        .button("删除坐标点" , ui_path + "redX1.png")
        .button("返回上一级" , ui_path + "arrow_dark_left_stretch.png")
        
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                choosePosBar(player,0)
            }
            if(result.selection === 1){
                choosePosBar(player,1)
            }
            if(result.selection === 2){
                posBar(player)
            }
        })
}


function choosePosBar(player,mode){
    var ui = new ActionFormData()
        .title("坐标点设置")
        .body("选择要操作的坐标点")
    for(var cf=0;cf<10;cf++){
        var text = get_tag(player,"pos"+String(cf)+",")
        if(text === ""){
            ui = ui.button("坐标点"+String(cf+1)+"(未设置)")
        }
        else{
            var name = ""
            if(typeof(text.split(",")[5]) === "string"){
                name = world.getDimension(text.split(",")[5]).name
            }
            else{
                name = "未知"
            }
            ui = ui.button("[" + name + "]" + text.split(",")[1])
        }
    }
    var share = get_tag(player,"sharePos,")
    if(share === ""){
        ui = ui.button("共享点(未设置)")
    }
    else{
        ui = ui.button("共享点 - " + share.split(",")[1])
    }
        
    ui = ui.button("队伍共享点")
    ui = ui.button("取消" , ui_path + "redX1.png")
        
        
        ui.show(player).then(result => {
            if(result.selection > 9){
                if(result.selection === 12){
                    posBar(player)
                }
                if(result.selection === 11){
                    chooseTeamPosBar(player)
                }
                if(result.selection === 10){
                    if(mode === 1){
                        var goal_text = get_tag(player,"sharePos,")
                        if(goal_text !== ""){
                            player.removeTag(goal_text)
                            add_score(player,-20 ,true)
                        }
                        posBar(player)
                    }
                else{
                    changePosBar(player,result.selection)
                }
                }
            }
            else{
                if(mode === 1){
                    
                    var goal_text = get_tag(player,"pos"+String(result.selection)+",")
                    if(goal_text !== ""){
                    player.removeTag(goal_text)
                    add_score(player,-20,true)
                    }
                    posBar(player)
                }
                else{
                    changePosBar(player,result.selection)
                }
            }
        })
}

function chooseTeamPosBar(player){
    var team_index = []
    var pos_number = []
    var ui = new ActionFormData()
        .title("坐标点设置")
        .body("选择要操作的坐标点")
        .button("返回上一级")
        
    var index = get_team_by_player(player,0)
    if(index !== ""){
        team_index.push(index)
        if(teams[index].pos1.length === 5){
            ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos1[1]).name + "]" + teams[index].pos1[0])
        }
        else{
            ui.button(teams[index].name + " - 未设置")
        }
        if(teams[index].pos2.length === 5){
            ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos2[1]).name + "]" + teams[index].pos2[0])
        }
        else{
            ui.button(teams[index].name + " - 未设置")
        }
        if(teams[index].pos3.length === 5){
            ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos3[1]).name + "]" + teams[index].pos3[0])
        }
        else{
            ui.button(teams[index].name + " - 未设置")
        }
    }
    
    index = get_team_by_player(player,1)
    if(index !== ""){
        team_index.push(index)
        if(teams[index].pos1.length === 5){
            ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos1[1]).name + "]" + teams[index].pos1[0])
        }
        else{
            ui.button(teams[index].name + " - 未设置")
        }
        if(teams[index].pos2.length === 5){
            ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos2[1]).name + "]" + teams[index].pos2[0])
        }
        else{
            ui.button(teams[index].name + " - 未设置")
        }
        if(teams[index].pos3.length === 5){
            ui.button(teams[index].name + " - [" + world.getDimension(teams[index].pos3[1]).name + "]" + teams[index].pos3[0])
        }
        else{
            ui.button(teams[index].name + " - 未设置")
        }
    }
        
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                posBar(player)
            }
            else{
                var goal = result.selection -1
                var index = ""
                if(goal < 3){
                    index = team_index[0]
                }
                else{
                    index = team_index[1]
                }
                setTeamPosBar(player,index,goal%3)
            
            }
        })
}

function changePosBar(player,index){
    var name = get_tag(player,"pos" + String(index) + ",")
    if (name !== ""){
        name = name.split(",")[1]
    }
    
        var real_pos = [""]
        var poses = ["当前位置"]
        for(var cf=0; cf<10;cf++){
            var text = get_tag(player,"pos"+String(cf)+",")
            if(text !== ""){
                var d_name = ""
                if(typeof(text.split(",")[5]) === "string"){
                    d_name = world.getDimension(text.split(",")[5]).name
                }
                else{
                d_name = "未知"
                }
            poses.push("[" + d_name + "]" + text.split(",")[1])
            real_pos.push(text)
        }
        }
        
        var ui = new ModalFormData()
        .title("设置坐标点")
        .textField("坐标名称(设置手续费：20贡献)","坐标点"+String(index+1),name)
        .dropdown("选择坐标位置", poses ,0)
        
        
        ui.show(player).then(result => {
            if(index !== 10){
            var set = get_tag(player,"pos" + String(index) + ",")
            if(set !== ""){
                player.removeTag(set)
            }
            add_score(player,-20,true)
            if(result.formValues[1] === 0){
                player.addTag("pos" + String(index) + "," + result.formValues[0].replaceAll(",","") + "," + String(player.location.x) + "," + String(player.location.y) + "," + String(player.location.z) + "," + player.dimension.id)
            }
            else{
                var thing = real_pos[result.formValues[1]].split(",")
                player.addTag("pos" + String(index) + "," + result.formValues[0].replaceAll(",","") + "," + thing[2] + "," + thing[3]+ "," + thing[4] + "," + player.dimension.id)
            }
            posBar(player)
            }
            else{
                var set = get_tag(player,"sharePos," + String(index) + ",")
                if(set !== ""){
                    player.removeTag(set)
                }
                add_score(player,-20,true)
                if(result.formValues[1] === 0){
                    player.addTag("sharePos," + result.formValues[0].replaceAll(",","") + "," + String(player.location.x) + "," + String(player.location.y) + "," + String(player.location.z) + "," + player.dimension.id)
                }
                else{
                    var thing = real_pos[result.formValues[1]].split(",")
                    player.addTag("sharePos," + result.formValues[0].replaceAll(",","") + "," + thing[2] + "," + thing[3] + "," + thing[4] + "," + player.dimension.id)
                }
                
                posBar(player)
                
            }
        })
}

function setTeamPosBar(player,index,pos){
    var name = ""
    switch(pos){
        case 0:
            if(teams[index].pos1.length === 5){
                name = teams[index].pos1[0];
            }
            break;
        case 1:
            if(teams[index].pos2.length === 5){
                name = teams[index].pos2[0];
            }
            break;
        case 2:
            if(teams[index].pos3.length === 5){
                name = teams[index].pos3[0];
            }
            break;
    }
        
        var real_pos = [""]
        var poses = ["当前位置"]
        for(var cf=0; cf<10;cf++){
            var text = get_tag(player,"pos"+String(cf)+",")
            if(text !== ""){
                var d_name = ""
                if(typeof(text.split(",")[5]) === "string"){
                    d_name = world.getDimension(text.split(",")[5]).name
                }
                else{
                d_name = "未知"
                }
            poses.push("[" + d_name + "]" + text.split(",")[1])
            real_pos.push(text)
        }
        }
        
        var ui = new ModalFormData()
        .title("设置坐标点")
        .textField("坐标名称(设置手续费：20贡献)","队伍坐标点",name)
        .dropdown("选择坐标位置", poses ,0)
        
        
        ui.show(player).then(result => {
            add_score(player,-20,true)
            var pos_text = [  ]
            if(result.formValues[1] === 0){
                pos_text = [result.formValues[0].replaceAll(",","") , player.dimension.id , String(player.location.x) , String(player.location.y) , String(player.location.z)]
            }
            else{
                var thing = real_pos[result.formValues[1]].split(",")
                pos_text = [result.formValues[0].replaceAll(",","") , thing[5] , thing[2] , thing[3] , thing[4]]
            }
            switch(pos){
                case 0:
                    teams[index].pos1 = pos_text
                    break;
                case 1:
                    teams[index].pos2 = pos_text
                    break;
                case 2:
                    teams[index].pos3 = pos_text
                    break;
            }
            save_team(index)
            posBar(player)
        })
}


function logCheckBar(player){
    var ui = new ActionFormData()
        .title("日志界面")
        .body(String(logs).replaceAll(",","\n"))
        .button("清空")
        .button("返回上一级" , ui_path + "arrow_dark_left_stretch.png")
        
        
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                logs = []
            }
            if(result.selection === 1){
                opBar(player)
            }
        })
}

function historyResultBar(player,text){
    var results = []
    for(var cf=0; cf<history.length; cf++){
    if(history[cf].indexOf(text) !== -1){
            results.push(history[cf])
        }
    }
    var ui = new ActionFormData()
        .title("玩家日志结果")
        .body(String(results).replaceAll(",","\n"))
        .button("返回上一级" , ui_path + "arrow_dark_left_stretch.png")
        
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                logCheckBar(player)
            }
        })
}

function tradeBar(player){
    var ui = new ActionFormData()
        .title("交易界面")
        .body("和玩家们一起交易吧~")
        .button("添加交易", ui_path + "book_addtextpage_default.png")
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        for(var cf=0;cf<trades.length;cf++){
            var things = trades[cf].split("，")
            var mode = ""
            switch(things[1]){
                case "0":
                    mode = "卖出"
                    ui = ui.button(mode + " - " + things[3] + "*" + things[4])
                    break;
                case "1":
                    mode = "交换"
                    ui = ui.button(mode + " - " + things[3] + "*" + things[5] + "=" + things[4] + "*"+things[6])
                    break;
                case "2":
                    mode = "回收"
                    ui = ui.button(mode + " - " + things[3] + "*" + things[4])
                    break;
            }
        }
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                addTradeBar(player)
            }
            if(result.selection === 1){
                cdBar(player)
            }
            if(result.selection > 1){
                tradeInfoBar(player,trades[result.selection-2])
            }
        })
}

function addTradeBar(player){
    var ui = new ActionFormData()
        .title("添加交易界面")
        .body("添加你的交易吧~")
        .button("取消" , ui_path + "arrow_dark_left_stretch.png")
        .button("卖出")
        .button("交换")
        .button("回收")
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                tradeBar(player)
            }
            if(result.selection > 0){
                setTradeBar(player,result.selection-1)
            }
        })
}

function tradeInfoBar(player,text){
    var things = text.split("，")
    var show = ""
        switch(things[1]){
            case "0":
                show = "卖出\n"
                show += "发起人：" + things[2] + "\n\n"
                show += "卖出物品：" + things[3] + "\n卖出数量：" + things[4] + "\n价格/每个物品：" + things[5] +"\n交易地点：" + things[6] 
                break;
            case "1":
                show = "交换\n"
                show += "发起人：" + things[2] + "\n\n"
                show += "卖家：\n卖出物品：" + things[3] + "\n卖出数量：" + things[5] + "\n\n买家\n交换物品：" + things[4] +"\n交换数量：" + things[6] +"\n\n交换地点：" + things[7]
                break;
            case "2":
                show = "回收\n"
                show += "发起人：" + things[2] + "\n\n"
                show += "回收物品：" + things[3] + "\n回收数量：" + things[4] + "\n价格/每个物品：" + things[5] +"\n交易地点：" + things[6] 
                break;
        }
    var ui = new ActionFormData()
        .title("交易详情")
        .body(show)
        .button("返回上一页" , ui_path + "arrow_dark_left_stretch.png")
        if(player.name === things[2]){
            ui = ui.button("删除交易信息")
        }
        ui.show(player).then(result => {
            if(result.selection === 0){
                tradeBar(player)
            }
            if(result.selection === 1){
                delete_trades(text)
                tradeBar(player)
            }
        })
}


function setTradeBar(player,mode){
    var ui = new ModalFormData()
        .title("设置交易内容")
        if(mode === 0){
        ui = ui.textField("卖出物品","在此输入","绿帽子")
        .textField("卖出数量","在此输入","64")
        .textField("价格/每个物品","在此输入","5绿宝石")
        .textField("交易地点","在此输入","出生点")
        }
        if(mode === 1){
        ui = ui.textField("卖方物品","在此输入","绿帽子")
        .textField("买方物品","在此输入","红帽子")
        .textField("卖方数量","在此输入","1")
        .textField("买方数量","在此输入","2")
        .textField("交易地点","在此输入","出生点")
        }
        if(mode === 2){
        ui = ui.textField("回收物品","在此输入","绿帽子")
        .textField("回收数量","在此输入","114514")
        .textField("回收价格","在此输入","64绿宝石/组")
        .textField("交易地点","在此输入","出生点")
        }
        ui.show(player).then(result => {
            var text = "trade，"
            text += String(mode) + "，" + player.name + "，"
            switch(mode){
                case 0:
                case 2:
                    text += result.formValues[0] + "，" +result.formValues[1] + "，" +result.formValues[2] + "，" +result.formValues[3]
                    break;
                case 1:
                    text += result.formValues[0] + "，" +result.formValues[1] + "，" +result.formValues[2] + "，" +result.formValues[3] +"，" + result.formValues[4]
                    break;
            }
            save_trades(text)
            tradeBar(player)
        })
}



function playerBar(player){
    var talk_mode = get_tag(player,"talk_mode,").slice(10)
    var text = "公共聊天"
    if(talk_mode == "1"){
        text = "队伍聊天(我的队伍)"
    }
    if(talk_mode == "2"){
        text = "队伍聊天(加入的队伍)"
    }
    
    var ui = new ActionFormData()
        .title("玩家互动界面")
        .body("来和玩家们一起互动吧")
        .button("私聊玩家", ui_path + "mute_off.png")
        .button("聊天设置(当前：" + text + ")" , ui_path + "settings_glyph_color_2x.png")
        .button("交易" , ui_path + "icon_book_writable.png")
        .button("emoji大全" , ui_path + "regeneration_effect.png")
        .button("返回主菜单" , ui_path + "arrow_dark_left_stretch.png")
        
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                talkBar(player)
            }
            if(result.selection === 4){
                cdBar(player)
            }
            if(result.selection === 3){
                emojiBar(player)
            }
            if(result.selection === 1){
                player.removeTag("talk_mode," + String(talk_mode))
                if(talk_mode === ""){
                    player.addTag("talk_mode,1")
                }
                switch(talk_mode){
                case "0" :
                    player.addTag("talk_mode,1")
                    break;
                case "1":
                    player.addTag("talk_mode,2")
                    break;
                case "2":
                    player.addTag("talk_mode,0")
                    break;
                }
                playerBar(player)
            }
            if(result.selection === 2){
                tradeBar(player)
            }
        })
}

function ideaBar(player){
    var ui = new ModalFormData()
        .title("服务器意见反馈")
        .textField("意见反馈","在此输入","")
        
        ui.show(player).then(result => {
            add_score(player,20)
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e意见反馈已收到，奖励20贡献"}]}`)
            ideas.push(player.name + " >> " + result.formValues[0])
            cdBar(player)
        })
}

function chestKeyBar(player,password,location,owner){
    var ui = new ModalFormData()
        .title("密码验证")
        .textField("箱子启用了密码验证\n箱主："+owner,"在此输入密码","")
        
        ui.show(player).then(result => {
            if(to_md5(result.formValues[0]) === password){
                player.last_chest = location
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e密码正确"}]}`)
            }
            else{
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e密码错误"}]}`)
                add_history(player.name + get_pos(player) + "(" + player.dimension.name + ")" + "输入错误密码箱密码")
            }
        })
}

function chooseBanBar(player){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name)
    }
    
    var ui = new ModalFormData()
        .title("封禁玩家")
        .dropdown("选择玩家", names ,0)
        
        ui.show(player).then(result => {
        kick(players[result.formValues[0]],"管理员踢出")
        })
}


function historyFindBar(player){
    var ui = new ModalFormData()
        .title("查找有关日志")
        .textField("查找内容","在此输入内容","")
        
        ui.show(player).then(result => {
            
            historyResultBar(player, result.formValues[0])
        })
}

function tpPlayerBar(player){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name)
    }
    var ui = new ModalFormData()
        .title("传送至玩家")
        .dropdown("选择玩家", names ,0)
        .textField("传送备注","此处输入消息(消耗100贡献)","")
        
        ui.show(player).then(result => {
            tpaBar(players[result.formValues[0]],player,result.formValues[1])
        })
}

function opTpBar(player){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name)
    }
    var ui = new ModalFormData()
        .title("传送至玩家(管理模式)")
        .dropdown("选择玩家", names ,0)
        
        ui.show(player).then(result => {
            var loc = players[result.formValues[0]].location
            player.runCommandAsync(`tp @s ` + String(loc.x) + " " + String(loc.y) + " " + String(loc.z))
        })
}

function inCheckBar(player){
    var players = world.getAllPlayers()
    var names = []
    for(var cf=0; cf < players.length; cf++){
        names.push(players[cf].name)
    }
    var ui = new ModalFormData()
        .title("传送至玩家(管理模式)")
        .dropdown("选择玩家", names ,0)
        
        ui.show(player).then(result => {
            inLookBar(player,players[result.formValues[0]])
        })
}

function sayBoardBar(player){
    var ui = new ModalFormData()
        .title("留言板")
        .textField("留言板","在此写下留言","")
        
        ui.show(player).then(result => {
            add_score(player,10 , true)
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e留言成功，获得10贡献"}]}`)
            boards.push(player.name + " >> " + result.formValues[0])
            cdBar(player)
        })
}

function tpaBar(target,player,tpText){
    var id = system.runSchedule(function(){
    target.runCommandAsync("damage @s 0 entity_attack")
    var ui = new MessageFormData()
        .title("TPA传送请求")
        .body("(打开该菜单会受到一个假伤害，请忽略)\n玩家" + player.name + "请求传送至您的位置\n对方备注：" + tpText + "\n请通过下方按钮决定")
        .button1("同意")
        .button2("拒绝")
        system.clearRunSchedule(id)
        ui.show(target).then(result => {
            switch(result.selection){
                case 1:
                    if(target.dimension.id === player.dimension.id){
                        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e正在执行传送"}]}`)
                        var tp_text = "tp @s "+ String(target.location.x) + " " + String(target.location.y) + " " + String(target.location.z)
                        player.runCommandAsync(tp_text)
                        add_score(player,-100,true)
                    }
                    else{
                        player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"维度不同，tpa失败"}]}`)
                        target.runCommandAsync(`tellraw @s {"rawtext":[{"text":"维度不同，tpa失败"}]}`)
                    }
                    break;
                case 0:
                    player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e对方拒绝了你的请求"}]}`)
                    break;
            }
        })
    },10)

}

function addTeamBar(target,self,index){
    var id = system.runSchedule(function(){
    target.runCommandAsync("damage @s 0 entity_attack")
    var ui = new MessageFormData()
        .title("队伍邀请请求")
        .body("(打开该菜单会受到一个假伤害，请忽略)\n玩家" + self.name + "邀请您加入TA的队伍\n请通过下方按钮决定")
        .button1("同意")
        .button2("拒绝")
        system.clearRunSchedule(id)
        ui.show(target).then(result => {
            switch(result.selection){
                case 1:
                if(get_team_by_player(target,1) === ""){
                    teams[index].member.push(target.name)
                    target.addTag("addTeam," + String(teams[index].id))
                    save_team(index)
                    self.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e对方已加入你的队伍"}]}`)
                    target.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e你已加入对方的队伍"}]}`)
                    
                    }
                    else{
                    self.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e你已加入其他队伍"}]}`)
                    target.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e对方已加入其他队伍"}]}`)
                    }
                    break;
                case 0:
                    self.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e对方拒绝了你的请求"}]}`)
                    break;
            }
        })
    },10)

}

function log(text,say = false){
    var thing = get_time() + text
    var server = thing.replace(/§./g,"")
    try{
    http.get("http://127.0.0.1:1024/log?text=" + encodeURI(server))
    }catch(any){}finally{}
    if(say === true){
    try{
    http.get("http://127.0.0.1:1024/send?text=" + encodeURI("检测到服务器出现危险行为，请管理员前往确认"))
    }catch(any){}finally{}
   }
    if(say == true){
    world.say("§4" + server)
    }
}

function show_board(player){
    var ui = new ActionFormData()
        .title("公告")
        .body(totals)
        .button("打开交易" , ui_path + "icon_book_writable.png")
        .button("打开主菜单" , ui_path + "icon_crafting.png")
        
        ui.show(player).then(result => {
            if(result.selection === 1){
                cdBar(player)
            }
            if(result.selection === 0){
                tradeBar(player)
            }
        })
}

function inLookBar(player,target){
    var items = target.getComponent("minecraft:inventory").container
    var text = "玩家名称：" + target.name + ",物品栏数量：" + items.size
    for(var cf=0;cf<items.size;cf++){
        var item = items.getItem(cf)
        if(typeof(item) === "object"){
            text += ",ID:" + item.typeId.replace("minecraft:","") + ";数量:" + String(item.amount) + ";名称:" + item.nameTag + ";数据值:" + String(item.data)
        }
    }
    var ui = new ActionFormData()
        .title("物品栏")
        .body(text.replaceAll(",","\n"))
        .button("推送到日志群")
        .button("返回主菜单")
        .button("违法行为")
        .button("捅了老窝")
        .button("绳之以法")
        
        ui.show(player).then(result => {
            if(result.selection === 0){
                add_history(text)
            }
            if(result.selection === 1){
                cdBar(player)
            }
            if(result.selection === 2){
                target.runCommandAsync("playsound server.wf @s")
            }
            if(result.selection === 3){
                target.runCommandAsync("playsound server.lw @s")
            }
            if(result.selection === 4){
                target.runCommandAsync("playsound server.szyf @s")
            }
        })
}

function changeTotalBar(player,texts){
    var text = texts
    if(text !== ""){
        text += "\n"
    }
    var ui = new ModalFormData()
        .title("公告修改")
        .textField(texts,"新一行内容","")
        .toggle("结束",false)
        ui.show(player).then(result => {
            text+= result.formValues[0]
            if(result.formValues[1] === false){
            changeTotalBar(player,text)
            }
            else{
                totals = text
                
                
            }
        })
}



function add_history(text){
    var say = get_time() + text
    var server = say.replace(/§./g,"")
    //world.say(say)
    try{
    http.get("http://127.0.0.1:1024/history?text=" + encodeURI(server))
    }catch(any){/*world.say(any.message)*/}finally{}
}

system.events.beforeWatchdogTerminate.subscribe(event =>{
    add_history("脚本运行异常，原因：" + event.terminateReason)
    event.cancel = true
})