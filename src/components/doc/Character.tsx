import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Fund = styled.div``;

export default function Character() {
  return (
    <Fund>
      <section>
        <h1>角色</h1>
        <p>
          每个渲染的个体称之为<b>角色（Dcharacter）</b>。
        </p>
        <p>
          每个角色的属性可以大致分为三大类型：定位和样式属性，视觉体相关属性和碰撞体相关属性，自定义属性。
        </p>
        <br />
        <p>
          <b>定位和样式</b>
          ：定位属性指的是影响角色在坐标系下渲染的位置的属性，样式属性指的是像阴影、背景颜色、纹理、缩放、旋转等属性。
        </p>
        <p>
          <b>视觉体相关属性和碰撞体相关属性</b>
          ：在基础原理里有介绍过视觉体和碰撞体是如何渲染的，rendering和colliding、shape和collider这种都是和视觉碰撞相关的。
        </p>
        <p>
          <b>自定义属性</b>
          ：除了一些初始化默认会设置的属性之外，开发者还可以在角色中添加自定义的属性，通常在自定义渲染和自定义碰撞中使用自定义属性。
        </p>
        <br />
        <p>角色同时也会有一些默认的方法。例如以下常用的方法：</p>
        <p>
          <b>addChild</b>:添加子角色。
        </p>
        <p>
          <b>deleteChild</b>:删除子角色。
        </p>
        <p>
          <b>addEventListener</b>:添加监听器。
        </p>
        <p>
          <b>removeEventListener</b>:删除监听器。
        </p>
        <p>在此不一一赘述。</p>
        <br />
        <p>
          角色在初始化的时候必须传入一个davinci实例，因为角色本身很多方法都必须依赖davinci实例进行操作。角色在初始化的时候就会生成一个uid，
          这个uid是全局唯一的。实际上角色在生成了uid和绑定了davinci实例之后就不应该被复用，因为这样就保证不了uid的唯一性；如果同一个角色在多个davinci中同时使用，
          那么永远只会在最后一个绑定的davinci实例里生效。
        </p>
        <br />
        <p>
          角色类在构建时会返回一个proxy对象，绝大部分的默认属性和所有的自定义属性都会被监听。当这些属性被修改时，会默认触发一次快照渲染以确保渲染不会落后。
          开发者并不需要太过担心频繁修改属性会影响渲染性能的问题，在渲染机制里有详细介绍过这一点。
        </p>
        <b>在1.1.0版本删除了快照渲染，统一采用全局渲染</b>
      </section>
      <section>
        <h1>子角色</h1>
        <p>
          每个角色都可以拥有子角色，子角色将会以数组的形式存在children属性里面，子角色是通过
          <b>zidx</b>
          属性进行升序排序的。所以在添加子角色时最好手动设置zidx属性，以确保层级关系的正确。
          既然暴露了children这个属性，开发者也确实可以通过直接操作children来插入或者删除子角色，
          但是要注意关于zidx的排序问题，还有操作完成后需要手动触发一次渲染，而官方提供的方法已自动为你解决了这两点问题。
        </p>
        <br />
        <p>
          有一点值得注意的是，当修改子角色的zidx属性时，会触发一次快照渲染，但是这个快照渲染的uid是父角色的uid，因为修改zidx属性时，引擎是无法确定这个改动的影响范围，
          所以只能认为这次改动是父角色下的所有角色都被改动了。
        </p>
        <b>在1.1.0版本删除了快照渲染，统一采用全局渲染</b>
      </section>
      <section>
        <h1>根角色</h1>
        <p>
          在渲染机制里面有提到<b>根角色</b>
          这个对象，根角色是所有渲染和碰撞的起点。每个davinci对象里面都会在初始化时创建一个根角色，根角色是代表画布本身，所以根角色的大小是默认设置成和画布的大小一致的，
          并且根角色的视觉体和碰撞体都会是和画布宽高保持一致的矩形。根角色也不应该设置任何样式，因为这些样式有可能影响所有子角色的渲染和碰撞。
        </p>
        <p>
          <b>
            在绝大部分的情况下根角色都不应该是我们的操作对象，这一点需要注意！！！
          </b>
        </p>
      </section>
    </Fund>
  );
}
