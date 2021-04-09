/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-12-16 17:59:02
 * @FilePath: \excel-to-jsone:\work\vue-project\alien-docs\note\jy\chrome-plugin-getanswer\js\popup.js
 */
console.log('你好，我是popup！')
let cbg = chrome.extension.getBackgroundPage()
let cprotocol = cbg.document.location.protocol
let chost = cbg.document.location.host
const ccBaseUrl = cprotocol + '//' + chost

$('#addoderbtn').click(() => {
  let valStr = $('#addoderinput').val()
  if (!valStr) {
    alert('请输入课程ids')
    return
  }
  sendMessageToContentScript(
    {
      cmd: 'cc_add_cart',
      data: valStr
    },
    res => {}
  )
})

$('.ck-home').click(function() {
  let href = $(this).attr('href')
  chrome.tabs.create({ url: href })
})

// 打开订单页面
$('#open_oderPages').click(() => {
  sendMessageToContentScript(
    {
      cmd: 'cc_open_cart',
      data: {}
    },
    res => {}
  )
})

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null)
  })
}

// 获取当前选项卡ID
function getCurrentTab(callback) {
  chrome.tabs.query({ active: true }, function(tabs) {
    if (callback) {
      callback(tabs)
    }
  })
}

// 发送消息
// let mes = {
//   cmd: 'cc_open_cart',
//   data: {}
// }
// sendMessageToContentScript(mes, res => {});

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
  getCurrentTabId(tabId => {
    chrome.tabs.sendMessage(tabId, message, function(response) {
      if (callback) callback(response)
    })
  })
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
  getCurrentTabId(tabId => {
    chrome.tabs.executeScript(tabId, { code: code })
  })
}

// 添加订单消息
function showAddCartTip(e) {
  $('#addcarttip').text(e)
}

// 监听来自background的消息
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  const { cmd, data } = request
  switch (cmd) {
    case 'cc_add_cart':
      showAddCartTip(data)
      break
    default:
      sendResponse('popup返回值')
      break
  }
  return true
})

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log('收到来自content-script的消息：');
  // console.log(request, sender, sendResponse);

  sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request))
  return true
})
