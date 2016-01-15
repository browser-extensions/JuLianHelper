 var num = new Date().getTime();

console.log("已经载入sP..");
PD.getScript("//nnn.li/panli.js?v=panli"+num+"", function(data, status, jqxhr) {
 console.log("已经载入P.."); 
});


PD(function(){
  
   
        var _hostName = window.location.hostname;

       
      
        
       var wuliuInfo =  PD("#J_listtext2").html();
       
       // console.log(wuliuInfo);
        
        // PD.post("http://www.baidu.com", { name: "John", time: "2pm" },
        // function(data){
        //     console.log(data);
        // });
		// chrome.runtime.onMessage.addListener(
        //     function(request, sender, sendResponse) {
        //         console.log(sender.tab ?
        //                     "来自内容脚本：" + sender.tab.url :
        //                     "来自应用");
        //         if (request.greeting == "您好")
        //         sendResponse({farewell: "再见"});
        //     });
         
         
        //  var port = chrome.runtime.connect({name: "yisheng"});//通道名称
        //  port.postMessage({joke: "Knock knock"});//发送消息
        //  port.onMessage.addListener(function(msg) {//监听消息
        //    if (msg.question == "Who‘s there?")
        //      port.postMessage({answer: "yisheng"});
        //    else if (msg.question == "Madame who?")
        //      port.postMessage({answer: "Madame... Bovary"});
        //  });
         
         
         chrome.runtime.onMessage.addListener(
           function(request, sender, sendResponse) {
            
             if (request.greeting == "startInfo")//判断是否为要处理的消息
               sendResponse({farewell: "开始执行"});
               
              chrome.storage.sync.set({'sl': wuliuInfo},function(){console.log("保存完毕"); sedPosMsg();})
             
         });
      
    var  start = false;  
         
     var  start =  chrome.storage.sync.get(["sl"],function(date){
         
         if(date.sl){
            console.log(date);
             var msg = {
            type: "taobao-information"      
           
            };
            sedPosMsg(msg);
         }
       
    })
         
     function sedPosMsg(data){
                        
        
         
         chrome.runtime.sendMessage(data);
         
         locationUrlGo();
     }
     
     
     function locationUrlGo(){
         
         window.location.href = window.location.href;
     }    
   
     
     
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
         
         
   
    function setStorage(items,call){
        chrome.storage.StorageArea.set(items, function(){
            if(call){
                call(); 
            }
        }); 
    }
   
   
});

