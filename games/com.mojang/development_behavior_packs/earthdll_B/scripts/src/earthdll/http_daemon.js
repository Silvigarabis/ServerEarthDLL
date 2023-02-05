let http = null;
const baseUrl = "http://127.0.0.1:1024/"
export const outerDaemon = {
    get: async function get(appendUrl){
        if (!http){ // http 未加载，无法调用
            return;
        }
        let fullUrl = baseUrl + appendUrl;
        return http.get(fullUrl);
    },
    log(text){
        return outerDaemon.get("log?text="+encodeURIComponent(text));
    },
    addHistory(text){
        return outerDaemon.get("history?text="+encodeURIComponent(text));
    },
    sendMessage(text){
        return outerDaemon.get("send?text="+encodeURIComponent(text));
    }
};
(function (){
    //动态加载"@minecraft/mojang-net"模块
    import("@minecraft/mojang-net")
        .then((module) => http = module.http)
        .catch((error) => {
            //啥也不做，你要的话可以写点什么
        });
})();
