import styled from "styled-components";
import { paths, paths_int, paths_doc } from "../router";
import { useNavigate } from "react-router-dom";

const Fund = styled.div`
  width: 300px;
  height: 100%;
  box-shadow: 2px 0px 5px 1px #dedede;
  display: flex;
  flex-direction: column;
  .block {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px #cacaca solid;
    .title {
      font-size: 14px;
      color: #9a9a9a;
      padding: 10px;
    }
    .menu-item {
      font-size: 16px;
      color: #000000;
      padding: 10px;
      text-indent: 0.5em;
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
    </Fund>
  );
}
