const { createClient } = require("oicq")
var open=require('open');
const account = 123456//要登录账号的qq号
var http = require("http");
var url = require("url");
var fs = require("fs");
var talk_number = 438185675//服务器玩家QQ群(这是我的，可以来玩纯生存，验证码：85992)
var log_number = 13928//日志QQ群
var send_text = ""

function open_server(){
    talk_group.sendMsg("正在启动服务器")
    log_group.sendMsg("正在启动服务器")
    open(`../bedrock_server.exe`)
}

var talk_group
var log_group

const client = createClient(account,{platform:5})
client.on("system.online", () => {
    talk_group = client.pickGroup(talk_number)
    log_group = client.pickGroup(log_number)
    console.log("Logged in!")
    })

client.on("message", e => {
	
  if(e.message_type === "group"){
    if(e.group_id === log_number){
        var message = ""
        if(e.message[0].type === "text"){
            message = e.message[0].text
        }
        console.log(message)
        if(message === "启动服务器"){
            open_server()
        }
        if(message.indexOf("发送") === 0){
            send_text = "[管理员]" + e.message.slice(3)
        }
    }
  }
})

client.on("notice", e => {
  if(e.notice_type === "group" && e.sub_type === "increase"){
    if(e.group_id === log_number){
      talk_group.sendMsg("欢迎新成员，进群请改名")
    }
  }
})

client.on("system.login.slider", function (e) {
  console.log("输入ticket：")
  process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login("密码")

var httpS = http.createServer();
httpS.on("request",(req , res) => {
	var request_url = req.url;
    var info = url.parse(request_url,true)
    var text = ""
    if(typeof(info.query.text) === "string"){
        text = info.query.text
    }
    if(text !== ""){
    switch(info.pathname.slice(1)){
        case "":
            console.log("nothing")
            break;
        case "history":
            console.log("get history")
	        log_group.sendMsg("[log]" + text)
            break;
        case "log":
            console.log("get log")
	        log_group.sendMsg("[Warn]" + text)
            break;
        case "send":
	        log_group.sendMsg(text)
	        talk_group.sendMsg(text)
            break;
   }
    fs.appendFile('./log.txt',text + "\n",'utf8',function(err){if(err){}})
    }
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
    res.end(send_text)
	if(send_text !== ""){	
    log_group.sendMsg("消息已推送")
    }
	send_text = ""
});

httpS.listen( 1024 ,'127.0.0.1', ()=>{
	console.log("http服务器建立完成！");
	
});//监听http服务器

process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack);
});