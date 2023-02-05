
world.events.playerJoin.subscribe((event) => {
    add_history(
        event.player.name +
            "(" +
            String(Math.round(event.player.location.x)) +
            "，" +
            String(Math.round(event.player.location.y)) +
            "，" +
            String(Math.round(event.player.location.z)) +
            ")(" +
            event.player.dimension.name +
            ")进入服务器"
    );
    event.player.has_show = false;
    event.player.Join = true;
});

world.events.playerLeave.subscribe((event) => {
    add_history(event.playerName + "离开服务器");
});


world.events.beforeItemUseOn.subscribe((event) => {
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
    }
});


world.events.weatherChange.subscribe((event) => {
    var weaText = "";
    if (event.lightning == true) {
        if (event.raining == true) {
            weaText = "雷雨";
        } else {
            weaText = "雷暴";
        }
    } else {
        if (event.raining == true) {
            weaText = "下雨";
        } else {
            weaText = "晴天";
        }
    }
    world.say("§e天气转为：" + weaText);
});


world.events.effectAdd.subscribe((event) => {
    if (event.entity.typeId === "minecraft:player") {
        if (
            get_tag(event.entity, "op," + event.entity.name) === "" &&
            event.entity.Join === true
        ) {
            add_history(
                event.entity.name +
                    get_pos_str(event.entity) +
                    "(" +
                    event.entity.dimension.name +
                    ")获得" +
                    event.effect.displayName +
                    "药水效果，等级：" +
                    String(event.effect.amplifier + 1) +
                    "，时间：" +
                    String(event.effect.duration / 20)
            );
        }
    }
});
