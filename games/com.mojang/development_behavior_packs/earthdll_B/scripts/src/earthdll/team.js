var teams = [];
var team_id = 10000;

function addTeamBar(target, self, index) {
    var id = system.runSchedule(function () {
        target.runCommandAsync("damage @s 0 entity_attack");
        var ui = new MessageFormData()
            .title("队伍邀请请求")
            .body(
                "(打开该菜单会受到一个假伤害，请忽略)\n玩家" +
                    self.name +
                    "邀请您加入TA的队伍\n请通过下方按钮决定"
            )
            .button1("同意")
            .button2("拒绝");
        system.clearRunSchedule(id);
        ui.show(target).then((result) => {
            switch (result.selection) {
                case 1:
                    if (get_team_by_player(target, 1) === "") {
                        teams[index].member.push(target.name);
                        target.addTag("addTeam," + String(teams[index].id));
                        save_team(index);
                        self.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§e对方已加入你的队伍"}]}`
                        );
                        target.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§e你已加入对方的队伍"}]}`
                        );
                    } else {
                        self.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§e你已加入其他队伍"}]}`
                        );
                        target.runCommandAsync(
                            `tellraw @s {"rawtext":[{"text":"§e对方已加入其他队伍"}]}`
                        );
                    }
                    break;
                case 0:
                    self.runCommandAsync(
                        `tellraw @s {"rawtext":[{"text":"§e对方拒绝了你的请求"}]}`
                    );
                    break;
            }
        });
    }, 10);
}

function save_team(index) {
    var text =
        "team，" +
        teams[index].id +
        "，" +
        teams[index].name +
        "，o；" +
        teams[index].owner;
    for (var cf = 0; cf < teams[index].member.length; cf++) {
        text += "，m；" + teams[index].member[cf];
    }
    if (teams[index].pos1.length === 5) {
        text +=
            "，p1；" +
            teams[index].pos1[0] +
            "；" +
            teams[index].pos1[1] +
            "；" +
            teams[index].pos1[2] +
            "；" +
            teams[index].pos1[3] +
            "；" +
            teams[index].pos1[4];
    }
    if (teams[index].pos2.length === 5) {
        text +=
            "，p2；" +
            teams[index].pos2[0] +
            "；" +
            teams[index].pos2[1] +
            "；" +
            teams[index].pos2[2] +
            "；" +
            teams[index].pos2[3] +
            "；" +
            teams[index].pos2[4];
    }
    if (teams[index].pos3.length === 5) {
        text +=
            "，p3；" +
            teams[index].pos3[0] +
            "；" +
            teams[index].pos3[1] +
            "；" +
            teams[index].pos3[2] +
            "；" +
            teams[index].pos3[3] +
            "；" +
            teams[index].pos3[4];
    }
    infoEntity.removeTag(teams[index].tag);
    infoEntity.addTag(text);
    teams[index].tag = text;
}

function get_team_by_player(player, type = 0) {
    //type=0 我的队伍  type=1  我加入的队伍
    switch (type) {
        case 0:
            var tag = get_tag(player, "myTeam,");
            if (tag === "") {
                return "";
            } else {
                tag = tag.split(",")[1];
                for (var cf = 0; cf < teams.length; cf++) {
                    if (tag === teams[cf].id) {
                        if (teams[cf].member.indexOf(player.name) !== -1) {
                            return cf;
                        } else {
                            player.removeTag(get_tag(player, "myTeam,"));
                            return "";
                        }
                    }
                }
            }
            break;
        case 1:
            var tag = get_tag(player, "addTeam,");
            if (tag === "") {
                return "";
            } else {
                tag = tag.split(",")[1];
                for (var cf = 0; cf < teams.length; cf++) {
                    if (tag === teams[cf].id) {
                        if (teams[cf].member.indexOf(player.name) !== -1) {
                            return cf;
                        } else {
                            player.removeTag(get_tag(player, "addTeam,"));
                            return "";
                        }
                    }
                }
            }
            break;
    }
    return "";
}

