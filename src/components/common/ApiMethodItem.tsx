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
  box-shadow: 4px 4px 5px 2px #cccccccf, -4px -4px 5px 2px #ffffffcf;
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
