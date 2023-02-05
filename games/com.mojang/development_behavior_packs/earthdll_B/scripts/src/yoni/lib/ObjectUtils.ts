// @ts-nocheck
function copyPropertiesWithoutOverride(target, src, accessKey){
    if ((typeof accessKey !== "string" && typeof accessKey !== "symbol") || accessKey === ""){
        throw new TypeError("accessKey not valid");
    }
    for (let key of getProperties(src)){
        if (key in target || key === accessKey){
            continue;
        }
        
        let propertyDescriptor = Object.getOwnPropertyDescriptor(src, key);
        if (typeof propertyDescriptor?.value === "function"){
            Object.defineProperty(target, key, {
                configurable: propertyDescriptor.configurable,
                enumerable: propertyDescriptor.enumerable,
                writable: false,
                value: function (){
                    return this[accessKey][key].apply(this[accessKey], arguments);
                }
            });
        } else if (propertyDescriptor !== undefined) {
            Object.defineProperty(target, key, {
                configurable: propertyDescriptor.configurable,
                enumerable: propertyDescriptor.enumerable,
                get: function (){
                    return this[accessKey][key];
                },
                set: function (value){
                    this[accessKey][key] = value;
                }
            });
        } else {
            if (debug)
                throw new RefrenceError(
                    "Unknown property while copy properties: "
                    +String(key)
                    +" don't have a descriptor");
        }
    }
}

function assignAllPropertiesWithoutOverride(target, ...srcs){
    let definedKeys = [];
    for (let src of srcs){
        for (let key of getProperties(src)){
            if (definedKeys.includes(key) || key in target){
                continue;
            }
            definedKeys.push(key);
            
            let propertyDescriptor = Object.getOwnPropertyDescriptor(src, key);
            let sa = src;
            while (sa !== null && propertyDescriptor === undefined){
                propertyDescriptor = Object.getOwnPropertyDescriptor(sa, key);
                sa = Object.getPrototypeOf(sa);
            }
            let value = propertyDescriptor?.value;
            if (typeof value === "function"){
                Object.defineProperty(target, key, {
                    configurable: propertyDescriptor.configurable,
                    enumerable: propertyDescriptor.enumerable,
                    writable: propertyDescriptor.writable,
                    value: function (){
                        return value.apply(src, arguments);
                    }
                });
            } else if (propertyDescriptor !== undefined) {
                Object.defineProperty(target, key, {
                    configurable: propertyDescriptor.configurable,
                    enumerable: propertyDescriptor.enumerable,
                    get: function (){
                        return src[key];
                    },
                    set: function (value){
                        src[key] = value;
                    }
                });
            } else {
                if (debug)
                    throw new RefrenceError(
                        "Unknown property while copy properties: "
                        +String(key)
                        +" don't have a descriptor");
            }
        }
    }
}

/**
 * 得到一个对象上的所有键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为Object.prototype，即从Object原型方法上断开继承
 */
function getKeys(object, endPrototype){
    if (arguments.length === 1){
        endPrototype = Object.prototype;
    }
    //为了更强的兼容性，使用了var
    var sa = object;
    var keys = new Set();
    var saKeys;
    var idx;
    var key;
    while (sa !== null && sa !== endPrototype){
        saKeys = Object.getOwnPropertyNames(sa);
        for (idx = 0; idx < saKeys.length; idx ++){
            key = saKeys[idx];
            if (keys.has(key)){
                continue;
            }
            keys.add(key);
        }
        sa = Object.getPrototypeOf(sa);
    }
    return Array.from(keys);
}

/**
 * 得到一个对象上的所有属性键值
 * @param {any} object
 * @param {any} [endPrototype] - 如果键值是继承而来的，从什么原型的位置结束继承，默认为`Object.prototype`，即从Object原型方法上断开继承
 */
function getProperties(object, endPrototype){
    if (arguments.length === 1){
        endPrototype = Object.prototype;
    }
    //为了更强的兼容性，使用了var
    var sa = object;
    var keys = new Set();
    var saKeys;
    var idx;
    var key;
    while (sa !== null && sa !== endPrototype){
        saKeys = Object.getOwnPropertyNames(sa);
        for (idx = 0; idx < saKeys.length; idx ++){
            key = saKeys[idx];
            if (keys.has(key)){
                continue;
            }
            keys.add(key);
        }
        
        saKeys = Object.getOwnPropertySymbols(sa);
        for (idx = 0; idx < saKeys.length; idx ++){
            key = saKeys[idx];
            if (keys.has(key)){
                continue;
            }
            keys.add(key);
        }
        
        sa = Object.getPrototypeOf(sa);
    }
    return Array.from(keys);
}

function getOwnProperties(object){
    return getProperties(object, Object.getPrototypeOf(object));
}

function getOwnKeys(object){
    return getKeys(object, Object.getPrototypeOf(object));
}

const debug = false;

const ObjectUtils = {
    copyPropertiesWithoutOverride,
    assignAllPropertiesWithoutOverride,
    getKeys,
    getProperties,
    getOwnKeys,
    getOwnProperties,
};

export {
    copyPropertiesWithoutOverride,
    assignAllPropertiesWithoutOverride,
    getKeys,
    getProperties,
    getOwnKeys,
    getOwnProperties,
    ObjectUtils,
};
