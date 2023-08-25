import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Fund = styled.div``;

export default function Dmethod() {
  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  return (
    <Fund>
      <section>
        <b>本章将介绍关于类的方法。</b>
      </section>
      <br />
      <h2>以下是Davinci类下的方法</h2>
      <br />
      <section id="setData">
        <h1>setData(options?: Davinci_data):void</h1>
        <p>
          用于设置画布的宽高，若干不传入参数，则功能为将canvas的宽高同步至Dboard。
        </p>
      </section>
      <section id="mount">
        <h1>mount(fundElement: string):void</h1>
        <p>挂载根元素，将Davinci生成的画布挂载到目标元素内。</p>
      </section>
      <section id="render">
        <h1>render()</h1>
        <p>全局渲染。调用时将会刷新当前的所有角色渲染。</p>
      </section>
      <section id="globalTextureComplete">
        <h1>globalTextureComplete():void</h1>
        <p>
          检测所有角色的纹理是否已经加载完成，如果完成将会调用onGlobalTextureComplete()方法。
        </p>
      </section>
      <section id="onGlobalTextureComplete">
        <h1>onGlobalTextureComplete():any</h1>
        <p>自定义方法，所有角色纹理加载完成后被调用。</p>
      </section>
      <section id="matrixCalc">
        <h1>
          matrixCalc(matrix: DOMMatrix, x: number, y: number):
          {"{ x: number, y: number }"}
        </h1>
        <p>用于计算指定变换体系下坐标相对于画布的绝对坐标。</p>
      </section>
      <br />
      <h2>以下是Dcharacter类下的方法</h2>
      <br />
      <section id="Dcharacter.setData">
        <h1>setData(data: Dcharacter_data):void</h1>
        <p>
          用于批量设置Dcharacter的属性。注意一点，如果在不设置焦点的情况下设置宽高，那么焦点将会自动调整至新的中心点，如果想自定义焦点，请连同焦点值一同设置。
          Dcharacter_data类型请参考类属性的内容，所有被提及的属性或者自定义属性都可以被设置。
        </p>
      </section>
      <section id="Dcharacter.matrixCalc">
        <h1>matrixCalc(x: number, y: number):{"{ x: number, y: number }"}</h1>
        <p>用于计算角色内坐标相对画布的绝对坐标。</p>
      </section>
      <section id="childrenSort">
        <h1>childrenSort(order: string = "asc"):void</h1>
        <p>用于子角色排序，但是排序结束后需要手动调用一次画布更新。</p>
      </section>
      <section id="initTexture">
        <h1>initTexture(originTexture: string):void</h1>
        <p>初始化纹理，调用结束时会触发全局纹理检测globalTextureComplete()。</p>
      </section>
      <section id="addEventListener">
        <h1>
          {"addEventListener(type: Devent_type, fn: (event: Devent) => any)"}
          :void
        </h1>
        <p>
          为角色添加事件监听。fn如果使用匿名函数，那么将无法删除，如需频繁修改，那么请传入具名函数。
        </p>
      </section>
      <section id="removeEventListener">
        <h1>removeEventListener(type: Devent_type, fn_name?: string):void</h1>
        <p>
          用于移除监听事件，fn_name未函数名，如果在添加监听时候使用的是匿名函数，那么将无法删除；
          如果fn_name不传入，则会将所有已配置的事件清空。
        </p>
      </section>
      <section id="addChild">
        <h1>{"addChild(data: Dcharacter | Array<Dcharacter>)"}:void</h1>
        <p>用于添加子角色，接受一个角色或者一个角色数组批量添加。</p>
      </section>
      <section id="deleteChild">
        <h1>deleteChild(child: Dcharacter):void</h1>
        <p>用于删除子角色，接受一个角色作为参数。</p>
      </section>
    </Fund>
  );
}
