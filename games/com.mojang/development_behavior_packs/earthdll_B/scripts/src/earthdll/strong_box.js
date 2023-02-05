world.events.beforeExplosion.subscribe((event) => {
    var blocks = event.impactedBlocks;
    var goals = [];
    var di = event.source.dimension;
    for (var cf = 0; cf < blocks.length; cf++) {
        var block = di.getBlock(blocks[cf]);
        if (block.typeId === "minecraft:chest") {
            var item = block.getComponent("minecraft:inventory").container.getItem(0);
            if (typeof item === "object") {
                item = item.getLore();
                if (item.indexOf("passpaper") !== -1) {
                    goals.push(blocks[cf]);
                }
            }
        }
    }
    for (var cf of goals) {
        blocks.splice(blocks.indexOf(cf, 1));
    }
});


world.events.beforeItemUseOn.subscribe((event) => {
    /*if(event.item.typeId === "minecraft:shulker_box" || event.item.typeId === "minecraft:undyed_shulker_box"){
                var lore = event.item.getLore()
        }*/
    if (event.source.typeId == "minecraft:player") {
        var player = event.source;
        var block = event.source.dimension.getBlock(event.blockLocation);
        if (
            block.typeId === "minecraft:chest" &&
            player.hasTag("op-work") === false
        ) {
            var item = block.getComponent("minecraft:inventory").container.getItem(0);
            if (typeof item === "object") {
                if (item.typeId === "minecraft:paper") {
                    var lores = item.getLore();
                    if (lores.indexOf("passpaper") !== -1) {
                        var owner = "";
                        var password = "";
                        var open_team = "";
                        var need = true;
                        for (var cf = 0; cf < lores.length; cf++) {
                            switch (lores[cf].slice(0, 1)) {
                                case "o":
                                    owner = lores[cf].split(":")[1];
                                    break;
                                case "p":
                                    password = lores[cf].split(":")[1];
                                    break;
                                case "t":
                                    open_team = lores[cf].split(":")[1];
                                    break;
                            }
                        }

                        if (player.name === owner) {
                            need = false;
                        }
                        var index = get_team_by_player(player, 0);
                        if (index !== "") {
                            if (teams[index].id === open_team) {
                                need = false;
                            }
                        }
                        index = get_team_by_player(player, 1);
                        if (index !== "") {
                            if (teams[index].id === open_team) {
                                need = false;
                            }
                        }
                        if (typeof player.last_chest === "object") {
                            if (player.last_chest.x === block.location.x) {
                                if (player.last_chest.y === block.location.y) {
                                    if (player.last_chest.z === block.location.z) {
                                        need = false;
                                    }
                                }
                            }
                        }

                        if (need === true) {
                            event.cancel = true;
                            chestKeyBar(player, password, block.location, owner);
                        }
                    }
                }
            }
            //event.cancel = true
        }

        if (block_test(block, false, 1) !== "none") {
            add_history(
                event.source.name +
                    get_pos_str(event.source) +
                    "(" +
                    event.source.dimension.name +
                    ")与" +
                    block.typeId +
                    "方块" +
                    "(" +
                    String(block.x) +
                    "，" +
                    String(block.y) +
                    "，" +
                    String(block.z) +
                    ")" +
                    "交互"
            );
        }

        if (event.item.typeId === "minecraft:hopper") {
            var pos;
            switch (event.blockFace) {
                case "north":
                    pos = new BlockLocation(
                        event.blockLocation.x,
                        event.blockLocation.y + 1,
                        event.blockLocation.z - 1
                    );
                    break;
                case "south":
                    pos = new BlockLocation(
                        event.blockLocation.x,
                        event.blockLocation.y + 1,
                        event.blockLocation.z + 1
                    );
                    break;
                case "west":
                    pos = new BlockLocation(
                        event.blockLocation.x - 1,
                        event.blockLocation.y + 1,
                        event.blockLocation.z
                    );
                    break;
                case "east":
                    pos = new BlockLocation(
                        event.blockLocation.x + 1,
                        event.blockLocation.y + 1,
                        event.blockLocation.z
                    );
                    break;
                case "down":
                    pos = new BlockLocation(
                        event.blockLocation.x,
                        event.blockLocation.y + 1,
                        event.blockLocation.z
                    );
                    break;
                case "up":
                    pos = new BlockLocation(
                        event.blockLocation.x,
                        event.blockLocation.y + 2,
                        event.blockLocation.z
                    );
                    break;
            }
            var block = event.source.dimension.getBlock(pos);
            if (block.typeId === "minecraft:chest") {
                var item = block
                    .getComponent("minecraft:inventory")
                    .container.getItem(0);
                if (typeof item === "object") {
                    var lores = item.getLore();
                    if (lores.indexOf("passpaper") !== -1) {
                        event.cancel = true;
                        event.source.tell("§e密码箱，禁止放置");
                    }
                }
            }
        }
    }
});


world.events.itemUseOn.subscribe((event) => {
    if (event.source.typeId === "minecraft:player") {
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
        }*/
    }
});

function chestKeyBar(player, password, location, owner) {
    var ui = new ModalFormData()
        .title("密码验证")
        .textField("箱子启用了密码验证\n箱主：" + owner, "在此输入密码", "");

    ui.show(player).then((result) => {
        if (sum_md5_by_hex(result.formValues[0]) === password) {
            player.last_chest = location;
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e密码正确"}]}`);
        } else {
            player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§e密码错误"}]}`);
            add_history(
                player.name +
                    get_pos_str(player) +
                    "(" +
                    player.dimension.name +
                    ")" +
                    "输入错误密码箱密码"
            );
        }
    });
}


world.events.entityHit.subscribe((event) => {
    if (
        typeof event.hitBlock === "object" &&
        event.entity.typeId === "minecraft:player"
    ) {
        if (
            event.hitBlock.typeId === "minecraft:chest" &&
            event.entity.hasTag("op-work") === false
        ) {
            var item = event.hitBlock
                .getComponent("minecraft:inventory")
                .container.getItem(0);
            if (typeof item === "object") {
                item = item.getLore();
                var owner = "";
                for (var cf = 0; cf < item.length; cf++) {
                    if (item[cf].indexOf("owner") === 0) {
                        owner = item[cf].split(":")[1];
                    }
                }
                if (item.indexOf("passpaper") !== -1 && event.entity.name !== owner) {
                    chestWarnBar(event.entity);
                    chestWarnBar(event.entity);
                    chestWarnBar(event.entity);
                }
            }
        }
    }
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



function chestWarnBar(player) {
    var ui = new MessageFormData()
        .title("请注意")
        .body("密码箱禁止破坏")
        .button1("OK")
        .button2("我知道了");
    var promise = ui.show(player);
}
