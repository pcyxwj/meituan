"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = _axios2.default.create({
    baseURL: "http://" + (process.env.HOST || "localhost") + ":" + (process.env.PORT || 3000),
    timeout: 2000,
    headers: {}
});

exports.default = instance;