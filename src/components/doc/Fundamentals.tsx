import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Fund = styled.div``;

export default function Fundamentals() {
  return (
    <Fund>
      <section>
        <h1>设计思路</h1>
        <p>
          canvas和svg一样都是可以绘制图形和线条。svg可以保存所有绘画轨迹，对线条或者点都可以进行记录，所以可操作性很强。canvas则是在绘制图像之后就不在对里面的内容托管了，所以操作性会很低甚至可以说是无操作性。
        </p>
        <p>
          所以设计思路也十分简单，就是将canvas的渲染图形保存起来，每一次对图形的操作都重新渲染一次画布。
        </p>
        <br />
        <p>
          通过<b>Dcharacter</b>类可以将图形的所有信息保存起来，在引擎中称为
          <b>角色</b>。
        </p>
        <p>
          每次数据改动都将所有角色按次序渲染出来，那么就可以实现通过数据去操作画布里面的元素。
        </p>
        <br />
      </section>
      <section>
        <h1>渲染机制</h1>
        <p>
          davinci里面有且仅有一个根角色<b>Dboard</b>。所有的角色都通过
          <b>addChild</b>
          的方式加入到根角色里，每个角色都可以拥有自己的子级。最后会形成一棵类似于DOM树的结构树。
          渲染的起点总是从根角色开始，通过先根遍历的方式对所有角色层层渲染。
        </p>
        <br />
        <p>
          canvas在渲染API里提供了一个非常神奇的属性globalCompositeOperation，可以有很多种渲染模式。在davinci最初的设计里面是有采用从顶层向底层渲染的方案的，但是后来加入了子级机制之后就放弃了这种设计思路。
          因为当子级需要继承父级的一些属性时，就不得不采用从底层向顶层渲染的方式，即便是使用后根遍历的方式也同样存在一些问题，而且
          <b>快照渲染</b>是必须依赖从底层向顶层的渲染方式。
        </p>
        <br />
        <div className="scene">
          <p>试想一下以下场景：</p>
          <p>
            你已经设置了100个角色在画布里面。如果需要改动第98号元素10次，那么就需要这100个元素都重新渲染10次，那么你将做了1000次渲染操作。
          </p>
          <p>
            但是实际上你其实只需要重新渲染第98、99、100号元素，因为下层元素实际上是不会对上层有影响的。那么理论上情况下只需要进行30次的渲染操作。
          </p>
        </div>
        <br />
        <p>
          这里就引入了<b>快照渲染</b>
          的概念。所有的角色对象在进入本体的渲染逻辑之前都将当前画布保存一张图片，这里称之为
          <b>快照</b>。
        </p>
        <br />
        <p>
          每个角色对象在初始化的时候会生成一个不可修改的uid。每次当角色属性改变时就会将uid传个渲染函数，渲染函数会在整个遍历整个角色树，直到匹配到uid就会在该层使用快照渲染底层，
          然后往上的角色会进行正常的渲染。如上述场景，再匹配到第98号元素之前，都不会进行渲染，直到找到98号元素开始使用快照来渲染1-97号元素，第98，99，199号元素会正常渲染。
        </p>
        <br />
        <p>
          如果没有找到匹配的uid就会进行一次全局渲染，所以当你需要使用快照渲染时，请务必确定目标元素的uid。
        </p>
        <br />
        <p>
          目前角色对象上的大部分的属性的改变都会自动调用render函数，这可能会导致另一个性能问题。
          当一个或多个角色频繁修改属性时，由于渲染函数不是一瞬间完成的，所以会堆积多次渲染操作，导致在多次渲染后会出现数据滞后或者卡顿的情况。
        </p>
        <br />
        <p>
          采用<b>按帧节流</b>
          的方式可以完美解决这个问题。按帧节流确保每一帧只执行一次渲染函数。如果现在正在进行渲染，途中收到一个新的渲染请求，那么这个新的请求会进入渲染队列，
          当前渲染完成之后会去查看渲染队列里面是否有等待的渲染，如果有则会将等待队列里面的内容整合成一次渲染进行，即使渲染途中插入了10000个渲染请求，在下一帧也只会执行一次渲染，
          这样就可以确保每一帧都只有一个状态，并且不会让数据落后。
        </p>
      </section>
      <section>
        <h1>碰撞机制</h1>
        <p>
          碰撞机制是模拟dom的事件机制实现的。原理上是通过canvas元素的鼠标事件去触发内部元素的事件。
        </p>
        <br />
        <p>
          目前画布碰撞检测有两种比较常用的方法：一种是采用<b>颜色hash检测</b>
          ，另一种是采用<b>数学检测</b>。
        </p>
        <br />
        <p>
          <b>颜色hash检测</b>：
          是额外创建一个副本画布，每个元素渲染的时候都会在这个副本渲染一个唯一颜色的图形，这个唯一的颜色值就是对于这个元素的uid。每次触发鼠标事件时检测这个点的颜色值，
          确认触发的是哪个元素。这个方式在检测的效率上会比较高，只要主画布的内容不变这个方法将会是最高效的。但是缺点也很明显，无法实现元素穿透，而且渲染的时候必须让副画布和主画布同步渲染。
        </p>
        <p>
          <b>数学检测</b>：
          也需要创建一个副本画布，相对于颜色hash检测的好处是不需要管理副本画布的内容，只需要每次在副本绘制碰撞路径，检测触发点是否在路径里面即可。
        </p>
        <br />
        <p>
          由于davinci有元素穿透的设计，所以使用了数学检测的方法。实际上数学检测也可以拥有很好的检测性能，检测是从顶层向底层开始遍历的，恰好与渲染的顺序相反。
          因为上层元素的触发优先度永远会比下层的高，所以一旦上层检测到对象，下层将不会再去遍历，直接返回目标元素，并且执行触发事件。
        </p>

        <br />
        <p>
          由于碰撞检测也需要一个实际的图形，所以shape和collider实际上是通用的。
        </p>
      </section>
    </Fund>
  );
}
