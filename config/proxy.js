/*
 * @Author: yelei
 * @Date: 2021-01-18 11:22:46
 * @LastEditors: yelei
 * @LastEditTime: 2021-01-23 15:50:21
 * @Description: 起本地服务时默认为org对象，其它环境的代理对象会根据 package.json中的--mode后台的变量，打包构建时自行识别~
 */

module.exports = {
  dev: {
    '/api_cs': {
      // target: 'http://test-api-cs-internal.meishubao.com',
      target: 'http://dev-api-cs-internal.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api_cs': '/'
      }
    },
    '/sso': {
      target: 'https://resso-test.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/sso': ''
      }
    }
  },
  test: {
    '/api_cs': {
      // target: 'http://test-api-cs-internal.meishubao.com',
      target: 'http://dev-api-cs-internal.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api_cs': '/'
      }
    },    
    '/sso': {
      target: 'https://resso-test.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/sso': ''
      }
    }

  },
  staging: {
    '/api_cs': {
      target: 'http://prod-api-cs-internal.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api_cs': '/'
      }
    },    
    '/sso': {
      target: 'https://resso-prod.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/sso': ''
      }
    }

  },
  product: {
    '/api_cs': {
      target: 'http://api-cs-internal.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api_cs': '/'
      }
    },
    '/sso': {
      target: 'https://resso.meishubao.com',
      changeOrigin: true,
      pathRewrite: {
        '^/sso': ''
      }
    }
  }
}
