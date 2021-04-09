/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-12-16 17:59:02
 * @FilePath: \excel-to-jsone:\work\node-project\chrome-plugin-demo-master\simple-chrome-plugin-demo\js\background.js
 */
//-------------------- 右键菜单演示 ------------------------//

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const { cmd, data } = request
  console.log('收到来自content-script的消息：', cmd)
  switch (cmd) {
    case 'add_cart_tip':
      send_tip(data)
      break
    default:
      break
  }

  sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request))
  return true
})

function send_tip(data) {
  chrome.extension.sendMessage(
    {
      cmd: 'add_cart_tip',
      data: data
    },
    function(response) {
      console.log('background', response)
    }
  )
}

// 新标签打开某个链接
function openUrlNewTab(url) {
  chrome.tabs.create({ url: url })
}

// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(
  res => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
    let url = res.url
    if (url.indexOf('cc_test=123') > 0) return true

    if (url.indexOf('/index.php?m=Api&agency=3&test_show') > 0) {
      let req = res.requestBody
      let data = req.formData || {}
      Object.keys(data).map(e => {
        data[e] = data[e].toString()
      })
      getaxios(url, data)
    } else if (
      url.indexOf(
        '/index.php?m=Api&agency=3&act=class_catalog&act=class_catalog'
      ) > 0
    ) {
      sendMessageToContentScript(
        {
          cmd: 'cc_show_class_list'
        },
        response => {}
      )
    }

    return true
    // },{'urls':["*://*/index.php?m=Api&agency=3&test_show"]},['requestBody']);
  },
  { urls: ['<all_urls>'] },
  ['requestBody']
)

function getaxios(url, data) {
  let reqUrl = url
  if (url.lastIndexOf('?') !== -1) {
    reqUrl += '&cc_test=123'
  } else {
    reqUrl += '?cc_test=123'
  }

  $.post(reqUrl, data, function(res) {
    console.log(res)
    let comData = {
      cmd: 'cc_answer',
      data: JSON.parse(res)
    }
    sendMessageToContentScript(comData, response => {
      if (response) {
        console.log('收到来自content-script的回复', response)
      }
    })
  })
}
//测试前台掉后台

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
  getCurrentTabId(tabId => {
    chrome.tabs.sendMessage(tabId, message, function(response) {
      if (callback) callback(response)
    })
  })
}

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null)
  })
}
