# 美术宝 • 投诉平台\[msb-admin-suggestions]

> 使用[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)二次开发

## 开发资料

- [产品文档](https://www.tapd.cn/62372623/prong/iterations/card_view#iterationId=1162372623001000126&perPage=50&filter_close=true&wallCardType=story&timespan=1577676568177)
- [开发 API](https://dmpapi.meishubao.com/operation/swagger-ui.html)

<!-- ## 效果图
[开发访问地址](https://devopm.meishubao.com)

![预览](https://operation-center.meishubao.com/operation-resource/ttx3iGFBmZ.png)

![预览](https://operation-center.meishubao.com/operation-resource/TYe26AFKmQ.png) -->

## CHANGE LOG

[版本更新信息](https://wiki.meishubao.com/pages/viewpage.action?pageId=18059985)

## 开发说明

### 命令

```
# 开发
npm run dev

# 打包联调环境
npm run build:org

# 打包测试环境
npm run build:test

# 打包预发环境
npm run build:staging

# 打包线上环境
npm run build:product
```

### 生成 diff 地址

- 先进行[Phabricator 配置](https://wiki.meishubao.com/pages/viewpage.action?pageId=18063184)
- 再执行 arc 命令生成 diff 地址（origin/master 可改为任意想要对比的分支）

```
arc diff origin/master --only
```

### 接口代理

在项目根目录下分别设置联调、测试、预发与线上环境配置，配置包含打包模式与 baseURL  
如果需要设置多个 baseURL，查看[设置多个 baseURL 文档](https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/server.html#%E8%AE%BE%E7%BD%AE%E5%A4%9A%E4%B8%AA-baseurl)

### 命名与编码规范

| 对应项            | 规范                       |
| ----------------- | -------------------------- |
| 一般文件夹        | 小写字母、-                |
| components 文件夹 | 大写首字母的驼峰           |
| 一般文件          | 小写字母、-                |
| components 文件   | 除 index，大写首字母的驼峰 |
| 一般变量          | 驼峰                       |
| 函数名            | 驼峰                       |
| 常量              | 大写字母、\_               |
| 路由              | 小写、-（禁止大写）        |
| 模板内组件        | 小写、-                    |
| css               | [BEM](https://en.bem.info) |

### 代码风格规范

vue、js 以 eslint 配置为准

## 环境及规则

| 环境     | 地址                           | ⚠️ 注意事项                                       |
| -------- | ------------------------------ | ------------------------------------------------- |
| 测试环境 | https://sug-test.meishubao.com | 部署触发方式：合并代码至 test-sug                 |
| 预发环境 | https://sug-pre.meishubao.com  | 部署触发方式：合并代码至 pre-sug（暂无 pre 环境） |
| 线上环境 | https://sug.meishubao.com      | 运营管理后台线上环境！                            | 部署触发方式：提交远程 tag，格式为：msb-admin-suggestions\_ |

## 上线审批单规则： （入口： https://devops.meishubao.com/createApprovalForm/form） ！！！属于微服务

- gitlab_url：https://gitlab.meishubao.com/msb-fe/msb-admin-suggestions
- appGroup：msb-fe
- appName： msb-admin-suggestions
- appJob: deploy:live
- appTag: msb-admin-suggestions_20210902_v01
- rollback_tag: 上次上线的稳定 tag
# msb_sug-v2
