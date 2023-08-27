import styled from "styled-components";

interface props {
  [key: string]: any;
  id?: string;
  param?: string;
  name?: string;
  type?: any;
  des?: any;
}

const Fund = styled.div`
  width: 100%;
  margin-bottom: 30px;
  box-shadow: 1px 1px 3px 1px #dedede;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.2s;
  &:hover {
    box-shadow: 1px 1px 10px 5px #dedede;
  }
  .name {
    color: #00495a;
    font-size: 20px;
    font-weight: bolder;
    margin-bottom: 10px;
  }
  .defVal {
    font-size: 16px;
    font-weight: bold;
    color: #00495a;
    margin-bottom: 10px;
  }
  .des {
    color: #343130;
  }
`;

export function ApiMethodItem(props: props) {
  let { param, name, des, type, id, children } = props;
  return (
    <Fund id={id}>
      <div className="name">
        <span>{name}</span>
        {" ( "}
        {param ? <span style={{ color: "#ff6a00" }}> {param}</span> : null}
        {" ) : "}
        <span style={{ color: "#ff6a00" }}>{type}</span>
      </div>
      <div className="des">
        {des ? <p>{des}</p> : null}
        {children}
      </div>
    </Fund>
  );
}
