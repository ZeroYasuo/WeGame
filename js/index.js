

// jQuery 的入口函数
$(function () {

  console.log(111)
  // 1. 根据 cookie 中的信息
  // 判断用户信息面板中显示哪一个内容
  const nickname = getCookie('nickname')

  // 2. 根据 nickname 信息进行判断
  if (nickname) {
    // 表示存在, 不是 undefined
    $('.off').addClass('hide')
    $('.on').removeClass('hide').text(`欢迎您: ${nickname}`)

    // 才制作购物车联动
    setCartNum()
  } else {
    // 表示不存在, 是 undefined
    $('.off').removeClass('hide')
    $('.on').addClass('hide')
  }

  // 3. 拿到购物车里面有多少数据
  // 填充到指定位置
  function setCartNum() {
    // 拿到 localStorage 里面的那个数组
    const cart = JSON.parse(window.localStorage.getItem('cart')) || []
    // 3-2. 判断 cart 是一个 [], 那么就用 0 填充到指定位置
    if (!cart.length) {
      $('.cartNum').html('0')
      return
    }

    // 3-3. 能来到这里, 表示购物车里面有数据
    // 需要把每一条数据的 cartNum 叠加咋一起
    let count = 0
    cart.forEach(item => count += item.cart_number - 0)
    $('.cartNum').html(count)
  }
})




class Banner {
  constructor (ele){
    this.ele = document.querySelector(ele)
    this.imgBox = this.ele.querySelector('.imgBox')
    this.pointBox = this.ele.querySelector('.pointBox')
    this.index = 0
    this.timer = 0
    this.init()
  }
  init(){
  this.autoPlay()
  this.overOut()
  this.pointEvent()
  this.changePage()
  }
  changeOne(type){
    this.imgBox.children[this.index].classList.remove('active')
    this.pointBox.children[this.index].classList.remove('active')

    if (type===true){
      this.index++
    }else if (type === false){
      this.index--
    }else{
      this.index = type
    }

    if(this.index >= this.imgBox.children.length) this.index = 0
    if(this.index < 0) this.index = this.imgBox.children.length - 1

    this.imgBox.children[this.index].classList.add('active')
    
    this.pointBox.children[this.index].classList.add('active')
  }

  autoPlay(){
    this.timer = setInterval(()=>{
      this.changeOne(true)
    },2500)
  }

  overOut(){
    this.ele.addEventListener('mouseover',()=>clearInterval(this.timer))
    this.ele.addEventListener('mouseout',()=> this.autoPlay())
  }

  pointEvent(){
    this.pointBox.addEventListener('mouseover',e =>{
      clearInterval(this.timer)
      e = e || window.event
      const target = e.target || e.srcElement

      // clearInterval(this.timer)
      if(target.nodeName === 'LI'){
        const i = target.getAttribute('i')
        this.changeOne(i)
      }
    })
  }

  changePage (){
    document.addEventListener('visibilitychange',()=>{
      const state = document.visibilityState

      if (state === 'hidden') clearInterval(this.timer)
      if(state === 'visible') this.autoPlay()
    })
  }
}

