export default {
  pages: [
    "pages/login/index",
    "pages/index/index",
    "pages/result/index",
    "pages/order/index",
    "pages/orders/index",
    "pages/mine/index"
  ],
  window: {
    navigationBarTitleText: "小钉到家"
  },
  tabBar: {
    color: "#94A3B8",
    selectedColor: "#2563EB",
    borderStyle: "black",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "images/home.png",
        selectedIconPath: "images/home_active.png"
      },
      {
        pagePath: "pages/orders/index",
        text: "订单",
        iconPath: "images/orders.png",
        selectedIconPath: "images/orders_active.png"
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "images/mine.png",
        selectedIconPath: "images/mine_active.png"
      }
    ]
  }
}