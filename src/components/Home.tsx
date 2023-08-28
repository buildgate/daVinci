import NavTop from "./NavTop";
import NavAside from "./NavAside";

import styled from "styled-components";

import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useEffect, useRef } from "react";

const Fund = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
  height: 0;
  flex-grow: 1;
  overflow: auto;
  display: flex;
`;

const Page = styled.div`
  width: 100%;
  height: 100%;
  flex-grow: 1;
  overflow: auto;
  padding: 20px;
  .page-container {
    margin: 0 auto;
    width: 1040px;
    padding: 20px;
    box-shadow: 0px 0px 5px 1px #dedede;
    background: #ffffff;
  }
`;

export default function Home() {
  const pathname = useLocation().pathname;

  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === "/") {
      navigate("/learn/brief");
    }
  }, [pathname]);
  return (
    <Fund>
      <NavTop></NavTop>
      <Container>
        <NavAside></NavAside>
        <Page>
          <div className="page-container">
            <Outlet></Outlet>
          </div>
        </Page>
      </Container>
    </Fund>
  );
}
