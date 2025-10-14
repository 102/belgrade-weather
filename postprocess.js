"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var mod_ts_1 = require("https://deno.land/x/flat@0.0.15/mod.ts");
var filename = Deno.args[0];
var json = await (0, mod_ts_1.readJSON)(filename);
var newFilename = "history.csv";
var history = await (0, mod_ts_1.readCSV)(newFilename);
await (0, mod_ts_1.writeCSV)(newFilename, __spreadArray([{
        "temperature in °C": json.main.temp,
        description: json.weather[0].main,
        date: new Date().toISOString(),
    }], history, true));
