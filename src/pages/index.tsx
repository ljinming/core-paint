import Header from "./header";
import Content from "./content";
import "./index.less";

export default () => {
  const pre = `core-paint`;
  return (
    <div className={pre}>
      <Header pre={pre} />
      <Content pre={pre} />
    </div>
  );
};
