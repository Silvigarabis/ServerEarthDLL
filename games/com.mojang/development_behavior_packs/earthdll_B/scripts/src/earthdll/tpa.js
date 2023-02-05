
function tpaBar(target, player, tpText) {
    var id = system.runSchedule(function () {
        target.runCommandAsync("damage @s 0 entity_attack");
        var ui = new MessageFormData()
            .title("TPA传送请求")
            .body(
                "(打开该菜单会受到一个假伤害，请忽略)\n玩家" +
                    player.name +
                    "请求传送至您的位置\n对方备注：" +
                    tpText +
                    "\n请通过下方按钮决定"
            )
            .button1("同意")
            .button2("拒绝");
        system.clearRunSchedule(id);
        ui.show(target).then((result) => {
            switch (result.selection) {
                case 1:
                    if (target.dimension.id === player.dimension.id) {
                        player.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§e正在执行传送"}]}`
                        );
                        var tp_text =
                            "tp @s " +
                            String(target.location.x) +
                            " " +
                            String(target.location.y) +
                            " " +
                            String(target.location.z);
                        player.runCommandAsync(tp_text);
                        add_score(player, -100, true);
                    } else {
                        player.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"维度不同，tpa失败"}]}`
                        );
                        target.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"维度不同，tpa失败"}]}`
                        );
                    }
                    break;
                case 0:
                    player.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§e对方拒绝了你的请求"}]}`
                    );
                    break;
            }
        });
    }, 10);
}
