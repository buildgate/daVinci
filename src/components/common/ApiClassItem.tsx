import styled from "styled-components";

import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface props {
  [key: string]: any;
  id?: string;
  des?: string;
  name?: string;
  code?: string;
  superName?: string;
  constructorParam?: string;
}

const Fund = styled.div`
  width: 100%;
  margin-bottom: 30px;
  box-shadow: 4px 4px 5px 2px #cccccccf, -4px -4px 5px 2px #ffffffcf,
    inset 0px 0px 0px 0px #cccccccf;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 0px 0px 0px 0px #cccccccf, 0px 0px 0px 0px #ffffffcf,
      inset 4px 4px 5px 2px #cccccccf, inset -4px -4px 5px 2px #ffffffcf;
    background: #fff7f5;
  }
  .name {
    color: #00495a;
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 10px;
  }
  .superName {
    font-size: 16px;
    font-weight: bold;
    color: #00495a;
    margin-bottom: 10px;
  }
  .constructorParam {
    font-size: 16px;
    font-weight: bold;
    color: #00495a;
    margin-bottom: 10px;
  }
  .des {
    padding-top: 20px;
    border-top: 1px solid #cacaca;
    color: #343130;
  }
  .code-wapper {
    margin-bottom: 10px;
  }
`;

export function ApiClassItem(props: props) {
  let { name, des, id, code, superName, constructorParam, children } = props;
  return (
    <Fund id={id}>
      <div className="name">
        <span>{name}</span>
      </div>
      {superName ? (
        <div className="superName">
          <span>extends：</span>
          <span style={{ color: "#ff6a00" }}>{superName}</span>
        </div>
      ) : null}
      <div className="constructorParam">
        <span>constructor</span>
        {" ( "}
        {constructorParam ? (
          <span style={{ color: "#ff6a00" }}> {constructorParam}</span>
        ) : null}
        {" )  "}
      </div>
      {code ? (
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yDark}>
            {code}
          </SyntaxHighlighter>
        </div>
      ) : null}
      <div className="des">
        {des ? <p>{des}</p> : null}
        {children}
      </div>
    </Fund>
  );
}
