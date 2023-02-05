
/* 未实际使用的代码
YoniScheduler.runCycleTickTask(()=>{
    for (cf of works) {
        if (cf.time === event.currentTick) {
            switch (cf.type) {
                case "chest-check":
                    cf.player.tell("正在执行检查");
                    cf.di
                        .runCommandAsync(
                            "replaceitem block " +
                                String(cf.block.x) +
                                " 2 " +
                                String(cf.block.z) +
                                " slot.container 0 keep air"
                        )
                        .catch((err) => {
                            kick(cf.player, "非法获取潜影盒");
                            cf.di
                                .getBlock(new BlockLocation(cf.block.x, 3, cf.block.z))
                                .setType(MinecraftBlockTypes.air);
                        });
                    cf.di
                        .runCommandAsync(
                            "clone " +
                                String(cf.block.x) +
                                " " +
                                String(3) +
                                " " +
                                String(cf.block.z) +
                                " " +
                                String(cf.block.x) +
                                " " +
                                String(3) +
                                " " +
                                String(cf.block.z) +
                                " " +
                                String(cf.block.x) +
                                " " +
                                String(cf.block.y) +
                                " " +
                                String(cf.block.z) +
                                " replace force"
                        )
                        .then((r) => {
                            cf.di
                                .getBlock(new BlockLocation(cf.block.x, 3, cf.block.z))
                                .setType(cf.replace[0]);
                            cf.di
                                .getBlock(new BlockLocation(cf.block.x, 2, cf.block.z))
                                .setType(cf.replace[1]);
                        });
                    break;
            }
        }
    }
}, 1, 1, false);
*/

YoniScheduler.runCycleTickTask(()=>{
    let playTimeObjective = Scoreboard.getObjective("play_time");
    World.getPlayers().forEach(player => {
        playTimeObjective.addScore(player, 1)
    });
}, 20, 20, false);
YoniScheduler.runCycleTickTask(()=>{
    let objective = Scoreboard.getObjective("show2");
    objective.resetAllScores();
    Scoreboard.setObjectiveAtSlot("list", { objective });
    Command.fetch("execute as @a run scoreboard players operation @s show2 = @s play_time");
}, 20, 20, false);
/*
YoniScheduler.runCycleTickTask(()=>{
    let objective = Scoreboard.getObjective("show1");
    objective.resetAllScores();
    Scoreboard.setObjectiveAtSlot("list", { objective });
    Command.fetch("execute as @a run scoreboard players operation @s show1 = @s play_time");
}, 40, 20, false);
*/

YoniScheduler.runCycleTickTask(()=>{
    YoniScheduler.runDelayTimerTask(async ()=>{
        let result = await Command.add(Command.PRIORITY_HIGH, "kill @e[type=item]");
        let count = result.successCount;
        
        Utils.send("§e已清理所有掉落物");
        
    }, 60000, 60000, true);
    Utils.send("§e一分钟后清理所有掉落物");
}, 6000, 6000, false);

YoniScheduler.runCycleTickTask(()=>{
    if (beload === false) {
        reload_all();
    }
    tps = ((1000 / (Date.now() - tps_ms)) * 20).toFixed(1);
    tps_ms = Date.now();
}, 20, 20, false);

YoniScheduler.runCycleTickTask(async ()=>{
    await Command.add(Command.PRIORITY_HIGH,
        "kill @e[type=npc,tag=!serverInfomation]");
        
    await Command.add(Command.PRIORITY_HIGH,
        "kill @e[type=command_block_minecart]");
        
    for (let player of World.getPlayers()){
    
        let vanillaPlayer = EntityBase.getMinecraftEntity(player);
        
        if (ban_list.includes(player.name)){
            player.kick("封禁列表，自动踢出")
                .catch(logger.error);
        }
        
        //test
        if (player.hasTag("op-work")) {
            const tooltip_text = `Tps: ${tps}  Entities:${entities_count}`
                +`\nPistons:${pistons} Spawn:${spawn}`
            player.onScreenDisplay.setActionbar(tooltip_text);
        }
        
        if (get_tag(vanillaPlayer, "beBan") !== ""
        && ! PermissionUtils.is_admin(vanillaPlayer)
        ){
            banBar(vanillaPlayer);
        }
        
        if (typeof vanillaPlayer.ro !== "number") {
            vanillaPlayer.ro = player.rotation.x;
        } else if (! vanillaPlayer.has_show
        && vanillaPlayer.rotation.x !== vanillaPlayer.ro
        ){
            show_board(vanillaPlayer);
            vanillaPlayer.has_show = true;
        }
        
        if (players[cf].hasTag("chesting") === true) {
        }
        
        if (player.lastDie && players[cf].getComponent("minecraft:health").current > 0) {
            players[cf].lastDie = false;
        }
    }
}, 2, 2, true);

