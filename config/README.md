<!--
 * @Author: yelei
 * @Date: 2021-01-23 14:50:30
 * @LastEditors: yelei
 * @LastEditTime: 2021-01-23 15:44:21
 * @Description: 
-->
# 美术宝1对1 • 客服平台系统\[msb-admin-suggestions]

# proxy配置说明

# * [环境配置] 

dev：线上开发环境

test：线上测试环境

staging：预发布环境

product：生产环境

# * [参数详情]
# 代理域名
target: "http://msi.yiqimeishu.com/vip-app-live"

# 是否开启域名代理 true开启 不配置默认为 false 
changeOrigin: true,

# 是否开启域名代理 key：链接中匹配的字符串 value：替换匹配后的字符串
pathRewrite: { '^/k8s': '/' }

# debug 模式 开启后可查看当前代理请求接口的真实地址
logLevel: 'debug',

# * 接口 环境域名变量集合

* [/ai_api] 小熊 graphql/api 接口
  // 开发 https://dev.meixiu.mobi
  // 测试 https://test.meixiu.mobi
  // 预发 https://tossprod.xiaoxiongmeishu.com
  // 生产 https://xiaoxiongmeishu.com
  
* [/k8s] 广告管理/任务管理 接口
  // 测试 http://1v1k8s.meishubao.com/vip-app-dev
  // 生产 http://msi.yiqimeishu.com/vip-app-live
  // 开发 http://1v1k8s.meishubao.com/vip-app-default
  // 预发 http://1v1k8s.meishubao.com/vip-app-test

* [/ums_meixiu] 商城管理 接口
  // 开发 https://ums-dev-api.meixiu.mobi
  // 测试 https://ums-test-api.meixiu.mobi
  // 预发 http://ums-prod-api.meixiu.mobi
  // 生产 http://ums-live-api.meixiu.mobi

* [/ums_api] 奖品 接口
  // 开发 https://ums-dev.xiaoxiongmeishu.com/api/a/p http://ums.meixiu.mobi:38766/api/a/p
  // 测试 https://ums-test.xiaoxiongmeishu.com
  // 预发 https://ums.xiaoxiongmeishu.com
  // 生产 https://ums.xiaoxiongmeishu.com

* [^/api] 课后评价 - 1对1 接口
  // 开发 https://javaapipc.meishubao.com
  // 测试 https://testpc.meishubao.com
  // 预发 https://prepc.meishubao.com
  // 生产 https://onlinepc.meishubao.com

* [/permissions] 业务系统 接口
  // 开发：https://user-center-dev.meishubao.com
  // 测试：https://user-center-test.meishubao.com
  // 预发：https://user-center-gray.meishubao.com
  // 线上：https://user-center.meishubao.com

* [/operation] 运营 接口
  // 开发 https://dmpapi.meishubao.com
  // 测试 https://tmpapi.meishubao.com
  // 预发 https://pmpapi.meishubao.com
  // 生产 https://mpapi.meishubao.com

* [/xbk] 课后评价 - 小班课 接口
  // 开发 https://sdbackstageorg.meishubao.com
  // 测试 https://sdbackstage.meishubao.com
  // 预发 https://sdbackstagegray.meishubao.com
  // 生产 https://banke.meishubao.com

* [/logistics] 物流/商品 接口
  // 开发 https://logisticsdev-mp.meishubao.com
  // 测试 https://logisticstest-mp.meishubao.com
  // 预发 https://logisticsgray-mp.meishubao.com
  // 生产 https://logistics-mp.meishubao.com

* [/msb_api] 小画家作品秀 接口
  // 开发 http://192.168.40.37:8085 https://javaapi.meishubao.com
  // 测试 https://testapi.meishubao.com
  // 预发 https://preapi.meishubao.com
  // 生产 https://onlineapi.meishubao.com

* [/ai_app-dev] 查用户
  // 开发 http://ai_app-dev.meixiu.mobi
  // 测试 http://ai_app-test.meixiu.mobi
  // 预发 http://ai_app-test.meixiu.mobi
  // 生产 http://www.xiaoxiongmeishu.com