function add_team(info, owner) {
    var text = "team，" + info.id + "，" + info.name + "，o；" + info.owner;
    for (var cf = 0; cf < info.member.length; cf++) {
        text += "，m；" + info.member[cf];
    }
    var team = info;
    team.tag = text;
    teams.push(team);
    infoEntity.addTag(text);
    owner.addTag("myTeam," + String(team_id));
    infoEntity.removeTag("team_id，" + String(team_id));
    team_id++;
    infoEntity.addTag("team_id，" + String(team_id));
    add_score(owner, -500, true);
}

function load_team(info) {
    var team = {
        tag: info,
        name: "",
        id: "",
        owner: "",
        member: [],
        pos1: [],
        pos2: [],
        pos3: [],
    };
    var texts = info.split("，");
    if (texts.length > 3) {
        team.name = texts[2];
        team.id = texts[1];
        for (var cf = 3; cf < texts.length; cf++) {
            var infos = texts[cf].split("；");
            switch (infos[0]) {
                case "m":
                    team.member.push(infos[1]);
                    break;
                case "o":
                    team.owner = infos[1];
                    break;
                case "p1":
                    team.pos1 = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                    break;
                case "p2":
                    team.pos2 = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                    break;
                case "p3":
                    team.pos3 = [infos[1], infos[2], infos[3], infos[4], infos[5]];
                    break;
            }
        }
    }
    teams.push(team);
}

function deleteMemberBar(player, index) {
    var players = teams[index].member;
    var ui = new ModalFormData()
        .title("删除成员")
        .dropdown("选择玩家(消耗50贡献)", players, 0);

    ui.show(player).then((result) => {
        add_score(player, -50, true);
        if (teams[index].member[result.formValues[0]] !== teams[index].owner) {
            teams[index].member.splice(result.formValues[0], 1);
            save_team(index);
        }
        myTeamBar(player);
    });
}

function turnTeamBar(player, index) {
    var players = world.getAllPlayers();
    var real_players = [];
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        if (teams[index].member.indexOf(players[cf].name) === -1) {
            names.push(players[cf].name);
            real_players.push(players[cf]);
        }
    }
    var ui = new ModalFormData()
        .title("队伍转让")
        .dropdown("选择玩家(消耗100贡献)", names, 0);

    ui.show(player).then((result) => {
        add_score(player, -100, true);
        if (teams[index].member[result.formValues[0]] !== teams[index].owner) {
            teams[index].owner = names[result.formValues[0]];
            player.removeTag(get_tag(player, "myTeam,"));
            
            //这个real_player是？
            real_player.addTag("myTeam," + teams[index].id);
            save_team(index);
        }
        myTeamBar(player);
    });
}

function addMemberBar(player, index) {
    var players = world.getAllPlayers();
    var real_players = [];
    var names = [];
    for (var cf = 0; cf < players.length; cf++) {
        if (teams[index].member.indexOf(players[cf].name) === -1) {
            names.push(players[cf].name);
            real_players.push(players[cf]);
        }
    }
    var ui = new ModalFormData()
        .title("添加成员")
        .dropdown("选择玩家(消耗50贡献)", names, 0);

    ui.show(player).then((result) => {
        addTeamBar(real_players[result.formValues[0]], player, index);
    });
}


function myTeamBar(player) {
    var text = "";
    var index = get_team_by_player(player, 0);
    if (index === "") {
        text = "您还没有队伍";
    } else {
        text += "队伍ID：" + teams[index].id;
        text += "\n队名：" + teams[index].name;
        text += "\n队主：" + teams[index].owner + "\n队员：";
        for (var cf = 0; cf < teams[index].member.length; cf++) {
            text += teams[index].member[cf] + "，";
        }
    }
    var ui = new ActionFormData()
        .title("我的队伍")
        .body(text)
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");
    if (index === "") {
        ui = ui.button("创建我的队伍");
    } else {
        ui = ui
            .button("邀请新成员", ui_path + "anvil-plus.png")
            .button("删除成员", ui_path + "book_trash_default.png")
            .button("转让队伍")
            .button("解散队伍");
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        } else {
            if (index === "") {
                if (result.selection === 1) {
                    createTeamBar(player);
                }
            } else {
                switch (result.selection) {
                    case 1:
                        addMemberBar(player, index);
                        break;
                    case 2:
                        deleteMemberBar(player, index);
                        break;
                    case 3:
                        giveTeamBar(player, index);
                        break;
                    case 4:
                        deleteTeamBar(player, index);
                        break;
                }
            }
        }
    });
}

