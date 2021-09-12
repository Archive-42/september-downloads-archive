"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentDevicePlatform = exports.AgentDeviceType = exports.VisitorStatus = exports.ChatStatus = exports.AgentStatus = exports.MessageEventContent = exports.MessageContent = exports.MessageDeliveryFailReason = exports.MessageDeliveryStatus = exports.MessageSubType = exports.MessageType = exports.AccountStatus = void 0;
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Online"] = "online";
    AccountStatus["Offline"] = "offline";
})(AccountStatus = exports.AccountStatus || (exports.AccountStatus = {}));
var MessageType;
(function (MessageType) {
    MessageType["Message"] = "message";
    MessageType["Event"] = "event";
    MessageType["Help"] = "help";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var MessageSubType;
(function (MessageSubType) {
    MessageSubType["Agent"] = "agent";
    MessageSubType["Contact"] = "contact";
    MessageSubType["Trigger"] = "trigger";
    MessageSubType["Bot"] = "bot";
    MessageSubType["System"] = "system";
    MessageSubType["AgentExternal"] = "agent_external";
    MessageSubType["FoundEmail"] = "found_email";
})(MessageSubType = exports.MessageSubType || (exports.MessageSubType = {}));
var MessageDeliveryStatus;
(function (MessageDeliveryStatus) {
    MessageDeliveryStatus["Ok"] = "ok";
    MessageDeliveryStatus["PermanentFail"] = "permanent_fail";
    MessageDeliveryStatus["TemporaryFail"] = "temporary_fail";
    MessageDeliveryStatus["Complained"] = "complained";
    MessageDeliveryStatus["Seen"] = "seen";
})(MessageDeliveryStatus = exports.MessageDeliveryStatus || (exports.MessageDeliveryStatus = {}));
var MessageDeliveryFailReason;
(function (MessageDeliveryFailReason) {
    MessageDeliveryFailReason["Facebook24hWindow"] = "facebook.outside_allowed_window";
})(MessageDeliveryFailReason = exports.MessageDeliveryFailReason || (exports.MessageDeliveryFailReason = {}));
// Message (Normal) - Content
var MessageContent;
(function (MessageContent) {
    var Type;
    (function (Type) {
        Type["Text"] = "text";
        Type["Upload"] = "upload";
        Type["RateForm"] = "rate_form";
        Type["QuestionForm"] = "question_form";
        Type["QuestionFormSubmit"] = "question_form_submit";
    })(Type = MessageContent.Type || (MessageContent.Type = {}));
})(MessageContent = exports.MessageContent || (exports.MessageContent = {}));
// Message Event - Content
var MessageEventContent;
(function (MessageEventContent) {
    var Type;
    (function (Type) {
        Type["AgentJoin"] = "agent_join";
        Type["AgentAssign"] = "agent_assign";
        Type["AgentUnassign"] = "agent_unassign";
        Type["AgentLeave"] = "agent_leave";
        Type["ChatClose"] = "chat_close";
        Type["ChatVisitorClose"] = "chat_visitor_close";
        Type["ChatTransfer"] = "chat_transfer";
        //
        // legacy from v1
        //
        Type["VisitorLeave"] = "visitor_leave";
    })(Type = MessageEventContent.Type || (MessageEventContent.Type = {}));
})(MessageEventContent = exports.MessageEventContent || (exports.MessageEventContent = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["Online"] = "online";
    AgentStatus["Offline"] = "offline";
})(AgentStatus = exports.AgentStatus || (exports.AgentStatus = {}));
var ChatStatus;
(function (ChatStatus) {
    ChatStatus["Pending"] = "pending";
    ChatStatus["Open"] = "open";
    ChatStatus["Closed"] = "closed";
})(ChatStatus = exports.ChatStatus || (exports.ChatStatus = {}));
var VisitorStatus;
(function (VisitorStatus) {
    VisitorStatus["Active"] = "active";
    VisitorStatus["Clicked"] = "clicked";
    VisitorStatus["Idle"] = "idle";
    VisitorStatus["Served"] = "served";
    VisitorStatus["Unserved"] = "unserved";
    VisitorStatus["Triggered"] = "triggered";
})(VisitorStatus = exports.VisitorStatus || (exports.VisitorStatus = {}));
var AgentDeviceType;
(function (AgentDeviceType) {
    AgentDeviceType["Browser"] = "browser";
    AgentDeviceType["Mobile"] = "mobile";
    AgentDeviceType["Xmpp"] = "xmpp";
    AgentDeviceType["Other"] = "other";
})(AgentDeviceType = exports.AgentDeviceType || (exports.AgentDeviceType = {}));
var AgentDevicePlatform;
(function (AgentDevicePlatform) {
    AgentDevicePlatform["IOS"] = "ios";
    AgentDevicePlatform["ANDROID"] = "android";
})(AgentDevicePlatform = exports.AgentDevicePlatform || (exports.AgentDevicePlatform = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBWSxhQUdYO0FBSEQsV0FBWSxhQUFhO0lBQ3hCLGtDQUFpQixDQUFBO0lBQ2pCLG9DQUFtQixDQUFBO0FBQ3BCLENBQUMsRUFIVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQUd4QjtBQUVELElBQVksV0FJWDtBQUpELFdBQVksV0FBVztJQUN0QixrQ0FBbUIsQ0FBQTtJQUNuQiw4QkFBZSxDQUFBO0lBQ2YsNEJBQWEsQ0FBQTtBQUNkLENBQUMsRUFKVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUl0QjtBQUVELElBQVksY0FRWDtBQVJELFdBQVksY0FBYztJQUN6QixpQ0FBZSxDQUFBO0lBQ2YscUNBQW1CLENBQUE7SUFDbkIscUNBQW1CLENBQUE7SUFDbkIsNkJBQVcsQ0FBQTtJQUNYLG1DQUFpQixDQUFBO0lBQ2pCLGtEQUFnQyxDQUFBO0lBQ2hDLDRDQUEwQixDQUFBO0FBQzNCLENBQUMsRUFSVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQVF6QjtBQUVELElBQVkscUJBTVg7QUFORCxXQUFZLHFCQUFxQjtJQUNoQyxrQ0FBUyxDQUFBO0lBQ1QseURBQWdDLENBQUE7SUFDaEMseURBQWdDLENBQUE7SUFDaEMsa0RBQXlCLENBQUE7SUFDekIsc0NBQWEsQ0FBQTtBQUNkLENBQUMsRUFOVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQU1oQztBQUVELElBQVkseUJBRVg7QUFGRCxXQUFZLHlCQUF5QjtJQUNwQyxrRkFBcUQsQ0FBQTtBQUN0RCxDQUFDLEVBRlcseUJBQXlCLEdBQXpCLGlDQUF5QixLQUF6QixpQ0FBeUIsUUFFcEM7QUEwRUQsNkJBQTZCO0FBRTdCLElBQWlCLGNBQWMsQ0F3RTlCO0FBeEVELFdBQWlCLGNBQWM7SUFFOUIsSUFBWSxJQU1YO0lBTkQsV0FBWSxJQUFJO1FBQ2YscUJBQWEsQ0FBQTtRQUNiLHlCQUFpQixDQUFBO1FBQ2pCLDhCQUFzQixDQUFBO1FBQ3RCLHNDQUE4QixDQUFBO1FBQzlCLG1EQUEyQyxDQUFBO0lBQzVDLENBQUMsRUFOVyxJQUFJLEdBQUosbUJBQUksS0FBSixtQkFBSSxRQU1mO0FBZ0VGLENBQUMsRUF4RWdCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBd0U5QjtBQThDRCwwQkFBMEI7QUFFMUIsSUFBaUIsbUJBQW1CLENBMkZuQztBQTNGRCxXQUFpQixtQkFBbUI7SUFFbkMsSUFBWSxJQWFYO0lBYkQsV0FBWSxJQUFJO1FBQ2YsZ0NBQXdCLENBQUE7UUFDeEIsb0NBQTRCLENBQUE7UUFDNUIsd0NBQWdDLENBQUE7UUFDaEMsa0NBQTBCLENBQUE7UUFDMUIsZ0NBQXdCLENBQUE7UUFDeEIsK0NBQXVDLENBQUE7UUFDdkMsc0NBQThCLENBQUE7UUFFOUIsRUFBRTtRQUNGLGlCQUFpQjtRQUNqQixFQUFFO1FBQ0Ysc0NBQThCLENBQUE7SUFDL0IsQ0FBQyxFQWJXLElBQUksR0FBSix3QkFBSSxLQUFKLHdCQUFJLFFBYWY7QUE0RUYsQ0FBQyxFQTNGZ0IsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUEyRm5DO0FBOERELElBQVksV0FHWDtBQUhELFdBQVksV0FBVztJQUN0QixnQ0FBaUIsQ0FBQTtJQUNqQixrQ0FBbUIsQ0FBQTtBQUNwQixDQUFDLEVBSFcsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFHdEI7QUFFRCxJQUFZLFVBSVg7QUFKRCxXQUFZLFVBQVU7SUFDckIsaUNBQW1CLENBQUE7SUFDbkIsMkJBQWEsQ0FBQTtJQUNiLCtCQUFpQixDQUFBO0FBQ2xCLENBQUMsRUFKVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQUlyQjtBQStCRCxJQUFZLGFBT1g7QUFQRCxXQUFZLGFBQWE7SUFDeEIsa0NBQWlCLENBQUE7SUFDakIsb0NBQW1CLENBQUE7SUFDbkIsOEJBQWEsQ0FBQTtJQUNiLGtDQUFpQixDQUFBO0lBQ2pCLHNDQUFxQixDQUFBO0lBQ3JCLHdDQUF1QixDQUFBO0FBQ3hCLENBQUMsRUFQVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQU94QjtBQTJFRCxJQUFZLGVBS1g7QUFMRCxXQUFZLGVBQWU7SUFDMUIsc0NBQW1CLENBQUE7SUFDbkIsb0NBQWlCLENBQUE7SUFDakIsZ0NBQWEsQ0FBQTtJQUNiLGtDQUFlLENBQUE7QUFDaEIsQ0FBQyxFQUxXLGVBQWUsR0FBZix1QkFBZSxLQUFmLHVCQUFlLFFBSzFCO0FBRUQsSUFBWSxtQkFHWDtBQUhELFdBQVksbUJBQW1CO0lBQzlCLGtDQUFXLENBQUE7SUFDWCwwQ0FBbUIsQ0FBQTtBQUNwQixDQUFDLEVBSFcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFHOUIifQ==