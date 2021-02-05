
class Banner2 {
  constructor (ele) {
    // 1. 范围元素
    this.ele = document.querySelector(ele)

    // 2. imgBox
    this.imgBox = this.ele.querySelector('.imgBox')

    // 3. pointBox
    this.pointBox = this.ele.querySelector('.pointBox')

    // 4. leftRightBox
    this.leftRightBox = this.ele.querySelector('.leftRight')

    // 5. 可视窗口宽度
    this.banner_width = this.ele.clientWidth

    // 6. 准备索引
    this.index = 1

    // 7. 准备接受定时器返回值
    this.timer = 0

    // 8. 准备一个开关
    this.flag = true

    // 直接启动入口函数
    this.init()
  }

  // 0. 入口函数
  init () {
    this.setPoint()
    this.copyEle()
    this.autoPlay()
    this.overOut()
    this.leftRight()
    this.pointEvent()
    this.changePage()
  }

  // 1. 设置焦点
  setPoint () {
    // 1-1. 拿到 imgBox 里面的子元素数量
    // 忘了, 直接去查
    const pointNum = this.imgBox.children.length

    // 1-2. 根据 pointNum 生成对应的 li
    const frg = document.createDocumentFragment()
    for (let i = 0; i < pointNum; i++) {
      // 不记得怎么生成节点, 查
      const li = document.createElement('li')
      if (i === 0) li.className = 'active'
      li.setAttribute('page_index', i)
      // 生成完毕就直接放到 pointBox 里面
      frg.appendChild(li)
    }

    // 1-3. 放到 pointBox 里面
    this.pointBox.appendChild(frg)

    // 1-4. 把 pointBox 设置的宽一些
    this.pointBox.style.width = pointNum * (20 + 10) + 'px'
  }

  // 2. 复制元素
  copyEle () {
    // 2-1. 复制第一个和最后一个
    const first = this.imgBox.firstElementChild.cloneNode(true)
    const last = this.imgBox.lastElementChild.cloneNode(true)

    // 2-2. 分别放在 imgBox 的指定位置
    this.imgBox.appendChild(first)
    this.imgBox.insertBefore(last, this.imgBox.firstElementChild)

    // 2-3. 调整一下 imgBox 的宽度
    this.imgBox.style.width = this.imgBox.children.length * 100 + '%'

    // 2-4. 调整一下 imgBox 的位置
    this.imgBox.style.left = -this.banner_width + 'px'
  }

  // 3. 自动轮播
  autoPlay () {
    this.timer = setInterval(() => {
      // 3-1. 调整索引
      this.index++

      // 3-2. 需要运动到下一张
      move(this.imgBox, { left: -this.index * this.banner_width }, this.moveEnd.bind(this))
    }, 2000)
  }

  // 4. 运动结束
  moveEnd () {
    // 4-1. 判定 index 到了最后一张了, 瞬间拉回到第一张
    if (this.index === this.imgBox.children.length - 1) {
      this.index = 1

      this.imgBox.style.left = -this.index * this.banner_width + 'px'
    }

    // 4-2. 判定 index 到了 [0] 这一张, 瞬间定位到倒数第二张
    if (this.index === 0) {
      this.index = this.imgBox.children.length - 2

      this.imgBox.style.left = -this.index * this.banner_width + 'px'
    }

    // 4-3. 切换焦点的 active 类名
    for (let i = 0; i < this.pointBox.children.length; i++) {
      this.pointBox.children[i].classList.remove('active')
    }
    this.pointBox.children[this.index - 1].classList.add('active')

    this.flag = true
  }

  // 5. 移入移出
  overOut () {
    // 5-1. 给 this.ele 绑定移入事件, 关闭定时器
    this.ele.addEventListener('mouseover', () => clearInterval(this.timer))

    // 5-2. 给 this.ele 绑定移出事件, 从新自动轮播
    this.ele.addEventListener('mouseout', () => this.autoPlay())
  }

  // 6. 左右按钮切换
  // 事件委托的形式
  leftRight () {
    // 给 this.leftRightBox 绑定事件
    this.leftRightBox.addEventListener('click', e => {
      e = e || window.event
      const target = e.target || e.srcElement

      if (target.className === 'left') {
        if (!this.flag) return

        this.flag = false

        this.index--

        move(this.imgBox, { left: -this.index * this.banner_width }, this.moveEnd.bind(this))
      }

      if (target.className === 'right') {
        if (!this.flag) return

        this.flag = false

        this.index++

        move(this.imgBox, { left: -this.index * this.banner_width }, this.moveEnd.bind(this))
      }
    })
  }

  // 7. 焦点切换
  pointEvent () {
    // 给 pointBox 绑定事件
    this.pointBox.addEventListener('click', e => {
      e = e || window.event
      const target = e.target || e.srcElement

      if (target.nodeName === 'LI') {
        if (!this.flag) return

        this.flag = false

        // 拿到元素身上记录的索引
        const page_index = target.getAttribute('page_index') - 0
        this.index = page_index + 1
        move(this.imgBox, { left: -this.index * this.banner_width }, this.moveEnd.bind(this))
      }
    })
  }

  // 8. 切换页面
  changePage () {
    // 给 document 绑定一个叫做 visibilitychange 的事件
    document.addEventListener('visibilitychange', () => {
      const state = document.visibilityState

      if (state === 'hidden') {
        clearInterval(this.timer)
      }

      if (state === 'visible') {
        this.autoPlay()
      }
    })
  }
}






var shili = {
  name: '实例对象',
  fn: function () {
    console.log(this)
  }
}

// 利用实例拿到 fn 函数的地址, () 是把它当做函数调用了
// this => shili
// shili.fn()

function m(fun) {
  // fun 接受的是 shili 对象身上 fn 函数的地址
  // 从现在开始 m 函数内部的形参 fun 和 全局的 shili.fn 调用的是一个函数
  console.log('我是 m 函数')
  // 利用形参 fun 来调用 shili 身上的 fn 函数
  // this => window
  fun()
}

// 调用 m 函数
// 拿到实例身上的 fn 函数地址, 但是没有调用
// 把这个地址当做参数传递到了 m 函数内部
// 我并不是要执行函数, 而是要把函数给你

// 给你一个函数, 我给你的函数已经把 this 指向锁定成 shili
// 不管你怎么调用, 函数内部的 this 一定指向 shili
// m(shili.fn.bind(shili))


/*
  问题原因:
    + 当做参数传递进去以后, 调用方式改变了
    + 导致 this 指向不一样了
  解决问题:
    + 强行改变 this 指向
    + 不管你原先指向哪里, 我让你指向谁, 你就指向谁
      + call: 立即调用函数
      + apply: 立即调用函数
      + bind: 不会立即调用函数, 会返回一个改变好 this 指向的新函数
    + 需求: 拿到 shili 身上的 函数的 地址, 把 地址传递进去
*/