function myAddTeamBar(player) {
    var text = "";
    var index = get_team_by_player(player, 1);
    if (index === "") {
        text = "您还没有加入队伍";
    } else {
        text += "队伍ID：" + teams[index].id;
        text += "\n队名：" + teams[index].name;
        text += "\n队主：" + teams[index].owner + "\n队员：";
        for (var cf = 0; cf < teams[index].member.length; cf++) {
            text += teams[index].member[cf] + "，";
        }
    }
    var ui = new ActionFormData()
        .title("我加入的队伍")
        .body(text)
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");
    if (index !== "") {
        ui = ui.button("退出队伍", ui_path + "book_trash_default.png");
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        } else {
            switch (result.selection) {
                case 1:
                    if (player.name !== teams[index].owner) {
                        teams[index].member.splice(
                            teams[index].member.indexOf(player.name),
                            1
                        );
                        save_team(index);
                    }
                    break;
            }
        }
    });
}

function createTeamBar(player) {
    var ui = new ModalFormData()
        .title("创建队伍")
        .textField("队伍名称(创建队伍花费500贡献)", "我的队伍", "");

    ui.show(player).then((result) => {
        var team = {
            name: result.formValues[0].replaceAll("，", ""),
            id: String(team_id),
            owner: player.name,
            member: [player.name],
            tag: "",
            pos1: [],
            pos2: [],
            pos3: [],
        };
        add_team(team, player);
        meBar(player);
    });
}

function teamPosBar(player) {
    var pos = [];
    var ui = new ActionFormData()
        .title("队伍共享点")
        .body("当前队伍共享点")
        .button("返回主菜单", ui_path + "arrow_dark_left_stretch.png");

    var index = get_team_by_player(player, 0);
    if (index !== "") {
        if (teams[index].pos1.length === 5) {
            pos.push(teams[index].pos1);
            ui = ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos1[1]).name +
                    "]" +
                    teams[index].pos1[0]
            );
        }
        if (teams[index].pos2.length === 5) {
            pos.push(teams[index].pos2);
            ui = ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos2[1]).name +
                    "]" +
                    teams[index].pos2[0]
            );
        }
        if (teams[index].pos3.length === 5) {
            pos.push(teams[index].pos3);
            ui = ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos3[1]).name +
                    "]" +
                    teams[index].pos3[0]
            );
        }
    }
    var index = get_team_by_player(player, 1);
    if (index !== "") {
        if (teams[index].pos1.length === 5) {
            pos.push(teams[index].pos1);
            ui = ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos1[1]).name +
                    "]" +
                    teams[index].pos1[0]
            );
        }
        if (teams[index].pos2.length === 5) {
            pos.push(teams[index].pos2);
            ui = ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos2[1]).name +
                    "]" +
                    teams[index].pos2[0]
            );
        }
        if (teams[index].pos3.length === 5) {
            pos.push(teams[index].pos3);
            ui = ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos3[1]).name +
                    "]" +
                    teams[index].pos3[0]
            );
        }
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            cdBar(player);
        } else {
            var thing = pos[result.selection - 1];
            player.runCommandAsync(
                "tp @s " + thing[2] + " " + thing[3] + " " + thing[4]
            );
        }
    });
}

