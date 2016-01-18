
//去空格
function delHtmlTag(str)
{
    var str=str.replace(/<\/?[^>]*>/gim,"");//去掉所有的html标记
    var result=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    return  result.replace(/\s/g,"");//去除文章中间空格
}

// // 获取输入的订单号
// function getOrderIdAll(){
//     chrome.storage.sync.get('OrderIdAll', function(data) {                                
//         if(data){
//             return data.OrderIdAll;               
//         }
//         return false; 
                                                             
//    });
// }


//获取跳转的url
function openTaoBaoUrl(ID){
   var url = 'https://buyertrade.taobao.com/trade/detail/trade_item_detail.htm?spm=a1z09.2.0.0.Sx0xKe&bizOrderId='+ID;   
   return url;    
}

//停止
function stopCrap(){
    
    chrome.storage.sync.remove('sl',function(){
        PL.open({
            content: '暂停成功',
            time: 2
        });
    });
}


// 添加订单号
function addOrderCode(){
    
    var textartD = '<div class="input-field col s12">'+
          '<textarea id="textarea1" class="textarea"></textarea>'+
          ''+
        '</div><button class="waves-effect waves-light btn closediy">确定</button>';
    
    
    var pagei = PL.open({
        type: 1, //1代表页面层
        content: textartD,
        style: 'width:660px; height:400px; border:none;',
        success: function(oPan){
            var cla = 'getElementsByClassName';
            oPan[cla]('closediy')[0].onclick = function(){
                
                var codeALl = $.trim(oPan[cla]('textarea')[0].value).replace(/\s/g,"").replace(/\s/g,"").replace(/\n/g,"");      
                
                
                var bizOrderIdAll = codeALl.split(',');
                
              
               var obj = {};
               
               obj.OrderIdAll = bizOrderIdAll
                 
                 chrome.storage.sync.set(obj, function(){
                     
                     
                     PL.open({
                        title: '添加成功',
                        content: '是否打开第一个订单详细页面',
                        btn: ['嗯', '不要'],
                        yes: function(index){
                            
                            
                            
                            chrome.storage.sync.get('OrderIdAll', function(data) {
                                
                                if(data){
                                   window.open(openTaoBaoUrl(data.OrderIdAll[0]));     
                                }
                              
                                
                            });
                            
                            return;
                                          
                        }
                    });
                    
                }); 
                
                
                
            }
        }
    });
}




//抓去数据写入

function postOrderInfo(msdata){
   
   var info = {
        uName : msdata.uName,
        Ocode : msdata.Ocode,
        Ycode : msdata.Ycode,
        Zcode : msdata.Zcode,
        UMsg  : msdata.UMsg,
        Ycop  : msdata.Ycop
   };   
    
   var  obj = {};  
    
    chrome.storage.sync.get('orderInfoAll', function(data) {               
        console.log(data.orderInfoAll.length);                      
        if(data.orderInfoAll){            
            console.log('追加');
            obj.orderInfoAll = data.orderInfoAll;          
            obj.orderInfoAll.push(info);    
            
        }else{
           obj.orderInfoAll = [];          
           obj.orderInfoAll.push(info);     
            console.log('初始');   
        }   
        
       chrome.storage.sync.set(obj,function(data2){            
            PL.open({
                content: '成功写入',
                time: 2
            });
        })
                                     
                                
    });
    
    

    
    
}


// chrome.storage.sync.get('orderInfoAll', function(data) {
            
//             console.log(data.orderInfoAll);                                     
                            
// });




// 设置数据
function storageSet(obj,call){
    chrome.storage.sync.set(obj,function(data){
        if(call){
            call()
        }else{
            return data;
        }
    })
}

// 获取数据

function storageGet(info,call){
    chrome.storage.sync.get(info, function(data) {                               
                     
             call(data);                   
    });
}



// 清除数据

function storageDel(info,call){
    chrome.storage.sync.remove(info, function(data) {                               
             if(call){
                 call(data);
             }   
                                
    });
}

//删除订单号

function orderIdDel(call){
    
    chrome.storage.sync.get('OrderIdAll', function(data) {                               
                     
             
        var _OrderIdAll = _.drop(data.OrderIdAll); 
        
        var obj = {};    
            obj.OrderIdAll = _OrderIdAll;                
            chrome.storage.sync.set(obj, function(){
                
    }) 
          
 });
 
}
 

 
 // 分表存储 id 索引
 
 function dBOrderTbIndex(id,info){ 
     
     var obj = {};
        obj.orderTbIndex = [];
     chrome.storage.sync.get('orderTbIndex', function(data) {               
                    
        if(data.orderTbIndex){            
            
          
            obj.orderTbIndex = data.orderTbIndex;
            obj.orderTbIndex.push(id)
            
        }else{
            console.log("2");
            obj.orderTbIndex.push(id);
         
        }   
        
        
        chrome.storage.sync.set(obj,function(data2){            
                // PL.open({
                //     content: '成功写入id',
                //     time: 2
                // });
                
                
                DBCreatTb(id,info)
                
         });      
                                     
                                
    });
    
 }
 
 // 创建表 存储信息
 
 function DBCreatTb(TBid,info){
     
     var obj = {};
     
     obj[TBid] = info;
   
        
    chrome.storage.sync.set(obj,function(data2){            
            PL.open({
                content: '成功写入info',
                time: 2
            });
    });      
                                     
 }




// 获取 所有表

function DBOrderTbAll(call){
    
    chrome.storage.sync.get('orderTbIndex', function(data) { 
        if(data.orderTbIndex){
            
            console.log(data.orderTbIndex);
            
            call(data.orderTbIndex);

        }
        
    })

}


// DBOrderTbAllDel();
//删除表索引

function DBOrderTbAllDel(call){
    chrome.storage.sync.remove('orderTbIndex', function(data) { 
        PL.open({
                content: '删除成功',
                time: 2
            });
    })
}

// 遍历所有关联 表信息

function DBOrderInfoTbAll(){
    
    
    DBOrderTbAll(function(data){
        
                
        
    })
    
}
 
