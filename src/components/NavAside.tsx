import styled from "styled-components";
import {
  paths,
  paths_int,
  paths_doc,
  paths_api,
  api_anchor,
  paths_addon,
} from "../router";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@root/src/components/common/Collapse";

const Fund = styled.div`
  width: 300px;
  height: 100%;
  box-shadow: 2px 0px 5px 1px #dedede;
  display: flex;
  flex-direction: column;
  overflow: auto;
  > .block {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px #cacaca solid;
    > .title {
      font-size: 14px;
      color: #9a9a9a;
      padding: 10px;
    }
    .menu-item {
      font-size: 16px;
      color: #000000;
      padding: 10px;
      text-indent: 0.5em;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;
    }
  }
`;

export default function NavAside() {
  const navigate = useNavigate();

  return (
    <Fund>
      <div className="int block">
        <div className="title">起步</div>
        {paths_int.children.map((o) => {
          return (
            <div
              className="menu-item"
              key={o.name}
              onClick={() => {
                navigate(o.path);
              }}
            >
              {o.name}
            </div>
          );
        })}
      </div>
      <div className="doc block">
        <div className="title">学习</div>
        {paths_doc.children.map((o) => {
          return (
            <div
              className="menu-item"
              key={o.name}
              onClick={() => {
                navigate(o.path);
              }}
            >
              {o.name}
            </div>
          );
        })}
      </div>
      <div className="api block">
        <div className="title">API</div>
        <Collapse title={"类"}>
          {api_anchor.class.map((o) => {
            return (
              <div
                className="menu-item"
                key={o.name}
                onClick={() => {
                  navigate("/api/class", { state: { anchor: o.name } });
                }}
              >
                {o.name}
              </div>
            );
          })}
        </Collapse>
        <Collapse title={"属性"}>
          {api_anchor.param.map((o) => {
            return (
              <div
                className="menu-item"
                key={o.name}
                onClick={() => {
                  navigate("/api/attribute", { state: { anchor: o.name } });
                }}
              >
                {o.name}
              </div>
            );
          })}
        </Collapse>
        <Collapse title={"方法"}>
          {api_anchor.method.map((o) => {
            return (
              <div
                className="menu-item"
                key={o.name}
                onClick={() => {
                  navigate("/api/method", { state: { anchor: o.name } });
                }}
              >
                {o.name}
              </div>
            );
          })}
        </Collapse>
        <Collapse title={"Hook"}>
          {api_anchor.hook.map((o) => {
            return (
              <div
                className="menu-item"
                key={o.name}
                onClick={() => {
                  navigate("/api/hook", { state: { anchor: o.name } });
                }}
              >
                {o.name}
              </div>
            );
          })}
        </Collapse>
      </div>
      <div className="int block">
        <div className="title">附加项</div>
        {paths_addon.children.map((o) => {
          return (
            <div
              className="menu-item"
              key={o.name}
              onClick={() => {
                navigate(o.path);
              }}
            >
              {o.name}
            </div>
          );
        })}
      </div>
    </Fund>
  );
}
