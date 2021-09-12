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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createError = exports.SocketError = void 0;
var SocketError = /** @class */ (function (_super) {
    __extends(SocketError, _super);
    function SocketError(message, context) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, SocketError.prototype); // fix err instanceOf
        _this.name = _this.constructor.name;
        _this.code = context.code;
        _this.type = context.type;
        _this.event = context.event;
        if (context && context.stack) {
            _this.stack = _this.stack + "\nCaused By: " + context.stack;
        }
        return _this;
    }
    return SocketError;
}(Error));
exports.SocketError = SocketError;
function createError(context) {
    return new SocketError(context.message, context);
}
exports.createError = createError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2Vycm9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtJQUFpQywrQkFBSztJQUtyQyxxQkFBWSxPQUFlLEVBQUUsT0FBb0I7UUFBakQsWUFDQyxrQkFBTSxPQUFPLENBQUMsU0FTZDtRQVJBLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFDLHFCQUFxQjtRQUN4RSxLQUFJLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFBO1FBQ2pDLEtBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQTtRQUN4QixLQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDeEIsS0FBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFBO1FBQzFCLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDN0IsS0FBSSxDQUFDLEtBQUssR0FBTSxLQUFJLENBQUMsS0FBSyxxQkFBZ0IsT0FBTyxDQUFDLEtBQU8sQ0FBQTtTQUN6RDs7SUFDRixDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQUFDLEFBaEJELENBQWlDLEtBQUssR0FnQnJDO0FBaEJZLGtDQUFXO0FBa0J4QixTQUFnQixXQUFXLENBQUMsT0FBb0I7SUFDL0MsT0FBTyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ2pELENBQUM7QUFGRCxrQ0FFQyJ9