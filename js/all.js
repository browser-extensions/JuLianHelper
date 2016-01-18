//去空格
function delHtmlTag(str)
{
    var str=str.replace(/<\/?[^>]*>/gim,"");//去掉所有的html标记
    var result=str.replace(/(^\s+)|(\s+$)/g,"");//去掉前后空格
    return  result.replace(/\s/g,"");//去除文章中间空格
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