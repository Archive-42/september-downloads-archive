"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmitter = exports.createCallback = exports.bound = void 0;
var errors_1 = require("./errors");
function bound(scope, name) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        scope[name].apply(scope, args);
    };
}
exports.bound = bound;
function createCallback(resolve, reject) {
    return function (err, ret) {
        if (err) {
            reject(errors_1.createError(err));
        }
        else {
            resolve(ret);
        }
    };
}
exports.createCallback = createCallback;
function createEmitter(emitter, name) {
    return function (data) {
        emitter.emit(name, data);
    };
}
exports.createEmitter = createEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQXNDO0FBRXRDLFNBQWdCLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSTtJQUNoQyxPQUFPO1FBQUMsY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCx5QkFBTzs7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQVgsS0FBSyxFQUFVLElBQUksRUFBQztJQUNyQixDQUFDLENBQUE7QUFDRixDQUFDO0FBSkQsc0JBSUM7QUFFRCxTQUFnQixjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDN0MsT0FBTyxVQUFDLEdBQUcsRUFBRSxHQUFHO1FBQ2YsSUFBSSxHQUFHLEVBQUU7WUFDUixNQUFNLENBQUMsb0JBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1NBQ3hCO2FBQU07WUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDWjtJQUNGLENBQUMsQ0FBQTtBQUNGLENBQUM7QUFSRCx3Q0FRQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxPQUFxQixFQUFFLElBQVk7SUFDaEUsT0FBTyxVQUFDLElBQUk7UUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUN6QixDQUFDLENBQUE7QUFDRixDQUFDO0FBSkQsc0NBSUMifQ==