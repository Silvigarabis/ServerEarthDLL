
world.events.blockBreak.subscribe((event) => {
    if (
        event.player.unbreak === false ||
        typeof event.player.unbreak !== "boolean"
    ) {
        if (typeof event.player.last_break === "number") {
            var offest = Date.now() - event.player.last_break;
            if (offest < 20) {
                event.player.break_count.push([
                    event.block.location,
                    event.brokenBlockPermutation.type,
                ]);
                if (event.player.break_count.length > 3) {
                    kick(event.player, "范围挖掘方块", true);
                    event.player.unbreak = true;
                    for (var cf of event.player.break_count) {
                        event.dimension.getBlock(cf[0]).setType(cf[1]);
                    }
                }
            } else {
                event.player.break_count = [];
            }
        } else {
            event.player.break_count = [];
        }
    } else {
        event.dimension
            .getBlock(event.block.location)
            .setType(event.brokenBlockPermutation.type);
        for (var cf of event.dimension.getEntities({
            maxDistance: 2,
            location: new Location(event.block.x, event.block.y, event.block.z),
            type: "item",
        })) {
            cf.kill();
        }
    }
    event.player.last_break = Date.now();
    if (typeof event.player === "object") {
        add_score(event.player, 1);
        var block = event.brokenBlockPermutation;
        var test = block_test(block.type.id, true, 0);
        if (test !== "none") {
            add_history(
                event.player.name +
                    get_pos_str(event.player) +
                    "(" +
                    event.player.dimension.name +
                    ")" +
                    "破坏方块" +
                    block.type.id +
                    get_block_pos_str(event.block)
            );
        }
        if (test === "kick" && PermissionUtils.is_admin(event.player) === false) {
            log(
                event.player.name +
                    get_pos_str(event.player) +
                    "(" +
                    event.player.dimension.name +
                    ")" +
                    "破坏方块" +
                    block.type.id +
                    get_block_pos_str(event.block),
                true
            );
            kick(event.player, "破坏非法方块");
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
});

world.events.blockPlace.subscribe((event) => {
    if (typeof event.player === "object") {
        add_score(event.player, 1);
        var block = event.block;
        var test = block_test(block, false, 1);
        if (test !== "none") {
            add_history(
                event.player.name +
                    get_pos_str(event.player) +
                    "(" +
                    event.player.dimension.name +
                    ")" +
                    "放置方块" +
                    block.typeId +
                    get_block_pos_str(block)
            );
        }
        if (test === "kick" && PermissionUtils.is_admin(event.player) === false) {
            log(
                event.player.name +
                    get_pos_str(event.player) +
                    "(" +
                    event.player.dimension.name +
                    ")" +
                    "放置方块" +
                    block.typeId +
                    get_block_pos_str(block),
                true
            );
            block.setType(MinecraftBlockTypes.air);
            kick(event.player, "放置非法方块");
        }
        if (block.typeId === "minecraft:chest") {
            var con = block.getComponent("minecraft:inventory").container;
            if (con.size - con.emptySlotsCount > 1) {
                kick(event.player, "放置nbt箱子");
                block.setType(MinecraftBlockTypes.air);
                for (var cf of event.player.dimension.getEntities({
                    maxDistance: 2,
                    location: new Location(event.block.x, event.block.y, event.block.z),
                    type: "item",
                })) {
                    cf.kill();
                }
            }
        }
    }
});

world.events.beforePistonActivate.subscribe((event) => {
    event.cancel = true;
    var piston = event.block;
    piston.setType(MinecraftBlockTypes.air);
    var dir = piston.permutation.getProperty("facing_direction").value;
    var pos = piston.location;
    switch (dir) {
        case "east":
            pos = new BlockLocation(piston.x - 1, piston.y, piston.z);
            break;
        case "west":
            pos = new BlockLocation(piston.x + 1, piston.y, piston.z);
            break;
        case "north":
            pos = new BlockLocation(piston.x, piston.y, piston.z + 1);
            break;
        case "south":
            pos = new BlockLocation(piston.x, piston.y, piston.z - 1);
            break;
        case "up":
            pos = new BlockLocation(piston.x, piston.y + 1, piston.z);
            break;
        case "down":
            pos = new BlockLocation(piston.x, piston.y - 1, piston.z);
            break;
    }
    pos = event.dimension.getBlock(pos).typeId;

    var blocks = event.piston.attachedBlocks;
    for (var cf of blocks) {
        var block = event.dimension.getBlock(cf);
        if (banned_block_broken_list.indexOf(block.typeId) !== -1) {
            event.cancel = true;
            var bader = event.dimension.getPlayers({
                closest: 1,
                maxDistance: 10,
                location: new Location(cf.x, cf.y, cf.z),
            });
            kick(bader, "使用非法活塞");
        }
        if (block.typeId === "minecraft:hopper") {
            event.cancel = true;
            return 0;
        }
        if (block.typeId === "minecraft:chest") {
            var item = block.getComponent("minecraft:inventory").container.getItem(0);
            if (typeof item === "object") {
                if (item.typeId === "minecraft:paper") {
                    var lores = item.getLore();
                    if (lores.indexOf("passpaper") !== -1) {
                        event.cancel = true;
                    }
                }
            }
        }
    }
    pistons_now++;
});

