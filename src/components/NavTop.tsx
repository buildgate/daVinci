import styled from "styled-components";

const Fund = styled.div`
  width: 100%;
  height: 50px;
  box-shadow: 0px 2px 5px 1px #dedede;
  display: flex;
  align-items: center;
  padding: 10px;
`;

export default function NavTop() {
  return (
    <Fund>
      <div style={{ color: "#ff6a00", margin: "0 5px" }}>DaVinci</div>
      <div style={{ color: "#9a9a9a", margin: "0 5px" }}>for</div>
      <div style={{ color: "#9a9a9a", margin: "0 5px" }}>canvas</div>
    </Fund>
  );
}
