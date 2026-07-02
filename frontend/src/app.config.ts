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
    color: "#999999",
    selectedColor: "#1677ff",
    borderStyle: "black",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMEM1LjU4IDEwIDIgMTMuNTggMiAxOHYtNmMxLjY2IDAgMy0xLjM0IDMtM3MtMS4zNC0zLTUtMy01IDMtMS4zNCAzLTUgM3Y2YyAgMCA0LjQyLTMuNTggOC04em0tMy41IDguNWwxLjY4LTEuNjkgMS44MiAxLjgyLjY4LS42OCAxLjY4LTEuNjktMS42OC0xLjY5LS42OCAuNjgtMS44MiAxLjgyLTEuNjggMS42OXptMy41LTcuNWMwLS42Ni0uNTQtMS4yLTEuMi0xLjJzLTEuMi41NC0xLjIgMS4yLjU0IDEuMiAxLjIgMS4yIDEuMi0uNTQgMS4yLTEuMnptMCA0LjhjMC0uNjYtLjU0LTEuMi0xLjItMS4yczEtLjU0IDEuMi0xLjIgMS4yLjU0IDEuMiAxLjItLjU0IDEuMi0xLjIgMS4yeiIvPjwvc3ZnPg==",
        selectedIconPath: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMEM1LjU4IDEwIDIgMTMuNTggMiAxOHYtNmMxLjY2IDAgMy0xLjM0IDMtM3MtMS4zNC0zLTUtMy01IDMtMS4zNCAzLTUgM3Y2YyAgMCA0LjQyLTMuNTggOC04em0tMy41IDguNWwxLjY4LTEuNjkgMS44MiAxLjgyLjY4LS42OCAxLjY4LTEuNjktMS42OC0xLjY5LS42OCAuNjgtMS44MiAxLjgyLTEuNjggMS42OXptMy41LTcuNWMwLS42Ni0uNTQtMS4yLTEuMi0xLjJzLTEuMi41NC0xLjIgMS4yLjU0IDEuMiAxLjIgMS4yIDEuMi0uNTQgMS4yLTEuMnptMCA0LjhjMC0uNjYtLjU0LTEuMi0xLjItMS4yczEtLjU0IDEuMi0xLjIgMS4yLjU0IDEuMiAxLjItLjU0IDEuMi0xLjIgMS4yeiIvPjwvc3ZnPg=="
      },
      {
        pagePath: "pages/orders/index",
        text: "订单",
        iconPath: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNyA0aDEwYzIuNzYgMCA1IDIuMjQgNSA1djZsLTggNC04LTR2LTZjMC0yLjc2IDIuMjQtNSA1LTV6bTAgOGgxMHptLTgtMmgtMTB2MmgxMHoiLz48L3N2Zz4=",
        selectedIconPath: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNyA0aDEwYzIuNzYgMCA1IDIuMjQgNSA1djZsLTggNC04LTR2LTZjMC0yLjc2IDIuMjQtNSA1LTV6bTAgOGgxMHptLTgtMmgtMTB2MmgxMHoiLz48L3N2Zz4="
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMEM2LjY5IDEwIDQgMTMuNjkgNCAxOHYySDIwdjItNGMwLTMuMzEtMi42OS02LTYtNi0zLjMxIDAtNiAyLjY5LTYgNiAwIDMuMzEgMi42OSA2IDYgNiAzLjMxIDAgNi0yLjY5IDYtNi4wMVYyMGMwLS41NS0uNDUtMS0xLTFoLTZjLS41NSAwLTEtLjQ1LTEtMXYtNHoiLz48cGF0aCBkPSJNMTAgOGMzLjI2IDAgNiAyLjc0IDYgNnMtMi43NCA2LTYgNi02LTIuNzQtNi02IDIuNzQtNiA2LTR6Ii8+PC9zdmc+",
        selectedIconPath: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMEM2LjY5IDEwIDQgMTMuNjkgNCAxOHYySDIwdjItNGMwLTMuMzEtMi42OS02LTYtNi0zLjMxIDAtNiAyLjY5LTYgNiAwIDMuMzEgMi42OSA2IDYgNiAzLjMxIDAgNi0yLjY5IDYtNi4wMVYyMGMwLS41NS0uNDUtMS0xLTFoLTZjLS41NSAwLTEtLjQ1LTEtMXYtNHoiLz48cGF0aCBkPSJNMTAgOGMzLjI2IDAgNiAyLjc0IDYgNnMtMi43NCA2LTYgNi02LTIuNzQtNi02IDIuNzQtNiA2LTR6Ii8+PC9zdmc+"
      }
    ]
  }
}