import styled from "styled-components";
import up from "@root/src/assets/up.png";
import down from "@root/src/assets/down.png";
import { useState } from "react";

interface props {
  [key: string]: any;
  title: string;
}

const Fund = styled.div`
  width: 100%;
  font-size: 16px;
  color: #000000;
  padding: 10px;
  text-indent: 0.5em;
  cursor: pointer;
  > .title {
    width: 100%;
    display: flex;
    align-items: center;
    user-select: none;
    p {
      flex-grow: 1;
    }
    img {
      width: 20px;
      height: 20px;
      font-size: 0;
    }
  }
  > .context {
    transition: all 0.3s;
    .menu-item {
      font-size: 16px;
      color: #000000;
      padding: 10px;
      text-indent: 0.5em;
      cursor: pointer;
    }
  }
`;

export function Collapse(props: props) {
  let { title, children } = props;
  let [isCollapse, setIsCollapse] = useState(true);
  return (
    <Fund>
      <div
        className="title"
        onClick={() => {
          setIsCollapse(!isCollapse);
        }}
      >
        <p>{title}</p>
        <img src={isCollapse ? down : up} alt="" />
      </div>
      {isCollapse ? <div className="context">{children}</div> : null}
    </Fund>
  );
}
