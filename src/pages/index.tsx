import Header from "./header";
import Content from "./content";
import "./index.less";
interface HomeProps {
  backgroundColor: string;
  width?: number;
  height?: number;
  img?: string;
}

export default () => {
  const pre = `core-paint`;
  return (
    <div className={pre}>
      <Header pre={pre} />
      <Content pre={pre} canvasSize={{ width: 500, height: 500 }} backgroundColor={"#fff"} />
    </div>
  );
};
