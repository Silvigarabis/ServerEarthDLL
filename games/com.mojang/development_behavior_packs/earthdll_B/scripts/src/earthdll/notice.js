
world.events.entityHurt.subscribe((event) => {
    var name = event.hurtEntity.typeId;
    if (typeof event.damagingEntity == "object")
        if (event.damagingEntity.typeId == "minecraft:player") {
            if (event.hurtEntity.hasComponent("minecraft:health") == true) {
                add_score(event.damagingEntity, 1);
                var max = event.hurtEntity.getComponent("minecraft:health").value;
                var now = event.hurtEntity.getComponent("minecraft:health").current;
                if (now > 0) {
                    var text = "目标血量：";
                    if (now / max >= 0.66) {
                        text = "§4" + text;
                    } else {
                        if (now / max < 0.66 && now / max >= 0.33) {
                            text = "§e" + text;
                        }
                        if (now / max < 0.33) {
                            text = "§a" + text;
                        }
                    }
                    event.damagingEntity.runCommandAsync(
                        "title @s actionbar " +
                            text +
                            String(Math.round((now / max) * 1000) / 10) +
                            "%"
                    );
                } else {
                    add_history(
                        event.damagingEntity.name +
                            get_pos_str(event.damagingEntity) +
                            "(" +
                            event.damagingEntity.dimension.name +
                            ")" +
                            "杀死了" +
                            name
                    );
                    add_score(event.damagingEntity, 1);
                }
            }
        }
});
