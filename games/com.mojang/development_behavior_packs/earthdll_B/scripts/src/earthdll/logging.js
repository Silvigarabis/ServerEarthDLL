import { Utils } from "./yoni/index.js";
import { outerDaemon } from "./http_daemon.js";

function get_time_str() {
    var zone = 8;
    var date = new Date();
    var Days = date.getDate();
    var Hours = date.getHours();
    var offest = zone - date.getTimezoneOffset() / -60;
    Hours += offest;
    if (Hours >= 24) {
        Hours = Hours - 24;
        Days++;
    }
    return (
        "[" +
        String(date.getMonth() + 1) +
        "." +
        String(Days) +
        " " +
        String(Hours) +
        ":" +
        String(date.getMinutes()) +
        "]"
    );
}

export function add_history(text) {
    text = get_time_str() + text;
    text = text.replace(/§./g, "");
    outerDaemon.addHistory(text);
}

export function log(text, warning = false) {
    text = get_time_str() + text;
    text = text.replace(/§./g, "");
    outerDaemon.log(text);
    if (warning){
        outerDaemon.send("检测到服务器出现危险行为，请管理员前往确认");
        Utils.send("§4" + text);
    }
}
