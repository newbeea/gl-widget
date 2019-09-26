/// <reference types="node" />
/**
 * Array.prototype.includes 不兼容ie 11,详见mdn文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 * 所以需要通过@babel/polyfill来实现
 */
declare const pets: string[];
/**
 * new Set不兼容ie 11,详见mdn文档
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 */
declare const set1: Set<number>;
/**
 * WeakMap 的 set方法在ie 11下不支持，详见mdn文档
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 */
declare var o1: {}, o2: () => void;
declare let weakmap: WeakMap<any, any>;
