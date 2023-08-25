import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Fund = styled.div``;

export default function Dparam() {
  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  return (
    <Fund>
      <section>
        <b>本章将介绍关于类的属性。</b>
      </section>
      <br />
      <h2>以下是Davinci类下的属性</h2>
      <br />
      <section id="Dboard">
        <h1>Dboard: Dcharacter</h1>
        <b>default: Dcharacter</b>
        <p>
          画布角色，在Davinci初始化时自动生成，默认是一个和画布等高等宽的图形。
          <b>如非必要请不要自行修改。</b>
        </p>
      </section>
      <section id="allowRender">
        <h1>allowRender: boolean</h1>
        <b>default: true</b>
        <p>是否允许渲染，设置为false则不进入render函数。</p>
      </section>
      <section id="collisionDetect">
        <h1>collisionDetect: boolean</h1>
        <b>default: false</b>
        <p>
          是否开启碰撞检测，防止误触时使用。因为是默认关闭的，所以每次初始化画布之后需要手动开启
        </p>
      </section>
      <section id="stopPropagation">
        <h1>stopPropagation: boolean</h1>
        <b>default: true</b>
        <p>是否进行事件冒泡，出于便捷性的考虑，默认为true。</p>
      </section>
      <br />
      <h2>以下是Dcharacter类下的属性</h2>
      <br />
      <section id="id">
        <h1>id: string | number | symbol</h1>
        <b>default: +new Date()</b>
        <p>角色id，与uid不一样，可以自定义值。</p>
      </section>
      <section id="name">
        <h1>name: string | number</h1>
        <b>default: ''</b>
        <p>角色名称。</p>
      </section>
      <section id="width">
        <h1>width: number</h1>
        <b>default: 100</b>
        <p>容器宽度。如果单独设置，不会改变焦点。</p>
      </section>
      <section id="height">
        <h1>height: number</h1>
        <b>default: 100</b>
        <p>容器高度。如果单独设置，不会改变焦点。</p>
      </section>
      <section id="x">
        <h1>x: number</h1>
        <b>default: 0</b>
        <p>
          容器左上角顶点的X轴距离原点的距离，这是一个相对值，与父角色定位相关。
        </p>
      </section>
      <section id="y">
        <h1>y: number</h1>
        <b>default: 0</b>
        <p>
          容器左上角顶点的y轴距离原点的距离，这是一个相对值，与父角色定位相关。
        </p>
      </section>
      <section id="focusX">
        <h1>focusX: number</h1>
        <b>default: width/2</b>
        <p>
          焦点的x坐标，当使用setData方法设置宽高时，会自动把焦点设置为容器的中心。
        </p>
      </section>
      <section id="focusY">
        <h1>focusY: number</h1>
        <b>default: height/2</b>
        <p>
          焦点的y坐标，当使用setData方法设置宽高时，会自动把焦点设置为容器的中心。
        </p>
      </section>
      <section id="fillColor">
        <h1>fillColor: CanvasRenderingContext2D["fillStyle"]</h1>
        <b>default: '#000000'</b>
        <p>图形填充色。如果需要设置图片填充，推荐使用texture。</p>
      </section>
      <section id="shadowColor">
        <h1>shadowColor: string</h1>
        <b>default: '#000000'</b>
        <p>阴影颜色。</p>
      </section>
      <section id="shadowBlur">
        <h1>shadowBlur: number</h1>
        <b>default: 0</b>
        <p>阴影模糊值。</p>
      </section>
      <section id="shadowOffsetX">
        <h1>shadowOffsetX: number</h1>
        <b>default: 0</b>
        <p>阴影X轴偏移值。</p>
      </section>
      <section id="shadowOffsetY">
        <h1>shadowOffsetY: number</h1>
        <b>default: 0</b>
        <p>阴影Y轴偏移值。</p>
      </section>
      <section id="strokeStyle">
        <h1>strokeStyle: CanvasRenderingContext2D["strokeStyle"]|null</h1>
        <b>default: null</b>
        <p>图形描边样式。</p>
      </section>
      <section id="lineWidth">
        <h1>lineWidth: number</h1>
        <b>default: 0</b>
        <p>图形描边线宽。</p>
      </section>
      <section id="lineCap">
        <h1>lineCap: CanvasRenderingContext2D["lineCap"]</h1>
        <b>default: "butt"</b>
        <p>图形描边末端形状。</p>
      </section>
      <section id="lineDashOffset">
        <h1>lineDashOffset: CanvasRenderingContext2D["lineDashOffset"]</h1>
        <b>default: 0</b>
        <p>图形描边虚线设置，请参考mdn。</p>
      </section>
      <section id="lineJoin">
        <h1>lineJoin: CanvasRenderingContext2D["lineJoin"]</h1>
        <b>default: "miter"</b>
        <p>图形描边连接处形状。</p>
      </section>
      <section id="miterLimit">
        <h1>miterLimit: CanvasRenderingContext2D["miterLimit"]</h1>
        <b>default: 0</b>
        <p>图形描边最大斜接长度。详情参考mdn。</p>
      </section>
      <section id="scaleX">
        <h1>scaleX: number</h1>
        <b>default: 1</b>
        <p>X轴方向上的缩放值</p>
      </section>
      <section id="scaleY">
        <h1>scaleY: number</h1>
        <b>default: 1</b>
        <p>Y轴方向上的缩放值</p>
      </section>
      <section id="rotate">
        <h1>rotate: number</h1>
        <b>default: 0</b>
        <p>旋转角度，旋转中心是焦点的位置。</p>
      </section>
      <section id="opacity">
        <h1>opacity: number</h1>
        <b>default: 1</b>
        <p>透明度。与碰撞体无关，只与视觉体有关。</p>
      </section>
      <section id="accumulateTransform">
        <h1>accumulateTransform: DOMMatrix</h1>
        <b>default: new DOMMatrix()</b>
        <p>
          当前角色在渲染树中的累计形变矩阵，用于计算实际坐标，会被自动更新。
        </p>
      </section>
      <section id="renderable">
        <h1>renderable: boolean</h1>
        <b>default: true</b>
        <p>当前角色是否需要渲染。设置为false时，子角色也不会被渲染。</p>
      </section>
      <section id="collisionable">
        <h1>collisionable: boolean</h1>
        <b>default: true</b>
        <p>当前角色是否可被检测碰撞。设置为false时，子角色也不会被检测。</p>
      </section>
      <section id="dm">
        <h1>dm: Davinci</h1>
        <b>default: auto</b>
        <p>
          画布实例，初始化时必须传入，当需要修改时，硬考虑层级依赖问题，不建议修改。
        </p>
      </section>
      <section id="shape">
        <h1>shape: Dshape|any</h1>
        <b>default: null</b>
        <p>视觉体，可以使用官方提供的图形，或者自定。</p>
      </section>
      <section id="collider">
        <h1>collider: Dcollider|any</h1>
        <b>default: null</b>
        <p>碰撞体，可以使用官方提供的图形，或者自定。</p>
      </section>
      <section id="texture">
        <h1>texture: string | null</h1>
        <b>default: null</b>
        <p>图形纹理，接受一个图片地址。</p>
      </section>
      <section id="children">
        <h1>children: Dcharacter[]</h1>
        <b>default: []</b>
        <p>子角色，建议使用addchild和deletechild方法进行改动。</p>
      </section>
      <section id="penetrate">
        <h1>penetrate: boolean</h1>
        <b>default: false</b>
        <p>是否击穿。有别于collisionable，penetrate不会影响子级碰撞检测。</p>
      </section>
      <section id="visiable">
        <h1>visiable: boolean</h1>
        <b>default: true</b>
        <p>是否可视。有别于renderable，visiable不会影响子级渲染。</p>
      </section>
    </Fund>
  );
}
