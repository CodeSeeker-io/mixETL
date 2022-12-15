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
import { promises } from 'fs';
import * as path from 'path';
import * as process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
var readFile = promises.readFile, writeFile = promises.writeFile;
// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = path.join(process.cwd(), 'token.json');
var CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
function loadSavedCredentialsIfExist() {
    return __awaiter(this, void 0, void 0, function () {
        var content, credentials, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readFile(TOKEN_PATH)];
                case 1:
                    content = _a.sent();
                    credentials = JSON.parse(content.toString());
                    return [2 /*return*/, google.auth.fromJSON(credentials)];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function () {
        var content, keys, key, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readFile(CREDENTIALS_PATH)];
                case 1:
                    content = _a.sent();
                    keys = JSON.parse(content.toString());
                    key = keys.installed || keys.web;
                    payload = JSON.stringify({
                        type: 'authorized_user',
                        client_id: key.client_id,
                        client_secret: key.client_secret,
                        refresh_token: client.credentials.refresh_token
                    });
                    return [4 /*yield*/, writeFile(TOKEN_PATH, payload)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Load or request or authorization to call APIs.
 *
 */
export function authorize() {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadSavedCredentialsIfExist()];
                case 1:
                    client = _a.sent();
                    if (client) {
                        return [2 /*return*/, client];
                    }
                    return [4 /*yield*/, authenticate({
                            scopes: SCOPES,
                            keyfilePath: CREDENTIALS_PATH
                        })];
                case 2:
                    client = _a.sent();
                    if (!client.credentials) return [3 /*break*/, 4];
                    return [4 /*yield*/, saveCredentials(client)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, client];
            }
        });
    });
}
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
export function listRows(auth, targetSheet) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheets = google.sheets({ version: 'v4', auth: auth });
                    return [4 /*yield*/, sheets.spreadsheets.values.get(targetSheet)];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data.values];
            }
        });
    });
}
// authorize().then(listRows).catch(console.error);
