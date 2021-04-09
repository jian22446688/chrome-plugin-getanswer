/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-12-16 17:59:02
 * @FilePath: \excel-to-jsone:\work\vue-project\alien-docs\note\jy\chrome-plugin-getanswer\js\content-script.js
 */
const CBaseUrl = window.location.protocol + '//' + window.location.host
var ccpanel = null
$(function() {
  console.log('这是 simple-chrome-plugin-demo 的content-script！')
  // 添加页面
  initCustomPanel()
})

function initCustomPanel() {
  console.log('初始化提示卡')
  var btn = document.createElement('div')
  btn.className = 'cc-panel-btn'
  btn.innerText = '显示'
  btn.id = 'ccanswerShow'
  if (ccpanel) return
  ccpanel = document.createElement('div')
  ccpanel.id = 'chrome-panel-warp'
  ccpanel.className = 'chrome-plugin-demo-panel'
  ccpanel.innerHTML = `<div id="my_custom_panel"></div>`
  document.body.appendChild(btn)
  document.body.appendChild(ccpanel)
}

function createBtnhide() {
  setTimeout(() => {
    $('#btn_hideanswer').click(() => {
      $('#chrome-panel-warp').hide()
    })
    $('#ccanswerShow').click(() => {
      $('#chrome-panel-warp').show()
    })
  }, 10)
}

// 显示课程列表
function showClassList() {
  if (!ccpanel) {
    initCustomPanel()
  }
  let shtml = $('#ci-derectory .xue-tt a').not('.right a')
  console.log('html', shtml)
  let html = `
	<div id="ccanswer-panle" class="cc-answer">
		<h3>课程数：${shtml.length} 课 <span id="btn_hideanswer" class="cc-panel-btn-hide">隐藏</span></h3>
		<div><a id="open_class" href="#" style="#0000cc">打开所有的课程</a></div>
	</div>
	`
  $('#my_custom_panel').html(html)

  $('#open_class').click(e => {
    for (let i = 0; i < shtml.length; i++) {
      const element = shtml[i]
      openUrlNewTab(element.href)
    }
  })

  createBtnhide()
}

// 创建答案
function createAnswer(res) {
  if (!ccpanel) {
    initCustomPanel()
  }
  console.log('listccc', res)
  let ans = res.list || []
  let lis = ''
  if (ans.length > 0) {
    ans.forEach((e, i) => {
      let tStr = e.type === 'dan' ? '单选' : '多选'
      lis += `<li>问题 <span class="cc-red">${i +
        1}</span>，${tStr} — 答案：<span class="cc-red">${e.answer.join(
        ','
      )}</span></li>`
    })
  } else {
    $('#my_custom_panel').html('<h2>未获取到答案</h2>')
    return
  }
  let html = `
	<div id="ccanswer-panle" class="cc-answer">
		<h3>正确答案 <span id="btn_hideanswer" class="cc-panel-btn-hide">隐藏</span></h3>
		<ul>
			${lis}
		</ul>
	</div>
	`
  $('#my_custom_panel').html(html)
  createBtnhide()
}

function addClassCart(res) {
  console.log('添加课程')
  let valStr = res
  let vals = valStr.split(',')
  let addIndex = 0
  addCart()
  function addCart() {
    if (addIndex >= vals.length) {
      alert('课程添加成功')
      openUrlNewTab(CBaseUrl + '/index.php?a=shopCart&m=Index')
      return
    }
    const id = vals[addIndex]
    const params = {
      act: 'cart_add',
      iid: id,
      type: 1
    }
    $.post(CBaseUrl + '/index.php?m=Api&agency=3&cart_add', params, res => {
      addCart()
      chrome.extension.sendMessage(
        {
          cmd: 'add_cart_tip',
          data: `已添加< ${id} >课程`
        },
        function(response) {
          console.log('background', response)
        }
      )
      addIndex++
    })
  }
}

// 新标签打开某个链接
function openUrlNewTab(url) {
  // chrome.tabs.create({url: url});
  window.open(url)
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    '收到来自 ' +
      (sender.tab
        ? 'content-script(' + sender.tab.url + ')'
        : 'popup或者background') +
      ' 的消息：',
    request
  )
  let cmd = request.cmd
  switch (cmd) {
    case 'cc_answer':
      createAnswer(request.data)
      break

    case 'cc_add_cart':
      addClassCart(request.data)
      break

    case 'cc_open_cart':
      openUrlNewTab(CBaseUrl + '/index.php?a=shopCart&m=Index')
      break

    case 'cc_show_class_list':
      showClassList()
      break

    default:
      sendResponse('我收到你的消息了：' + JSON.stringify(request))
      break
  }
  // 下面是我们要添加的一行代码
  return true
})
