"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorEventName = exports.VisitorClient = void 0;
var client_1 = require("./client");
var errors_1 = require("./errors");
var promise_1 = require("./promise");
var utils_1 = require("./utils");
var VisitorClient = /** @class */ (function (_super) {
    __extends(VisitorClient, _super);
    function VisitorClient(options) {
        var _this = _super.call(this, options.connection) || this;
        _this.serverVersion = null;
        _this.updatedValues = {};
        _this.connectData = options.data;
        _this.identity = null; // initialized after first connect to server
        return _this;
    }
    VisitorClient.prototype.setConnection = function (connection) {
        _super.prototype.setConnection.call(this, connection);
        connection.on('server.error', utils_1.bound(this, 'onServerError'));
        connection.on('account.updated', utils_1.createEmitter(this.emitter, 'account.updated'));
        connection.on('agent.updated', utils_1.createEmitter(this.emitter, 'agent.updated'));
        connection.on('agent.status_updated', utils_1.createEmitter(this.emitter, 'agent.status_updated'));
        connection.on('agent.removed', utils_1.createEmitter(this.emitter, 'agent.removed'));
        connection.on('visitor.updated', utils_1.bound(this, 'onVisitorUpdated'));
        connection.on('chat.updated', utils_1.createEmitter(this.emitter, 'chat.updated'));
        connection.on('chat.agent_joined', utils_1.createEmitter(this.emitter, 'chat.agent_joined'));
        connection.on('chat.agent_assigned', utils_1.createEmitter(this.emitter, 'chat.agent_assigned'));
        connection.on('chat.agent_unassigned', utils_1.createEmitter(this.emitter, 'chat.agent_unassigned'));
        connection.on('chat.agent_left', utils_1.createEmitter(this.emitter, 'chat.agent_left'));
        connection.on('chat.opened', utils_1.createEmitter(this.emitter, 'chat.opened'));
        connection.on('chat.served', utils_1.createEmitter(this.emitter, 'chat.served'));
        connection.on('chat.closed', utils_1.createEmitter(this.emitter, 'chat.closed'));
        connection.on('chat.visitor_closed', utils_1.createEmitter(this.emitter, 'chat.visitor_closed'));
        connection.on('chat.message_received', utils_1.createEmitter(this.emitter, 'chat.message_received'));
        connection.on('chat.message_updated', utils_1.createEmitter(this.emitter, 'chat.message_updated'));
        connection.on('chat.agent_typing', utils_1.createEmitter(this.emitter, 'chat.agent_typing'));
        connection.on('chat.rated', utils_1.createEmitter(this.emitter, 'chat.rated'));
        connection.on('chat.contact_read', utils_1.createEmitter(this.emitter, 'chat.contact_read'));
        connection.on('chat.deleted', utils_1.createEmitter(this.emitter, 'chat.deleted'));
    };
    VisitorClient.prototype.on = function (event, listener) {
        this.emitter.on(event, listener);
        return this;
    };
    VisitorClient.prototype.once = function (event, listener) {
        this.emitter.once(event, listener);
        return this;
    };
    VisitorClient.prototype.getId = function () {
        return this.identity ? this.identity.id : null;
    };
    VisitorClient.prototype.getIdentity = function () {
        return this.identity;
    };
    VisitorClient.prototype.connect = function () {
        return _super.prototype.connect.call(this);
    };
    //
    // API methods
    //
    VisitorClient.prototype.update = function (values) {
        if (values === void 0) { values = {}; }
        this.checkServerVersion();
        for (var name_1 in values) {
            this.identity[name_1] = values[name_1];
            this.updatedValues[name_1] = values[name_1];
        }
        this.saveVisitorValues();
    };
    VisitorClient.prototype.authenticate = function (values) {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('visitor.authenticate', {
                values: values,
            }, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.notify = function (name, value) {
        var _this = this;
        if (value === void 0) { value = null; }
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('visitor.notify', {
                name: name,
                value: value,
            }, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.chatRead = function () {
        this.checkServerVersion();
        this.send('chat.read', null);
    };
    VisitorClient.prototype.chatTyping = function (is, text) {
        if (text === void 0) { text = null; }
        this.checkServerVersion();
        this.send('chat.typing', {
            typing: { is: is, text: text },
        });
    };
    VisitorClient.prototype.chatMessage = function (options) {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('chat.message', options, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.chatClose = function (type) {
        if (type === void 0) { type = null; }
        this.checkServerVersion();
        this.send('chat.close', {
            type: type,
        });
    };
    VisitorClient.prototype.chatUploadInit = function () {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('chat.upload_init', null, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.chatUploadFinish = function (uploadToken) {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('chat.upload_finish', {
                uploadToken: uploadToken,
            }, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.chatTranscript = function (email, lang) {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('chat.transcript', {
                email: email,
                lang: lang,
            }, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.chatRateInit = function () {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('chat.rate_init', null, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.chatRate = function (rating) {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.send('chat.rate', rating, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.visitorConnect = function () {
        var _this = this;
        var values = __assign({ version: VisitorClient.CLIENT_VERSION }, this.connectData);
        for (var key in this.updatedValues) {
            values[key] = this.updatedValues[key];
        }
        this.updatedValues = {};
        if (this.identity) {
            for (var key in this.identity) {
                if (['bannedAt', 'chatId', 'status'].indexOf(key) < 0) { // filter out read-only props
                    values[key] = this.identity[key];
                }
            }
        }
        this.emitter.emit('initialize', values);
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.connection.emit('visitor.connect', values, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.visitorDisconnect = function () {
        var _this = this;
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.connection.emit('visitor.disconnect', {}, utils_1.createCallback(resolve, reject));
        });
    };
    VisitorClient.prototype.widgetApiUsed = function (body) {
        this.checkServerVersion();
        this.send('widget.api_used', body);
    };
    //
    // Event handlers
    //
    VisitorClient.prototype.onVisitorUpdated = function (data) {
        var changes = {};
        for (var name_2 in data.changes) {
            if (VisitorClient.identityProperties.indexOf(name_2) >= 0) {
                if (this.identity) {
                    this.identity[name_2] = data.changes[name_2];
                }
                changes[name_2] = data.changes[name_2];
            }
        }
        if (Object.getOwnPropertyNames(changes).length > 0) {
            this.emitter.emit('visitor.updated', changes);
        }
    };
    VisitorClient.prototype.onServerError = function (data) {
        var err = errors_1.createError(data);
        this.emitter.emit('error', err);
    };
    //
    // Utils, data formatting
    //
    VisitorClient.prototype.initialize = function () {
        var _this = this;
        return this.visitorConnect().then(function (data) {
            _this.serverVersion = data.serverVersion;
            _this.identity = __assign(__assign({}, data.visitor), { variables: __assign({}, (data.visitor.variables || {})) });
            return data;
        });
    };
    VisitorClient.prototype.saveVisitorValues = function () {
        var _this = this;
        if (!this.initialized) {
            return; // update only if initialized
        }
        setTimeout(function () {
            if (!_this.initialized || (Object.getOwnPropertyNames(_this.updatedValues).length === 0)) {
                return;
            }
            var values = {};
            for (var key in _this.updatedValues) {
                values[key] = _this.updatedValues[key];
            }
            _this.send('visitor.update', { values: values });
            _this.updatedValues = {};
        }, 1);
    };
    VisitorClient.prototype.checkServerVersion = function () {
        if (this.serverVersion === null) {
            throw new Error('Client not yet connected to server');
        }
    };
    VisitorClient.CLIENT_VERSION = 5;
    VisitorClient.identityProperties = [
        'id', 'name', 'email', 'phone', 'chatId', 'variables', 'lang', 'group', 'bannedAt', 'triggerable', 'visits',
    ];
    return VisitorClient;
}(client_1.Client));
exports.VisitorClient = VisitorClient;
var VisitorEventName;
(function (VisitorEventName) {
    VisitorEventName["WidgetOpen"] = "widget_open";
    VisitorEventName["WidgetShow"] = "widget_show";
})(VisitorEventName = exports.VisitorEventName || (exports.VisitorEventName = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlzaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy92aXNpdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQWlEO0FBQ2pELG1DQUFtRDtBQUVuRCxxQ0FBdUM7QUFrQnZDLGlDQUE4RDtBQUU5RDtJQUFtQyxpQ0FBTTtJQVl4Qyx1QkFBWSxPQUE4QjtRQUExQyxZQUNDLGtCQUFNLE9BQU8sQ0FBQyxVQUFVLENBQUMsU0FHekI7UUFWRCxtQkFBYSxHQUFXLElBQUksQ0FBQTtRQUlwQixtQkFBYSxHQUFRLEVBQUUsQ0FBQTtRQUk5QixLQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDL0IsS0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUEsQ0FBQyw0Q0FBNEM7O0lBQ2xFLENBQUM7SUFFRCxxQ0FBYSxHQUFiLFVBQWMsVUFBaUM7UUFDOUMsaUJBQU0sYUFBYSxZQUFDLFVBQVUsQ0FBQyxDQUFBO1FBQy9CLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtRQUMzRCxVQUFVLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLHFCQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7UUFDaEYsVUFBVSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7UUFDNUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxxQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO1FBQzFGLFVBQVUsQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLHFCQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxl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