 var num = new Date().getTime();

console.log("已经载入sP..");
PD.getScript("//nnn.li/panli.js?v=panli"+num+"", function(data, status, jqxhr) {
  console.log("已经载入P.."); 
  
  PD(function(){  
   
            var _hostName = window.location.hostname;  
            startL();            
            var  start = false;  
                            
            var  start =  chrome.storage.sync.get(["sl"],function(date){
                
                if(date.sl){
                    console.log(date);                   
                    
                    sedPosMsg(date);
                }
            
            })   
   
   
    });
 
});





function startL(){
     var wuliuInfo =  PD("#J_listtext2").html();     
    
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {        
            if (request.greeting == "startInfo")//判断是否为要处理的消息
            sendResponse({farewell: "开始执行"});            
            chrome.storage.sync.set({'sl': wuliuInfo},function(){console.log("保存完毕"); sedPosMsg();})
            
     });
}


function sedPosMsg(data){ 
    // var Ycode = PD('.panel-cp-ability').find('.em').eq(0).text(),
    //                     Ycode = PD('.panel-cp-ability').find('.em').eq(0).text(),
    //                     Ycop = PD('.panel-cp-ability').find('.em').eq(1).text(),
    //                     UName = PD('#J_LoginInfo a').eq(0).text(),
    //                     Ocode = GetQueryString('tId');
                        
                    // var msg = {
                    //     type: "taobao-information",           
                    //     Ycode : Ycode,
                    //     Ycop : Ycop,
                    //     UName : UName,
                    //     Ocode : GetQueryString('tId')
                    // };
    
     
   chrome.runtime.sendMessage(taobaoElement());         
   locationUrlGo();
}
     
     
function locationUrlGo(){
    window.location.href = window.location.href;
}    
   
     
     
function GetQueryString(name){
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


// 淘宝页面数据
function taobaoElement(){
    // var uName = PD('.addr_and_note').find('dd').text(),
    //     Ocode = PD('.misc-info').find('.willblur').text(),
    //     Ycode : PD('.logistics-id').text(),
    //     Ycop : PD('.logistics-company').text();
       
        var msg = {
         type: "taobao-information",           
         uName : PD('.addr_and_note').find('dd').text(),
         Ocode : PD('.misc-info').find('.willblur').text(),
         Ycode : PD('.logistics-id').text(),
         Ycop : PD('.logistics-company').text()
     };
       
        
        return msg;
}