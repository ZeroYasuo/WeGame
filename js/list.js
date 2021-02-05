$(function () {

  // 0. 准备一个变量, 接受所有的商品信息
  let list = null

  // 0. 准备一个对象, 记录所有可以影响页面主体内容的数据
  const list_info = {
    cat_one: 'all',
    sort_method: '综合',
    sort_type: 'ASC',
    current: 1,
    pagesize: 12
  }

  // 1. 请求一级分类列表
  getCateOne()
  async function getCateOne() {
    // 1-2. 发送请求获取
    const cat_one_list = await $.get('./server/getCateOne.php', null, null, 'json')

    // 1-3. 进行列表渲染
    let str = `<span data-type="all" class="active">全部</span>`

    cat_one_list.list.forEach(item => {
      str += `
        <span data-type="${ item.cat_one_id }">${ item.cat_one_id }</span>
      `
    })

    $('.lrp2').html(str)
  }

  // 2. 请求总页数, 回来渲染分页器
  getTotalPage()
  async function getTotalPage() {
    // 2-1. 请求分页数据
    const totalInfo = await $.get('./server/getTotalPage.php', list_info, null, 'json')

    // 2-2. 渲染分页内容
    // jquery-pagination 插件
    $('.pagination').pagination({
      pageCount: totalInfo.total,
      callback (index) {
        list_info.current = index.getCurrent()
        // 从新请求商品列表
        getGoodsList()
      }
    })
  }

  // 3. 请求商品列表数据
  getGoodsList()
  async function getGoodsList() {
    // 3-1. 请求商品列表
    const goodsList = await $.get('./server/getGoodsList.php', list_info, null, 'json')

    // 给全局变量 list 进行赋值
    list = goodsList.list

    // 3-2. 渲染页面
    let str = ''
    goodsList.list.forEach(item => {
      str += `
      <li>
      <div class="lb_t">
        <img src="${ item.goods_big_logo }" alt="">
      </div>
      <p class="lb_p" data-id="${ item.goods_id }">${ item.goods_name }</p>
      <p class="lb_p1" data-id="${ item.goods_id }">￥${ item.goods_price }&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;详情</p>
    </li>
      `
    })
    $('.list_lb>.l_lb').html(str)
  }

  // 点击事件 
  $('.lrp2').on('click', 'span', function () {
    // 4-2. 操作类名
    $(this).addClass('active').siblings().removeClass('active')

    // 4-3. 拿到你点击的是哪一个
    const type = $(this).data('type')

    // 让当前页回到第一页
    list_info.current = 1

    // 4-4. 修改 list_info
    list_info.cat_one = type
    // 从新渲染分类信息和列表数据
    getTotalPage()
    getGoodsList()
    $('.list_lt').html('<span data-type="all" class="active">全部</span>')

    // 7. 排序方式的点击事件
  })
  $('.olt').on('click', function () {
    // 7-2. 拿到信息
    const method = $(this).attr('data-method')
    const type = $(this).attr('data-type')


    // 7-4. 修改对象信息
    list_info.sort_method = method
    list_info.sort_type = type

    // 7-5. 从新请求
    getTotalPage()
    getGoodsList()

    // 7-6. 修改 data-type 属性
    // 为下一次准备的
    $(this)
      .attr('data-type', type === 'ASC' ? 'DESC' : 'ASC')
    })
    
    $('.l_lb').on('click','p', function () {
      // 9-2. 拿到 标签身上记录的商品 id
      const id = $(this).data('id')
      // 9-3. 把这个 id 存储到 cookie 中
      setCookie('goods_id', id)
      // 9-4. 进行页面跳转
      window.location.href = './detail.html'
    })
})