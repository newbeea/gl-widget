# GLWidget  一个面向UI的轻量化、插件化WebGL渲染引擎

![build](https://github.com/newbeea/gl-widget/workflows/build/badge.svg)
![NPM](https://img.shields.io/npm/l/@gl-widget/gl-widget)
![npm](https://img.shields.io/npm/dm/@gl-widget/gl-widget)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/@gl-widget/gl-widget)

## GLWidget背景
一提到WebGL应用，想到的都是展示3D产品，或是3D网页游戏，在普通页面UI上的应用很少，shadertoy上很多酷炫的shader作为UI的一部分应该是很酷的事情，那为什么很少有人尝试呢，除了兼容性的问题，其中很大一部分原因是从零开始搭建WegGL应用过于繁琐，而引用threejs、babylonjs渲染引擎做这样的事情又大材小用。

所以我就想写一款内核极简，又能快速完成搭建shader运行环境的引擎，可以使开发人员专注于shader效果的编写，或是直接移植shadertoy上惊艳的效果。同时，在架构上注重扩展性，通过编写插件，可以扩展成功能更全的引擎。

## 安装
### npm
```bash
npm install @gl-widget/gl-widget
```
使用
```js
import { GLWidget, RenderableElement, Texture } from '@gl-widget/gl-widget'
let glWidget = new GLWidget({
  element: "xxx"
})
```
or
```js
import * as GLWidget from '@gl-widget/gl-widget'
let glWidget = new GLWidget.GLWidget({
  element: "xxx"
})
```
or
```js
let GLWidget =  require('@gl-widget/gl-widget')
let glWidget = new GLWidget.GLWidget({
  element: "xxx"
})
```

### script
```html
<script src="http://cdn.jsdelivr.net/npm/@gl-widget/gl-widget/dist/index.umd.js"></script>
```
使用

```js
let glWidget = new GLWidget.GLWidget({
  element: "xxx"
})
```