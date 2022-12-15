var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
var createMap = function (columns) {
};
var getInput = function (stage) { return __awaiter(void 0, void 0, void 0, function () {
    var input, rl, questions, keys, i, key, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                input = {};
                rl = readline.createInterface(stdin, stdout);
                switch (stage) {
                    case 'Mixpanel':
                        questions = {
                            PROJECT_ID: 'What is your Mixpanel Project ID?',
                            SERVICE_ACCOUNT: 'What is your Mixpanel Service Account Username?',
                            SERVICE_ACCOUNT_PASSWORD: 'What is your Mixpanel Service Account Password?'
                        };
                        break;
                    case 'Spreadsheet':
                        questions = {
                            spreadsheetId: 'What is your Mixpanel Project ID?',
                            range: 'What is your Mixpanel Service Account Username?'
                        };
                        break;
                    case 'Mapping':
                        // questions = {
                        //   eventName: 'What is the name of your event column?',
                        //   distinct_id: 'What is the name of your Mixpanel \'distinct_id\' column?',
                        // } as MappingType;
                        break;
                    default: {
                        rl.close();
                        // return {};
                    }
                }
                keys = Object.keys(questions);
                i = 0;
                _c.label = 1;
            case 1:
                if (!(i < keys.length)) return [3 /*break*/, 4];
                key = keys[i];
                // eslint-disable-next-line no-await-in-loop
                _a = input;
                _b = key;
                return [4 /*yield*/, rl.question("".concat(questions[key], " \t"))];
            case 2:
                // eslint-disable-next-line no-await-in-loop
                _a[_b] = _c.sent();
                _c.label = 3;
            case 3:
                i += 1;
                return [3 /*break*/, 1];
            case 4:
                // for (let i = 0; i < questions.length; i += 1) {
                //   // eslint-disable-next-line no-await-in-loop
                //   answer = await rl.question(`${questions[i]} \t`);
                //   input.push(answer);
                // }
                rl.close();
                return [2 /*return*/, input];
        }
    });
}); };
export { createMap, getInput };