function teamCheckBar(player) {
    var text = "";
    for (var cf = 0; cf < teams.length; cf++) {
        text += "ID：" + teams[cf].id;
        text += "\n队伍名称：" + teams[cf].name;
        text += "\n队主：" + teams[cf].owner;
        for (var cf1 = 0; cf1 < teams[cf].member.length; cf1++) {
            text += "\n队员：" + teams[cf].member[cf1];
        }
        text += "\n";
    }
    var ui = new ActionFormData()
        .title("玩家队伍信息")
        .body(text)

        .button("返回上一级", ui_path + "arrow_dark_left_stretch.png");
    ui.show(player).then((result) => {
        if (result.selection === 0) {
            opBar(player);
        }
    });
}


function chooseTeamPosBar(player) {
    var team_index = [];
    var pos_number = [];
    var ui = new ActionFormData()
        .title("坐标点设置")
        .body("选择要操作的坐标点")
        .button("返回上一级");

    var index = get_team_by_player(player, 0);
    if (index !== "") {
        team_index.push(index);
        if (teams[index].pos1.length === 5) {
            ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos1[1]).name +
                    "]" +
                    teams[index].pos1[0]
            );
        } else {
            ui.button(teams[index].name + " - 未设置");
        }
        if (teams[index].pos2.length === 5) {
            ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos2[1]).name +
                    "]" +
                    teams[index].pos2[0]
            );
        } else {
            ui.button(teams[index].name + " - 未设置");
        }
        if (teams[index].pos3.length === 5) {
            ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos3[1]).name +
                    "]" +
                    teams[index].pos3[0]
            );
        } else {
            ui.button(teams[index].name + " - 未设置");
        }
    }

    index = get_team_by_player(player, 1);
    if (index !== "") {
        team_index.push(index);
        if (teams[index].pos1.length === 5) {
            ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos1[1]).name +
                    "]" +
                    teams[index].pos1[0]
            );
        } else {
            ui.button(teams[index].name + " - 未设置");
        }
        if (teams[index].pos2.length === 5) {
            ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos2[1]).name +
                    "]" +
                    teams[index].pos2[0]
            );
        } else {
            ui.button(teams[index].name + " - 未设置");
        }
        if (teams[index].pos3.length === 5) {
            ui.button(
                teams[index].name +
                    " - [" +
                    world.getDimension(teams[index].pos3[1]).name +
                    "]" +
                    teams[index].pos3[0]
            );
        } else {
            ui.button(teams[index].name + " - 未设置");
        }
    }

    ui.show(player).then((result) => {
        if (result.selection === 0) {
            posBar(player);
        } else {
            var goal = result.selection - 1;
            var index = "";
            if (goal < 3) {
                index = team_index[0];
            } else {
                index = team_index[1];
            }
            setTeamPosBar(player, index, goal % 3);
        }
    });
}

function setTeamPosBar(player, index, pos) {
    var name = "";
    switch (pos) {
        case 0:
            if (teams[index].pos1.length === 5) {
                name = teams[index].pos1[0];
            }
            break;
        case 1:
            if (teams[index].pos2.length === 5) {
                name = teams[index].pos2[0];
            }
            break;
        case 2:
            if (teams[index].pos3.length === 5) {
                name = teams[index].pos3[0];
            }
            break;
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
        .textField("坐标名称(设置手续费：20贡献)", "队伍坐标点", name)
        .dropdown("选择坐标位置", poses, 0);

    ui.show(player).then((result) => {
        add_score(player, -20, true);
        var pos_text = [];
        if (result.formValues[1] === 0) {
            pos_text = [
                result.formValues[0].replaceAll(",", ""),
                player.dimension.id,
                String(player.location.x),
                String(player.location.y),
                String(player.location.z),
            ];
        } else {
            var thing = real_pos[result.formValues[1]].split(",");
            pos_text = [
                result.formValues[0].replaceAll(",", ""),
                thing[5],
                thing[2],
                thing[3],
                thing[4],
            ];
        }
        switch (pos) {
            case 0:
                teams[index].pos1 = pos_text;
                break;
            case 1:
                teams[index].pos2 = pos_text;
                break;
            case 2:
                teams[index].pos3 = pos_text;
                break;
        }
        save_team(index);
        posBar(player);
    });
}

