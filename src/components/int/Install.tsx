import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

const Fund = styled.div``;

export default function Install() {
  const code1 = `
    npm i @buildgate/davinci
    `;

  const code2 = `
    import { Dcharacter, Davinci } from "davinci";//确保画布已经被引入

    const DM = new Davinci();

    DM.mount("#app")//在目标dom渲染完成之后再进行挂载
    DM.render();

    //vue
    mounted(){
        DM.mount("#app")
        DM.render();
    }

    //react
    useEffect(() => {
        DM.mount("#app");
        DM.render();
      });
    `;

  return (
    <Fund>
      <section>
        <h1>使用npm</h1>
        <div className="code-wapper">
          <SyntaxHighlighter language="auto" style={a11yLight}>
            {code1}
          </SyntaxHighlighter>
        </div>
      </section>
      <section>
        <h1>在react或vue中使用</h1>
        <p>
          其实在其他框架上的使用也是一样的，只需要保证画布在挂载的时候，目标dom已经被渲染完成即可。
        </p>
        <div className="code-wapper">
          <SyntaxHighlighter language="typescript" style={a11yLight}>
            {code2}
          </SyntaxHighlighter>
        </div>
      </section>
    </Fund>
  );
}
