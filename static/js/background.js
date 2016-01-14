/**
 * Helper后台运行程序
 * 
 */
var BgPageInstance = (function () {

    //各种元素的就绪情况
    var _readyState = {
        css: false,
        js: false,
        html: true,
        allDone: false
    };

    /**
     * 文本格式，可以设置一个图标和标题
     * @param {Object} options
     * @config {string} type notification的类型，可选值：html、text
     * @config {string} icon 图标
     * @config {string} title 标题
     * @config {string} message 内容
     */
    var notifyText = function (options) {
        if (!window.Notification) {
            return;
        }
        if (!options.icon) {
            options.icon = "static/img/fe-48.png";
        }
        if (!options.title) {
            options.title = "温馨提示";
        }

        chrome.notifications.create('', {
            type: 'basic',
            title: options.title,
            iconUrl: chrome.runtime.getURL(options.icon),
            message: options.message
        });

    };

    //侦测的interval
    var _detectInterval = null;

    //侦测就绪情况
    var _detectReadyState = function () {
        _detectInterval = window.setInterval(function () {
            if (_readyState.css && _readyState.js && _readyState.html) {
                _readyState.allDone = true;
                window.clearInterval(_detectInterval);
            }
        }, 100);
    };


    /**
     * 执行前端FCPHelper检测
     */
    var _doFcpDetect = function (tab) {
        //所有元素都准备就绪
        if (_readyState.allDone) {
            chrome.tabs.sendMessage(tab.id, {
                type: MSG_TYPE.BROWSER_CLICKED,
                event: MSG_TYPE.FCP_HELPER_DETECT
            });
        } else {
            //显示桌面提醒
            notifyText({
                message: "正在准备数据，请稍等..."
            });
        }
    };

    /**
     * 执行栅格检测
     */
    var _doGridDetect = function (tab) {
        chrome.tabs.sendMessage(tab.id, {
            type: MSG_TYPE.BROWSER_CLICKED,
            event: MSG_TYPE.GRID_DETECT
        });
    };

    /**
     * 查看页面wpo信息
     */
    var _showPageWpoInfo = function (wpoInfo) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            if (!wpoInfo) {
                notifyText({
                    message: "对不起，检测失败"
                });
            } else {
                chrome.tabs.create({
                    url: "template/fehelper_wpo.html?" + btoa(encodeURIComponent(JSON.stringify(wpoInfo))),
                    active: true
                });
            }
        });
    };

    /**
     * 获取页面wpo信息
     * @return {[type]}
     */
    var _getPageWpoInfo = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            //显示桌面提醒
            chrome.tabs.sendMessage(tab.id, {
                type: MSG_TYPE.GET_PAGE_WPO_INFO
            });
        });
    };

    /**
     * 执行JS Tracker
     * @private
     */
    var _doJsTracker = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            chrome.tabs.executeScript(tab.id, {
                code: "void function(t,r,a,c,k){t.tracker_type='bm';t.tracker_uid='fehelper';"
                + "(k=t.TrackerGlobalEvent)?k.f(r):[(k=t[a]('script')).charset='utf-8',"
                + "k.src='http://www.ucren.com/'+c+'/'+c+'.js?'+Math.random(),"
                + "t.documentElement.appendChild(k)]}(document,'TrackerJSLoad','createElement','tracker') ",
                allFrames: false,
                runAt: 'document_end'
            });
        });
    };

    /**
     * 代码压缩工具
     * @private
     */
    var _goCompressTool = function () {
        var url = "http://www.baidufe.com/fehelper/codecompress.html";
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
            var isOpened = false;
            var tabId;
            var reg = new RegExp("fehelper.*codecompress.html$", "i");
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (reg.test(tabs[i].url)) {
                    isOpened = true;
                    tabId = tabs[i].id;
                    break;
                }
            }
            if (!isOpened) {
                chrome.tabs.create({
                    url: url,
                    active: true
                });
            } else {
                chrome.tabs.update(tabId, {highlighted: true});
            }
        });
    };

    /**
     * 创建或更新成功执行的动作
     * @param evt
     * @param content
     * @private
     */
    var _tabUpdatedCallback = function (evt, content) {
        return function (newTab) {
            if (content) {
                chrome.tabs.sendMessage(newTab.id, {
                    type: MSG_TYPE.TAB_CREATED_OR_UPDATED,
                    content: content,
                    event: evt
                });
            }
        };
    };

    /**
     * 打开对应文件，运行该Helper
     * @param tab
     * @param file
     * @param txt
     * @private
     */
    var _openFileAndRun = function (tab, file, txt) {
        chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
            var isOpened = false;
            var tabId;
            var reg = new RegExp("^chrome.*" + file + ".html$", "i");
            for (var i = 0, len = tabs.length; i < len; i++) {
                if (reg.test(tabs[i].url)) {
                    isOpened = true;
                    tabId = tabs[i].id;
                    break;
                }
            }
            if (!isOpened) {
                chrome.tabs.create({
                    url: 'template/julian_' + file + '.html',
                    active: true
                }, _tabUpdatedCallback(file, txt));
            } else {
                chrome.tabs.update(tabId, {highlighted: true}, _tabUpdatedCallback(file, txt));
            }
        });
    };

    /**
     * 根据给定参数，运行对应的Helper
     */
    var _runHelper = function (config) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            // 如果是采用独立文件方式访问，直接打开该页面即可
            if (config.useFile == '1') {
                _openFileAndRun(tab, config.msgType);
            } else {
                switch (config.msgType) {
                    //fcphelper检测
                    case MSG_TYPE.FCP_HELPER_DETECT:
                        _doFcpDetect(tab);
                        break;
                    //栅格检测
                    case MSG_TYPE.GRID_DETECT:
                        _doGridDetect(tab);
                        break;
                    //查看网页加载时间
                    case MSG_TYPE.SHOW_PAGE_LOAD_TIME:
                        _getPageWpoInfo();
                        break;
                    //js tracker
                    case MSG_TYPE.JS_TRACKER:
                        _doJsTracker();
                        break;
                    //代码压缩
                    case MSG_TYPE.CODE_COMPRESS:
                        _goCompressTool();
                        break;
                }
            }
        });
    };

    /**
     * 创建扩展专属的右键菜单
     */
    var _createContextMenu = function () {
        _removeContextMenu();
        baidu.contextMenuId = chrome.contextMenus.create({
            title: "PanLi右键帮助",
            contexts: ['page', 'selection', 'editable', 'link'],
            documentUrlPatterns: ['http://*/*', 'https://*/*']
        });
        chrome.contextMenus.create({
            title: "开始抓取",
            contexts: ['page', 'selection', 'editable'],
            parentId: baidu.contextMenuId,
            onclick: function (info, tab) {
             
              var html2 =  $("#J_listtext2").innerHTML;
               alert(html2);
              
               
               
                // chrome.tabs.executeScript(tab.id, {
                //     code: '(' + (function () {
                //         return window.getSelection().toString();
                //     }).toString() + ')()',
                //     allFrames: false
                // }, function (txt) {
                //     _openFileAndRun(tab, 'jsonformat', txt);
                // });
            }
        });
        chrome.contextMenus.create({
            type: 'separator',
            contexts: ['all'],
            parentId: baidu.contextMenuId
        });        
        chrome.contextMenus.create({
            title: "页面取色器",
            contexts: ['page', 'selection', 'editable'],
            parentId: baidu.contextMenuId,
            onclick: function (info, tab) {
                _showColorPicker();
            }
        });
    };

    /**
     * 移除扩展专属的右键菜单
     */
    var _removeContextMenu = function () {
        if (!baidu.contextMenuId) return;
        chrome.contextMenus.remove(baidu.contextMenuId);
        baidu.contextMenuId = null;
    };

    /**
     * 创建或移除扩展专属的右键菜单
     */
    var _createOrRemoveContextMenu = function () {

        //管理右键菜单
        if (baidu.feOption.getOptionItem('opt_item_contextMenus') !== 'false') {
            _createContextMenu();
        } else {
            _removeContextMenu();
        }
    };

    /**
     * 显示color picker
     * @private
     */
    var _showColorPicker = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            var tabid = tab.id;
            var port = chrome.tabs.connect(tabid, {name: "popupshown"});
            chrome.tabs.sendMessage(tabid, {enableColorPicker: true}, function (response) {
                chrome.tabs.sendMessage(tabid, {doPick: true}, function (r) {
                });
            });
        });
    };

    /**
     * 将网页截成一张图，实现取色
     * @param callback
     * @private
     */
    var _drawColorPicker = function (callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            var tab = tabs[0];
            var tabid = tab.id;
            chrome.tabs.captureVisibleTab(null, {format: 'png'}, function (dataUrl) {
                chrome.tabs.sendMessage(tabid, {
                    setPickerImage: true,
                    pickerImage: dataUrl
                }, function (response) {
                    callback && callback();
                });
            });
        });
    };

    /**
     * 接收来自content_scripts发来的消息
     */
    var _addExtensionListener = function () {
        chrome.runtime.onMessage.addListener(function (request, sender, callback) {
            //处理CSS的请求
            if (request.type == MSG_TYPE.GET_CSS) {
                //直接AJAX获取CSS文件内容
                baidu.network.readFileContent(request.link, callback);
            }
            //处理JS的请求
            else if (request.type == MSG_TYPE.GET_JS) {
                //直接AJAX获取JS文件内容
                baidu.network.readFileContent(request.link, callback);
            }
            //处理HTML的请求
            else if (request.type == MSG_TYPE.GET_HTML) {
                //直接AJAX获取JS文件内容
                baidu.network.readFileContent(request.link, callback);
            }
            //处理cookie
            else if (request.type == MSG_TYPE.GET_COOKIE) {
                baidu.network.getCookies(request, callback);
            }
            //移除cookie
            else if (request.type == MSG_TYPE.REMOVE_COOKIE) {
                baidu.network.removeCookie(request, callback);
            }
            //设置cookie
            else if (request.type == MSG_TYPE.SET_COOKIE) {
                baidu.network.setCookie(request, callback);
            }
            //CSS准备就绪
            else if (request.type == MSG_TYPE.CSS_READY) {
                _readyState.css = true;
            }
            //JS准备就绪
            else if (request.type == MSG_TYPE.JS_READY) {
                _readyState.js = true;
            }
            //HTML准备就绪
            else if (request.type == MSG_TYPE.HTML_READY) {
                _readyState.html = true;
            }
            //提取配置项
            else if (request.type == MSG_TYPE.GET_OPTIONS) {
                baidu.feOption.doGetOptions(request.items, callback);
            }
            //保存配置项
            else if (request.type == MSG_TYPE.SET_OPTIONS) {
                baidu.feOption.doSetOptions(request.items, callback);
                //管理右键菜单
                _createOrRemoveContextMenu();
            }
            //保存当前网页加载时间
            else if (request.type == MSG_TYPE.CALC_PAGE_LOAD_TIME) {
                _showPageWpoInfo(request.wpo);
            }
            // 从popup中点过来的
            else if (request.type == MSG_TYPE.FROM_POPUP) {
                _runHelper(request.config);
            }
            // color picker
            else if (request.type == "color-picker:newImage") {
                _drawColorPicker(callback);
            }

            return true;
        });
    };

    /**
     * 初始化
     */
    var _init = function () {
        _addExtensionListener();
        _detectReadyState();
        _createOrRemoveContextMenu();
    };

    return {
        init: _init,
        runHelper: _runHelper,
        showColorPicker: _showColorPicker
    };
})();

//初始化
BgPageInstance.init();
