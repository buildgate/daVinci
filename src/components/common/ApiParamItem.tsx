import styled from "styled-components";

interface props {
  [key: string]: any;
  defVal?: string;
  name?: string;
  des?: any;
  id?: any;
  type?: any;
}

const Fund = styled.div`
  width: 100%;
  margin-bottom: 30px;
  box-shadow: 4px 4px 5px 2px #cccccccf, -4px -4px 5px 2px #ffffffcf;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.5s;
  &:hover {
    box-shadow: inset 4px 4px 5px 2px #cccccccf,
      inset -4px -4px 5px 2px #ffffffcf;
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

export function ApiParamItem(props: props) {
  let { name, defVal, des, children, id, type } = props;
  return (
    <Fund id={id}>
      <div className="name">
        <span>{name}</span>
        {type ? " : " : null}
        {type ? <span style={{ color: "#ff6a00" }}> {type}</span> : null}
      </div>
      {defVal ? (
        <div className="defVal">
          <span>default</span>
          {" : "}
          <span style={{ color: "#ff6a00" }}>{defVal}</span>
        </div>
      ) : null}
      <div className="des">
        {des ? <p>{des}</p> : null}
        {children}
      </div>
    </Fund>
  );
}
