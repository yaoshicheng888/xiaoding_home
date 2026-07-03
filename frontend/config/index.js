const path = require('path')

const config = {
  projectName: 'xiaoding-mini',
  date: '2026-7-2',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  compiler: 'webpack5',
  compile: {
    include: [
      path.resolve(__dirname, '..', '..', 'design-system'),
      path.resolve(__dirname, '..', '..', 'node_modules', 'design-system')
    ]
  },
  cache: {
    enable: false
  },
  prebundle: {
    enable: false
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    webpackChain(chain) {
      chain.module
        .rule('script')
        .include
          .add(path.resolve(__dirname, '..', '..', 'design-system'))
          .add(path.resolve(__dirname, '..', '..', 'node_modules', 'design-system'))
          .end()
    },
    publicPath: '/',
    staticDirectory: 'static',
    devServer: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
