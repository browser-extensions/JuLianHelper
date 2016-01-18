
$(function () {
   
//开始
  $("#startId").on("click",function(){
     contentScript();
  });
  
//停止 
  $("#stopId").on("click",function(){
     stopCrap();
  });
//添加订单 
  $("#addOrderId").on("click",function(){
     addOrderCode();
  });
//清除
  $("#clearId").on("click",function(){
     
  });
// 打开页面
  $("#openPageId").on("click",function(){
     
  });
})



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
                
                console.log(bizOrderIdAll);
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





/**
* 停止
**/
function stopCrap(){
    
    chrome.storage.sync.remove('sl',function(){
        PL.open({
            content: '暂停成功',
            time: 2
        });
    });
}

// 注入开始
function contentScript(){
    
    chrome.tabs.query(
      {active: true, currentWindow: true}, 
      function(tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id, 
             {greeting: "startInfo"}, 
             function(response) {                 
                 PL.open({
                    content: response.farewell,
                    time: 2
                });
                   
                  
         });
    });
}



chrome.runtime.onMessage.addListener(function(request, sender, sendRequest){
	if(request.type!=="taobao-information")
	return;
	
	
    
     var str = '<tr>'+
                '<td>'+ request.Ocode +'</td>'+
                '<td>'+ request.Zcode +'</td>'+
                '<td>'+ request.uName +'</td>'+
                '<td>'+ request.Ycode +'</td>'+
                '<td>'+ request.Ycop +'</td>'+
                '</tr>';
              
    $(".order-tbody").append(str);
    

});



function render_search_result(result, isBulk) {
    var tbody = $('#tbody-hosts'),
        html = '';
    isBulk = typeof isBulk === 'undefined' ? tbody.is('.needBulk') : isBulk;
    if (result.length == 0) {
        html = '<tr><td colspan="6">No Results</td></tr>';
    } else {
        $(result).each(function (i, v) {
            v.tags = v.tags ? (v.tags.join(', ')) : '';
            v.status_class = v.status ? 'status-enabled' : 'status-disabled';
        });
        html = $('#host-item').extendObj(result);
        tbody.html( html );
    }
}



//获取跳转的url
function openTaoBaoUrl(ID){
   var url = 'https://buyertrade.taobao.com/trade/detail/trade_item_detail.htm?spm=a1z09.2.0.0.Sx0xKe&bizOrderId='+ID;   
   return url;    
}