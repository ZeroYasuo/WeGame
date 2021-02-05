
$(function(){

  const cart = []

  let info = null
  
  const id = getCookie('goods_id')

  getGoodsInfo()

  async function getGoodsInfo(){
    const goodsInfo = await $.get('./server/getGoodsInfo.php',{goods_id : id},null,'json')

    info = goodsInfo.info

    info.cart_number = 1

    // console.log(info)

    cart.push(info)

    // const cart = JSON.parse(window.localStorage.getItem('cart')) || []

    window.localStorage.setItem('cart',JSON.stringify(cart))



    $('.items').on('click', '.addCart', function () {
      // 4-2. 拿到 localStorage 里面有没有数组
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []
      // 多一个拿到 id 的操作
      const id = $(this).data('id')
    
      // console.log('aa')
      // 4-3. 判断一下 cart 数组里面有没有这个数据
      const flag = cart.some(item => item.goods_id == id)
      if (flag) {
        // 4-4. 如果有这个数据拿到这个信息
        const cart_goods = cart.filter(item => item.goods_id == id)[0]
        cart_goods.cart_number = cart_goods.cart_number - 0 + 1
      } else {
        // 拿到当前商品 id 所属的信息
        info.cart_number = 1
      }
    
      // 4-5. 添加完毕还要存储到 localStorage 里面
      // window.localStorage.setItem('cart', JSON.stringify(cart))
    
      window.location.href = './cart.html'
    })
  }
  

  

})




function Enlarge(ele) {
  this.ele = document.querySelector(ele)
  this.show = this.ele.querySelector('.show')
  this.mask = this.ele.querySelector('.mask')
  this.enlarge = this.ele.querySelector('.enlarge')
  this.show_width = this.show.clientWidth
  this.show_height = this.show.clientHeight
  this.enlarge_width = parseInt(window.getComputedStyle(this.enlarge).width)
  this.enlarge_height = parseInt(window.getComputedStyle(this.enlarge).height)
  this.bg_width = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[0])
  this.bg_height = parseInt(window.getComputedStyle(this.enlarge).backgroundSize.split(' ')[1])
  this.list = this.ele.querySelector('.list')

  this.init()
}


Enlarge.prototype.init = function () {

  this.setScale()
  this.overOut()
  this.move()
  this.change()
}

Enlarge.prototype.setScale = function () {
  this.mask_width = this.show_width * this.enlarge_width / this.bg_width
  this.mask_height = this.show_height * this.enlarge_height / this.bg_height

  this.mask.style.width = this.mask_width + 'px'
  this.mask.style.height = this.mask_height + 'px'
}

Enlarge.prototype.overOut = function () {
  this.show.addEventListener('mouseover', () => {
    this.mask.style.display = 'block'
    this.enlarge.style.display = 'block'
  })

  this.show.addEventListener('mouseout', () => {
    this.mask.style.display = 'none'
    this.enlarge.style.display = 'none'
  })
}

Enlarge.prototype.move = function () {
  this.show.addEventListener('mousemove', e => {
    e = e || window.event

    let x = e.offsetX - this.mask_width / 2
    let y = e.offsetY - this.mask_height / 2

    if (x <= 0) x = 0
    if (y <= 0) y = 0
    if (x >= this.show_width - this.mask_width) x = this.show_width - this.mask_width
    if (y >= this.show_height - this.mask_height) y = this.show_height - this.mask_height

    this.mask.style.left = x + 'px'
    this.mask.style.top = y + 'px'

    const bg_x = this.enlarge_width * x / this.mask_width
    const bg_y = this.enlarge_height * y / this.mask_height

    this.enlarge.style.backgroundPosition = `-${ bg_x }px -${ bg_y }px`
  })

}

Enlarge.prototype.change = function () {

  this.list.addEventListener('click', e => {
    e = e || window.event
    const target = e.target || e.srcElement

    if (target.nodeName === 'IMG') {
      const show_url = target.getAttribute('show')
      const enlarge_url = target.getAttribute('enlarge')

      console.log(enlarge_url)
      this.show.firstElementChild.src = show_url
      this.enlarge.style.backgroundImage = `url(${ enlarge_url })`

      for (let i = 0; i < this.list.children.length; i++) {
        this.list.children[i].classList.remove('active')
      }

      target.parentElement.classList.add('active')
    }
  })
}



