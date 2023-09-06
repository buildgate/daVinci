import styled from "styled-components";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { ApiClassItem } from "@root/src/components/common/ApiClassItem";

const Fund = styled.div``;

export default function Dclass() {
  const class_data = [
    {
      id: `Davinci`,
      name: `Davinci`,
      code: ``,
      superName: ``,
      constructorParam: `fundElement?: string, options?: Dcharacter_data`,
      des: `Davinci类是插件的基础类，所有功能都依赖于此类。构建函数可以输入两个参数，挂载元素和宽高设置。
      可以使用自定义挂载，宽高设置可以通过setdata方法设置。初始化时会自动生成一个Dcharacter作为画布的基础元素，这个Dcharacter会与画布的宽高进行同步。`,
    },
    {
      id: `Dcharacter`,
      name: `Dcharacter`,
      code: ``,
      superName: ``,
      constructorParam: `data: Dcharacter_data, DM: Davinci`,
      des: `Dcharacter类是初始化时会返回一个proxy对象，Dcharacter的属性值会被监听，当检测到修改时会自动调用render函数。初始化时需要传入一个Davinci实例来绑定视图更新的操作。`,
    },
    {
      id: `Dshape`,
      name: `Dshape`,
      code: `
  type Dpath_rect = {
    width: number;
    height: number;
  };
  type Dpath_arc = {
    radius: number;
  };
  type Dpath_polygon = Array<
    | [number, number]
    | [number, number, number, number]
    | [number, number, number, number, number, number]
  >;
  type Dpath = Dpath_rect | Dpath_arc | Dpath_polygon;
  
  type Dshape_data_rect = {
    type: "rect";
    path: Dpath_rect;
  };
  type Dshape_data_arc = {
    type: "arc";
    path: Dpath_arc;
  };
  type Dshape_data_polygon = {
    type: "polygon";
    path: Dpath_polygon;
  };
  type Dshape_data = Dshape_data_rect | Dshape_data_arc | Dshape_data_polygon;
      `,
      superName: ``,
      constructorParam: `data: Dshape_data`,
      des: `Dshape类用于创建一个视觉体图形，目前官方提供了矩形，圆形，多边形三种图形。多边形提供三种线段类型：直线，二次贝塞尔曲线，三次贝塞尔曲线。`,
    },
    {
      id: `Dcollider`,
      name: `Dcollider`,
      code: ``,
      superName: `Dshape`,
      constructorParam: `data: Dshape_data`,
      des: `Dcollider类用于创建一个碰撞体图形，实际上和Dshape是通用的，因为Dcollider是继承于Dshape类的。目前只是为了规范化处理所以设置这个类。`,
    },
    {
      id: `Drect`,
      name: `Drect`,
      code: ``,
      superName: `Dcharacter`,
      constructorParam: `data: Dcharacter_data, DM: Davinci`,
      des: `Drect类继承于Dcharacter类，属性和使用方法与Dcharacter一致，用于快速创建一个宽高和容器宽高一致的矩形。`,
    },
    {
      id: `Darc`,
      name: `Darc`,
      code: ``,
      superName: `Dcharacter`,
      constructorParam: `data: Dcharacter_data, DM: Davinci`,
      des: `Darc类继承于Dcharacter类，属性和使用方法与Dcharacter一致，用于快速创建一个直径和容器的宽度一致的圆形。`,
    },
    {
      id: `Dtri`,
      name: `Dtri`,
      code: ``,
      superName: `Dcharacter`,
      constructorParam: `data: Dcharacter_data & {centerOffset?: number}, DM: Davinci`,
      des: `Dtri类继承于Dcharacter类，属性和使用方法与Dcharacter一致，用于快速创建一个高为容器的高，底为容器宽度的三角形。构建新对象时，设置centerOffset可以得出不同类型的三角形。`,
    },
  ];

  const anchor = useLocation().state.anchor;

  useEffect(() => {
    document
      .querySelector("#" + anchor)
      ?.scrollIntoView({ behavior: "smooth" });
  }, [anchor]);

  return (
    <Fund>
      <section>
        <b>
          本章将介绍官方提供的类，强烈建议使用typescript进行开发，因为类型提示功能将在插件中发挥重要的作用。
        </b>
      </section>

      {class_data.map((o) => {
        return <ApiClassItem {...o} key={o.id}></ApiClassItem>;
      })}
    </Fund>
  );
}
