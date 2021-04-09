/*
 * @Description: 文件及简介
 * @Author: Cary
 * @Date: 2020-12-18 14:22:52
 * @FilePath: \excel-to-jsone:\work\vue-project\alien-docs\note\jy\chrome-plugin-getanswer\js\lookvideo.js
 */

window.onblur = () => {}
// $('video')[0].playbackRate = 10
// $('video')[0].play()

console.log('ccc 11111')
document.addEventListener('DOMContentLoaded', function(event) {
  console.log('ccc 22222')
  console.log('DOM文档已加载完成')
  setInterval(() => {
    try {
      let vo = $('video')[0]
      vo.playbackRate = 16
      vo.play()
      vo.addEventListener('timeupdate', e => {})
      vo.addEventListener('ended', () => {
        setTimeout(() => {
          window.close()
        }, 1000)
      })
    } catch (e) {
      //TODO handle the exception
      console.log('用鼠标点击屏幕')
    }
  }, 2000)
})
