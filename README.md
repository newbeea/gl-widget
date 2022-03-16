# GLWidget  一个面向UI的轻量化、插件化WebGL渲染引擎
<https://www.philxu.cn>

![build](https://github.com/newbeea/gl-widget/workflows/build/badge.svg)
![NPM](https://img.shields.io/npm/l/@gl-widget/gl-widget)
![npm](https://img.shields.io/npm/dm/@gl-widget/gl-widget)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hm/@gl-widget/gl-widget)

## GLWidget背景
一提到WebGL应用，想到的都是展示3D产品，或是3D网页游戏，在普通页面UI上的应用很少，shadertoy上很多酷炫的shader作为UI的一部分应该是很酷的事情，那为什么很少有人尝试呢，除了兼容性的问题，其中很大一部分原因是从零开始搭建WegGL应用过于繁琐，而引用threejs、babylonjs渲染引擎做这样的事情又大材小用。

所以我就想写一款内核极简，又能快速完成搭建shader运行环境的引擎，可以使开发人员专注于shader效果的编写，或是直接移植shadertoy上惊艳的效果。同时，在架构上注重扩展性，通过编写插件，可以扩展成功能更全的引擎。

## 用例
图片滤镜  [vue-awesome-image filter](https://as-image.vercel.app/webgl-filter)

轮播图过渡  [@vue-awesome-image/image-group](https://as-image.vercel.app/image-group)
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
### Example
下面就是简单的shader动画
```html
<script>
  // 利用 id 或 htmlelement 初始化
  var glWidget = new GLWidget.GLWidget({
  element: 'gl-widget'
  })


  let shader = {
    fragmentShader: `
      precision mediump float;
      uniform vec2 resolution; //外部传进来的unifrom变量
      uniform float     time; //外部传进来的unifrom变量
      void main () {
        vec2 uv = gl_FragCoord.xy/resolution.xy;   
        vec3 col = 0.5 + 0.5*cos(time+uv.xyx+vec3(0,2,4));
        gl_FragColor = vec4(col,1.0);
      }
    `, // 编写fragmentShader，此例用默认vertexShader
    uniforms: {
      resolution:{
        value: glWidget.getSize() // canvas 大小
      },
      time: {
        value: 0
      }
    }, // 上面 fragmentShader 中用到的分辨率、时间变量
  }
  //每帧动画
  function animate() {
    shader.uniforms['time'].value += 0.01 // 设置变量值产生动画效果
  }

  //开始渲染
  glWidget.renderBackground(shader, animate)

</script>
```


## 功能
### 渲染
#### 渲染背景
```js
glWidget.renderBackground({
  fragmentShader: '',
  uniforms: {
    xxx: {
      value: xxx
    }
  }
}, animation)
```
#### 其他渲染方式
```js
let element = new RenderableElement(shader, geometry) // geometry 参见Geometry 和 BufferGeometry
// or
// let element = new Background(shader)
glWidget.add(element)
glWidget.render(animation)
// or
// glWidget.renderFrame() // 渲染单帧
```
#### 可渲染元素
##### Background
平铺整个canvas背景，不进行矩阵变换
##### Skybox
天空盒
##### RenderableElement
前景元素，需搭配Geometry使用
##### Points
粒子元素，需搭配Geometry使用，渲染Geometry中点


### 相机
可以在渲染时指定其他相机
#### 透视相机
```js
glWidget.render(animation, new PerspectiveCamera(fov, aspect, near, far))
```
#### 正交相机
```js
glWidget.render(animation, new OrthographicCamera(left, right, top, bottom, near, far))
```
相机的控制可以安装@gl-widget/orbit-controls插件，具体使用参见相关文档


### 后期效果
搭配Pass使用, 参考@gl-widget/pass 插件中RenderPass， SavePass
```js
  let renderPass = new RenderPass()
  glWidget.addPass(renderPass)
  let savePass = new SavePass()
  glWidget.addPass(savePass)

  glWidget.renderPass(animate);
```
本例展示使用，无添加任何效果


### 纹理
支持普通纹理、cube纹理


### 其他
#### 常用数学库
Matrix/Quaternion/Vector 等
#### uniform赋值上传
直接修改传入的shader.uniforms, 根据类型自动上传数据到webgl
#### 缓存
根据需要编译、更新


### 插件
#### @gl-widget/obj-parser
解析obj生成Geometry
#### @gl-widget/physical-shader
pbr的光照着色shader
#### @gl-widget/basic-geometry
球形等基础几何体
#### @gl-widget/orbit-controls
相机控制插件：拖拽旋转、滚轮缩放
#### @gl-widget/svg-element
根据svg生成RenderableElement
#### @gl-widget/font-element
根据文字生成RenderableElement
