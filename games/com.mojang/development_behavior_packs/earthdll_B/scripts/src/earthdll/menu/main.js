function playerBar(player) {
    var talk_mode = get_tag(player, "talk_mode,").slice(10);
    var text = "公共聊天";
    if (talk_mode == "1") {
        text = "队伍聊天(我的队伍)";
    }
    if (talk_mode == "2") {
        text = "队伍聊天(加入的队伍)";
    }

    var ui = new ActionFormData()
        .title("玩家互动界面")
        .body("来和玩家们一起互动吧")
        .button("私聊玩家", ui_path + "mute_off.png")
        .button(
            "聊天设置(当前：" + text + ")",
            ui_path + "settings_glyph_color_2x.png"
        )
        .button("交易", ui_path + "icon_book_writable.png")
        .button("emoji大全", ui_path + "regeneration_effect.png")
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            talkBar(player);
        }
        if (result.selection === 4) {
            cdBar(player);
        }
        if (result.selection === 3) {
            emojiBar(player);
        }
        if (result.selection === 1) {
            player.removeTag("talk_mode," + String(talk_mode));
            if (talk_mode === "") {
                player.addTag("talk_mode,1");
            }
            switch (talk_mode) {
                case "0":
                    player.addTag("talk_mode,1");
                    break;
                case "1":
                    player.addTag("talk_mode,2");
                    break;
                case "2":
                    player.addTag("talk_mode,0");
                    break;
            }
            playerBar(player);
        }
        if (result.selection === 2) {
            tradeBar(player);
        }
    });
}

function ideaBar(player) {
    var ui = new ModalFormData()
        .title("服务器意见反馈")
        .textField("意见反馈", "在此输入", "");

    ui.show(player).then((result) => {
        add_score(player, 20);
        player.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"§e意见反馈已收到，奖励20贡献"}]}`
        );
        ideas.push(player.name + " >> " + result.formValues[0]);
        cdBar(player);
    });
}

function chooseBanBar(player) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name);
    }

    var ui = new ModalFormData().title("封禁玩家").dropdown("选择玩家", names, 0);

    ui.show(player).then((result) => {
        kick(players[result.formValues[0]], "管理员踢出");
    });
}

function historyFindBar(player) {
    var ui = new ModalFormData()
        .title("查找有关日志")
        .textField("查找内容", "在此输入内容", "");

    ui.show(player).then((result) => {
        historyResultBar(player, result.formValues[0]);
    });
}

function tpPlayerBar(player) {
    var players = world.getAllPlayers();
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        names.push(players[cf].name);
    }
    var ui = new ModalFormData()
        .title("传送至玩家")
        .dropdown("选择玩家", names, 0)
        .textField("传送备注", "此处输入消息(消耗100贡献)", "");

    ui.show(player).then((result) => {
        tpaBar(players[result.formValues[0]], player, result.formValues[1]);
    });
}


function sayBoardBar(player) {
    var ui = new ModalFormData()
        .title("留言板")
        .textField("留言板", "在此写下留言", "");

    ui.show(player).then((result) => {
        add_score(player, 10, true);
        player.runCommandAsync(
            `tellraw @s {"rawtext":[{"text":"§e留言成功，获得10贡献"}]}`
        );
        boards.push(player.name + " >> " + result.formValues[0]);
        cdBar(player);
    });
}

function show_board(player) {
    var ui = new ActionFormData()
        .title("公告")
        .body(tooltips)
        .button("打开交易", ui_path + "icon_book_writable.png")
        .button("打开主菜单", ui_path + "icon_crafting.png");

    ui.show(player).then((result) => {
        if (result.selection === 1) {
            cdBar(player);
        }
        if (result.selection === 0) {
            tradeBar(player);
        }
    });
}


