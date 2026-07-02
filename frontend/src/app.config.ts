export default {
  pages: [
    'pages/index/index',
    'pages/order/index',
    'pages/provider/login/index',
    'pages/provider/orders/index',
    'pages/provider/detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '小钉到家',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#1a73e8',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单'
      }
    ]
  }
}
