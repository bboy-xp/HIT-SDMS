'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1522757372552_2453';
  config.appSecret = '4123e9dccf66b8253a94125001644be2';
  config.appId = 'wx14aa273a734634f5';
  config.getSessionKeyUrl = 'https://api.weixin.qq.com/sns/jscode2session';

  // add your config here
  config.middleware = [];
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/sdms',
    options: {},
  };
  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '127.0.0.1',   // Redis host
      password: 'auth',
      db: 0,
    },
  }
  config.cors = {
    allowMethods: 'GET',
    credentials: true,
  };
  config.bodyParser = {
    jsonLimit: '1mb',
    formLimit: '1mb',
  };
  // ignore csrf
  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
    xframe: {
      enable: false,
    },
    domainWhiteList: [ 'localhost:8080' ],
  };
  // add static file server
  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, 'app/public'),
    dynamic: true,
  };

  // 后端渲染 nunjucks 配置
  config.view = {
    defaultViewEngine: 'nunjucks', // 默认后端模板渲染引擎, 不写则会根据后缀名进行匹配
    defaultExtention: '.nj', // 默认扩展名，在render时可以不写扩展名
    root: [
      path.join(appInfo.baseDir, 'app/view'),
    ].join(',') // 配置根目录
  };

  return config;
};
