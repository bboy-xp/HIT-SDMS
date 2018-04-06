'use strict';

const Controller = require('egg').Controller;
const axios = require('axios');
const exec = require('child_process').exec;
const wx = require('wx-biz-data-crypt');

class LoginController extends Controller {
  async login() {
    const { code, encry, iv } = this.ctx.query;
    const { appId, appSecret, getSessionKeyUrl } = this.config;
    const requestUrl = `${getSessionKeyUrl}?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;
    const result = await axios.get(requestUrl);
    const { session_key, openid } = result.data;
    const newSession = await this.getNewSessionKey();
    this.ctx.cookies.set(newSession, session_key + openid, {
      encrypt: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    // 解密encryptedData 得到全部信息
    const wxencry = new wx(appId, session_key);
    const wxUserInfo = wxencry.decryptData(encry, iv);
    this.ctx.body = {
      userInfo: wxUserInfo
    };
  }
  async getNewSessionKey() {
    return new Promise((resolve, reject) => {
      exec('head -n 80 /dev/urandom | tr -dc A-Za-z0-9 | head -c 168', (err, stdout, stderr) => {
        resolve(stdout);
      });
    });
  }
  async checkCookie() {
    const { existCookieKey } = this.ctx.request.body;
    const cookie = this.ctx.cookies.get(existCookieKey, {
      encrypt: true,
      httpOnly: true,
    });
    this.ctx.body = cookie;
  }
}

module.exports = LoginController;