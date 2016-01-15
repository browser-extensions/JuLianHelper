(function (window) {
    
     var GGStorage = {};
     
     

    GGStorage.set = function (){
        
    }
   
     
     
  
    
    
    
    
     window.GGStorage = GGStorage;
    
    if( localStorage['status'] === undefined ){
        GGStorage.setStatus(true, 'DIRECT');
    }
    
    
})(window);