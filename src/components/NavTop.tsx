import styled from "styled-components";

const Fund = styled.div`
  width: 100%;
  height: 60px;
  box-shadow: inset 0px -2px 2px 1px #ffffff;
  display: flex;
  align-items: center;
  padding: 10px;
  background: #2b2b2b;
  cursor: pointer;
`;

export default function NavTop() {
  function goto() {
    window.open("https://github.com/buildgate/daVinci");
  }

  return (
    <Fund onClick={goto}>
      <div style={{ color: "#ff6a00", margin: "0 5px" }}>DaVinci</div>
      <div style={{ color: "#9a9a9a", margin: "0 5px" }}>for</div>
      <div style={{ color: "#258125", margin: "0 5px" }}>canvas</div>
    </Fund>
  );
}
