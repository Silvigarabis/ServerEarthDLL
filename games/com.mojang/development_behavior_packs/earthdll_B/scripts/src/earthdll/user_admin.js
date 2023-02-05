function inCheckBar(player) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name);
    }
    var ui = new ModalFormData()
        .title("传送至玩家(管理模式)")
        .dropdown("选择玩家", names, 0);

    ui.show(player).then((result) => {
        inLookBar(player, players[result.formValues[0]]);
    });
}
function inLookBar(player, target) {
    var items = target.getComponent("minecraft:inventory").container;
    var text = "玩家名称：" + target.name + ",物品栏数量：" + items.size;
    for (var cf = 0; cf < items.size; cf++) {
        var item = items.getItem(cf);
        if (typeof item === "object") {
            text +=
                ",ID:" +
                item.typeId.replace("minecraft:", "") +
                ";数量:" +
                String(item.amount) +
                ";名称:" +
                item.nameTag +
                ";数据值:" +
                String(item.data);
        }
    }
    var ui = new ActionFormData()
        .title("物品栏")
        .body(text.replaceAll(",", "\n"))
        .button("推送到日志群")
        .button("返回主菜单")
        .button("违法行为")
        .button("捅了老窝")
        .button("绳之以法");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            add_history(text);
        }
        if (result.selection === 1) {
            cdBar(player);
        }
        if (result.selection === 2) {
            target.runCommandAsync("playsound server.wf @s");
        }
        if (result.selection === 3) {
            target.runCommandAsync("playsound server.lw @s");
        }
        if (result.selection === 4) {
            target.runCommandAsync("playsound server.szyf @s");
        }
    });
}

function opTpBar(player) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name);
    }
    var ui = new ModalFormData()
        .title("传送至玩家(管理模式)")
        .dropdown("选择玩家", names, 0);

    ui.show(player).then((result) => {
        var loc = players[result.formValues[0]].location;
        player.runCommandAsync(
            `tp @s ` + String(loc.x) + " " + String(loc.y) + " " + String(loc.z)
        );
    });
}


function kick(player, reason, again = false) {
    if (again === false) {
        ban_list.push(player.name);
    }
    if (PermissionUtils.is_admin(player) === false) {
        EntityBase.from(player).kick(reason);
        log("§e将玩家" + player.name + "踢出游戏，原因：" + String(reason), true);
    }
}

function ban_player(player){
    let playerName = player;
    if (EntityBase.isEntity(player) && EntityBase.entityIsPlayer(player))
        playerName = player.name;
    ban_list.push(playerName);
}

function pardon_player(playerName){
    ban_list = ban_list.filter(e => e !== playerName);;
}

