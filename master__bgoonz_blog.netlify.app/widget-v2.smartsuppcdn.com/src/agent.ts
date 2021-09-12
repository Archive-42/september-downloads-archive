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
exports.AgentClient = void 0;
var client_1 = require("./client");
var errors_1 = require("./errors");
var promise_1 = require("./promise");
var utils_1 = require("./utils");
var AgentClient = /** @class */ (function (_super) {
    __extends(AgentClient, _super);
    function AgentClient(options) {
        var _this = _super.call(this, options.connection) || this;
        _this.serverVersion = null;
        _this.connectData = options.data;
        _this.identity = null; // initialized after first connect to server
        return _this;
    }
    AgentClient.prototype.setConnection = function (connection) {
        _super.prototype.setConnection.call(this, connection);
        connection.on('logout', utils_1.createEmitter(this.emitter, 'logout'));
        connection.on('server.error', utils_1.bound(this, 'onServerError'));
        connection.on('bulk', utils_1.bound(this, 'onBulk'));
        // agent events
        connection.on('agent.connected', utils_1.createEmitter(this.emitter, 'agent.connected'));
        connection.on('agent.disconnected', utils_1.createEmitter(this.emitter, 'agent.disconnected'));
        connection.on('agent.feature_usage_changed', utils_1.createEmitter(this.emitter, 'agent.feature_usage_changed'));
        connection.on('agent.updated', utils_1.bound(this, 'onAgentUpdated'));
        // visitor events
        connection.on('visitor.connected', utils_1.createEmitter(this.emitter, 'visitor.connected'));
        connection.on('visitor.disconnected', utils_1.createEmitter(this.emitter, 'visitor.disconnected'));
        connection.on('visitor.updated', utils_1.createEmitter(this.emitter, 'visitor.updated'));
        // chat events
        connection.on('chat.updated', utils_1.createEmitter(this.emitter, 'chat.updated'));
        connection.on('chat.agent_joined', utils_1.createEmitter(this.emitter, 'chat.agent_joined'));
        connection.on('chat.agent_assigned', utils_1.createEmitter(this.emitter, 'chat.agent_assigned'));
        connection.on('chat.agent_unassigned', utils_1.createEmitter(this.emitter, 'chat.agent_unassigned'));
        connection.on('chat.agent_left', utils_1.createEmitter(this.emitter, 'chat.agent_left'));
        connection.on('chat.opened', utils_1.createEmitter(this.emitter, 'chat.opened'));
        connection.on('chat.closed', utils_1.createEmitter(this.emitter, 'chat.closed'));
        connection.on('chat.visitor_closed', utils_1.createEmitter(this.emitter, 'chat.visitor_closed'));
        connection.on('chat.message_received', utils_1.createEmitter(this.emitter, 'chat.message_received'));
        connection.on('chat.visitor_typing', utils_1.createEmitter(this.emitter, 'chat.visitor_typing'));
        connection.on('chat.rated', utils_1.createEmitter(this.emitter, 'chat.rated'));
        connection.on('chat.agent_read', utils_1.createEmitter(this.emitter, 'chat.agent_read'));
        connection.on('chat.contact_read', utils_1.createEmitter(this.emitter, 'chat.contact_read'));
        connection.on('chat.agent_unread', utils_1.createEmitter(this.emitter, 'chat.agent_unread'));
        connection.on('chat.message_delivered', utils_1.createEmitter(this.emitter, 'chat.message_delivered'));
        connection.on('chat.message_delivery_failed', utils_1.createEmitter(this.emitter, 'chat.message_delivery_failed'));
        connection.on('chat.message_seen', utils_1.createEmitter(this.emitter, 'chat.message_seen'));
        connection.on('chat.deleted', utils_1.createEmitter(this.emitter, 'chat.deleted'));
        // contact events
        connection.on('contact.updated', utils_1.createEmitter(this.emitter, 'contact.updated'));
        // account events
        connection.on('account.package_changed', utils_1.createEmitter(this.emitter, 'account.package_changed'));
        connection.on('account.datalayer_changed', utils_1.createEmitter(this.emitter, 'account.datalayer_changed'));
        connection.on('account.feature_usage_changed', utils_1.createEmitter(this.emitter, 'account.feature_usage_changed'));
    };
    AgentClient.prototype.on = function (event, listener) {
        this.emitter.on(event, listener);
        return this;
    };
    AgentClient.prototype.once = function (event, listener) {
        this.emitter.once(event, listener);
        return this;
    };
    AgentClient.prototype.getId = function () {
        return this.identity ? this.identity.id : null;
    };
    AgentClient.prototype.getIdentity = function () {
        return this.identity;
    };
    AgentClient.prototype.connect = function () {
        return _super.prototype.connect.call(this);
    };
    //
    // API methods
    //
    AgentClient.prototype.agentConnect = function () {
        var _this = this;
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.connection.emit('agent.connect', __assign({ version: AgentClient.CLIENT_VERSION }, _this.connectData), utils_1.createCallback(resolve, reject));
        });
    };
    AgentClient.prototype.agentLogout = function () {
        var _this = this;
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.connection.emit('agent.logout', {
                deviceToken: _this.connectData.deviceToken || null,
                devicePlatform: _this.connectData.devicePlatform || null,
            }, utils_1.createCallback(resolve, reject));
        });
    };
    AgentClient.prototype.setTrackVisitors = function (track) {
        this.checkServerVersion();
        this.connection.emit('agent.track_visitors', track);
    };
    AgentClient.prototype.chatTyping = function (chatId, visitorId, is) {
        this.checkServerVersion();
        this.send('chat.typing', {
            chatId: chatId,
            visitorId: visitorId,
            typing: { is: is, text: null },
        });
    };
    AgentClient.prototype.visitorGet = function (id, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.checkServerVersion();
        return new promise_1.PromiseImpl(function (resolve, reject) {
            _this.connection.emit('visitor.get', __assign({ id: id }, options), utils_1.createCallback(resolve, reject));
        });
    };
    //
    // Event handlers
    //
    AgentClient.prototype.onAgentUpdated = function (data) {
        if (data.id === this.identity.id) {
            for (var name_1 in data.changes) {
                this.identity[name_1] = data.changes[name_1];
            }
        }
        this.emitter.emit('agent.updated', data);
    };
    AgentClient.prototype.onServerError = function (data) {
        var err = errors_1.createError(data);
        this.emitter.emit('error', err);
    };
    AgentClient.prototype.onBulk = function (data) {
        this.emitter.emit('bulk', data); // data can be modified in handler
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var item = data_1[_i];
            this.emitter.emit(item.name, item.data);
        }
    };
    //
    // Utils, data formatting
    //
    AgentClient.prototype.initialize = function () {
        var _this = this;
        return this.agentConnect().then(function (data) {
            _this.serverVersion = data.serverVersion;
            _this.identity = data.agent;
            return data;
        });
    };
    AgentClient.prototype.checkServerVersion = function () {
        if (this.serverVersion === null) {
            throw new Error('Client not yet connected to server');
        }
    };
    AgentClient.CLIENT_VERSION = 5;
    return AgentClient;
}(client_1.Client));
exports.AgentClient = AgentClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWdlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBaUQ7QUFDakQsbUNBQW1EO0FBRW5ELHFDQUF1QztBQUV2QyxpQ0FBOEQ7QUFFOUQ7SUFBaUMsK0JBQU07SUFRdEMscUJBQVksT0FBNEI7UUFBeEMsWUFDQyxrQkFBTSxPQUFPLENBQUMsVUFBVSxDQUFDLFNBSXpCO1FBVEQsbUJBQWEsR0FBVyxJQUFJLENBQUE7UUFPM0IsS0FBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFBO1FBQy9CLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBLENBQUMsNENBQTRDOztJQUNsRSxDQUFDO0lBRUQsbUNBQWEsR0FBYixVQUFjLFVBQWlDO1FBQzlDLGlCQUFNLGFBQWEsWUFBQyxVQUFVLENBQUMsQ0FBQTtRQUMvQixVQUFVLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxxQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUM5RCxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUE7UUFDM0QsVUFBVSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBSyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBRTVDLGVBQWU7UUFDZixVQUFVLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLHFCQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7UUFDaEYsVUFBVSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxxQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFBO1FBQ3RGLFVBQVUsQ0FB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