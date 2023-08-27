import styled from "styled-components";

const Fund = styled.div`
  width: 100%;
  height: 50px;
  box-shadow: inset 0px -2px 2px 1px #ffffff;
  display: flex;
  align-items: center;
  padding: 10px;
  background: #2b2b2b;
`;

export default function NavTop() {
  return (
    <Fund>
      <div style={{ color: "#ff6a00", margin: "0 5px" }}>DaVinci</div>
      <div style={{ color: "#9a9a9a", margin: "0 5px" }}>for</div>
      <div style={{ color: "#258125", margin: "0 5px" }}>canvas</div>
    </Fund>
  );
}