EventListener.register("yoni:playerDead", (event) => {
    const vanillaEntity = event.player.vanillaEntity;
    vanillaEntity.lastDie = true;
    add_score(vanillaEntity, 3, true);
    let deadWhereLocation = event.player.location;
    vanillaEntity.diePos = [
        deadWhereLocation.dimension.id,
        deadWhereLocation.x,
        deadWhereLocation.y,
        deadWhereLocation.z
    ];
});

YoniScheduler.runCycleTickTask(()=>{
    for (var player of World.selectPlayers({ gameMode: "creative" })){
        if (! PermissionUtils.is_admin(player.vanillaEntity)) {
            player.kick(cf, "创造模式");
        }
    }
    
    var run_time = Date.now();
    
    let allEntities = Array.from(World.selectEntities());
    
    var count = allEntities.length;
    
    for (var cf of allEntities) {
        if (cf.typeId === "minecraft:item") {
            var item = cf.getComponent("minecraft:item").itemStack;
            if (banned_item.indexOf(item.typeId) != -1) {
                world.say("§e发现违禁物品，已清理");
                cf.kill();
            }
            if (item.typeId.indexOf("spawn_egg") != -1) {
                world.say("§e发现违禁物品，已清理");
                cf.kill();
            }
        }
    }
    
    entities_count = count;
    
    pistons = pistons_now;
    
    pistons_now = 0;
    
    spawn = spawn_now;
    
    spawn_now = 0;
    
    //原本：1200
    //world.say("§4开始随机检查......")
    //随机？明明是对每个玩家都检查一遍（
    World.getPlayers().forEach(player_item_check);
    
    run_time = Date.now() - run_time;
    
    script_check_run(
        `tellraw @s {"rawtext":[{"text":"随机检查用时${run_time}"}]}`
    );
    
}, 100, 100, false);

function player_item_check(player){
    //op跳过检查
    if (PermissionUtils.is_admin(EntityBase.getMinecraftEntity(player))){
        return;
    }
    
    const inventory = player.getComponent("minecraft:inventory").container;
    for (var slot = 0; slot < inventory.size; slot++) {
        var item = inventory.getItem(slot);
        
        if (!item){ //物品可能为空
            continue;
        }
        
        // 附魔检查 //
        if (item.hasComponent("minecraft:enchantments")) {
            let enchantments = item.getComponent("minecraft:enchantments").enchantments;
            for (let enchant of enchantments){
                if (enchant.level > enchant.type.maxLevel){
                    let logoutputText = `玩家${player.name}物品附魔等级过高。物品类别：${item.typeId}；附魔名：${enchant.type.id}；等级：${enchant.level}`;
                    log(logoutputText, true);
                    item
                        .getComponent("minecraft:enchantments")
                        .removeAllEnchantments();
                } else {
                    continue;
                }
                if (enchant.level > 5) {
                    EntityBase.from(player).kick("作弊附魔");
                } else {
                    warnBar(EntityBase.getMinecraftEntity(player));
                }
            }
        }
        
        // 违禁物品检查 //
        if (banned_item.includes(item.typeId)
        || item.typeId.match("spawn_egg") != null) {
            log(
                "玩家" +
                    player.name +
                    "获得违禁物品：" +
                    item.typeId +
                    "物品数量：" +
                    item.amount,
                true
            );
            inventory.setItem(
                cf1,
                new ItemStack(MinecraftItemTypes.apple, 1, 0)
            );
            kick(player, "获得违禁物品");
            warnBar(player);
            break;
        }
        if (item.typeId == "minecraft:tnt" && item.amount > 16) {
            log(
                "玩家" +
                    player.name +
                    "收集违禁物品：" +
                    item.typeId +
                    "物品数量：" +
                    item.amount,
                true
            );
        }
    }
}

world.events.entityHurt.subscribe((event) => {
    var name = event.hurtEntity.typeId;
    if (typeof event.damagingEntity == "object")
        if (event.damagingEntity.typeId == "minecraft:player") {
            if (
                event.damage > 100 &&
                event.hurtEntity.typeId !== "minecraft:ghast" &&
                PermissionUtils.is_admin(event.damagingEntity) === false
            ) {
                log(
                    "玩家" +
                        event.damagingEntity.name +
                        get_pos_str(event.damagingEntity) +
                        "(" +
                        event.damagingEntity.dimension.name +
                        ")" +
                        "对" +
                        event.hurtEntity.typeId +
                        get_pos_str(event.hurtEntity) +
                        "造成了" +
                        String(event.damage) +
                        "点伤害",
                    true
                );
                kick(event.damagingEntity, "造成伤害过高");
                warnBar(event.damagingEntity);
            } else {
                if (event.damage > 25) {
                    log(
                        "玩家" +
                            event.damagingEntity.name +
                            get_pos_str(event.damagingEntity) +
                            "(" +
                            event.damagingEntity.dimension.name +
                            ")" +
                            "对" +
                            event.hurtEntity.typeId +
                            get_pos_str(event.hurtEntity) +
                            "造成了" +
                            String(event.damage) +
                            "点伤害",
                        false
                    );
                }
            }
        }
});
