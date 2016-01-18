 var num = new Date().getTime();

console.log("已经载入1P..");
PD.getScript("//nnn.li/panli.js?v=panli"+num+"", function(data, status, jqxhr) {

    console.log("已经载入2P.."); 
    
    PD(function(){  
                
                var _hostName = window.location.hostname;           
                
                
                startL();
                
                                
                var  start =  chrome.storage.sync.get(["sl"],function(date){
                    
                    if(date.sl){
                        console.log(date);           
                        
                        sedPosMsg(date);
                    }
                
                })   
    
    
    });
 
});





function startL(){
    
    
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {        
            if (request.greeting == "startInfo")//判断是否为要处理的消息
            sendResponse({farewell: "开始执行"});            
            chrome.storage.sync.set({'sl': '开始'},function(){console.log("保存完毕"); sedPosMsg();})
            
     });
}


function sedPosMsg(data){ 
   
    var _host = window.location.hostname;
    
    var  mmsg;
    
    if(_host == "trade.tmall.com"){
        mmsg = tmallElement();
    }else{
        mmsg = taobaoElement();
    }
     
   chrome.runtime.sendMessage(mmsg);
    
   setTimeout(function(){
       locationUrlGo();       
   },5000)
          
  
}
     
     
function locationUrlGo(){
    
    window.location.href = window.location.href;
}    
   
// 获取输入的订单号
function getOrderIdAll(){
    chrome.storage.sync.get('OrderIdAll', function(data) {                                
        if(data){
            return data.OrderIdAll;               
        }
        return false; 
                                                             
   });
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

// 天猫页面数据
function tmallElement(){

    var uname = PD.trim(PD('.address-detail').text()).split('，')[0];
    
    var msg = {
        type: "taobao-information",           
        uName : uname,
        Ocode : GetQueryString('bizOrderId'),
        Ycode : PD(".trade-detail-logistic").attr('data-mail-no'),
        Zcode : PD('.small-drop-down tr').text().replace(/\n/g,'||').replace(/\s/g,"").split('||')[2],
        UMsg : PD('.message-detail').text(),
        Ycop : PD(".trade-detail-logistic").attr('data-company-name')
     };
       
        
      return msg;
}



// 淘宝页面数据
function taobaoElement(){

    var uname = PD.trim(PD('.addr_and_note').find('dd').text()).split('，')[0];
    
    var msg = {
        type: "taobao-information",           
        uName : uname,
        Ocode : PD.trim(PD('.misc-info').text()).replace(/\n/g,'||').split('||')[4],
        Ycode : PD.trim(PD('.logistics-id').text()),
        Zcode : PD.trim(PD('.misc-info').text()).replace(/\n/g,'||').split('||')[8],
        UMsg : PD('#J_ExistMessage').text(),
        Ycop : PD.trim(PD('.logistics-company').text())
     };
       
        
     return msg;
}

