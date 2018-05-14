'use strict';
const { Controller } = require('egg');

class CertificateController extends Controller {
  async getAllCertificates() {
    const { openId } = this.ctx.request.body;
    const { Certificate } = this.ctx.model;
    const res = await Certificate.findOne({ openId });
    this.ctx.body = {
      message: 'ok',
      certificate: res,
    };
  }
  async updateCertificates() {
    const { openId, certificate } = this.ctx.request.body;
    const { Certificate } = this.ctx.model;
    const findRes = await Certificate.find({ openId });
    if (findRes.length) {
      findRes[0].certificates.push(certificate);
      const res = await Certificate.update({ openId }, findRes[0]);
      if (res.ok === 1) {
        this.ctx.body = {
          message: 'ok'
        };
      }
    } else {
      let certificates = [ certificate ];
      const data = {
        status: '待审核',
        openId,
        certificates
      };
      const certificateData = new Certificate(data);
      await certificateData.save();
      this.ctx.body = {
        message: 'ok'
      }
    }
  }
  async removeCertificates() {
    const { openId, certificates } = this.ctx.request.body;
    const { Certificate } = this.ctx.model;
    const res = await Certificate.update({ openId }, certificates);
    if (res.ok === 1) {
      this.ctx.body = {
        message: 'ok'
      }
    }
  }
}

module.exports = CertificateController;
