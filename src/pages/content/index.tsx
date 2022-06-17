import { connect, useSelector, shallowEqual } from "react-redux";
import ToolType from "./ToolType";
import "./index.less";
import Pencil from "./Pencil";

interface ContenProps {
  pre: string;
  select?: string;
}

const Content = (props: ContenProps) => {
  const { pre, select } = props;

  // useSelector((state: any) => {
  //   console.log("====3", state);

  //   return {
  //     select: state.paint.Tool?.select,
  //   };
  // }, shallowEqual);
  const renderRight = () => {
    let right = <>test</>;
    switch (select) {
      case "PEN":
        return <Pencil />;
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={select} />
      <div className={`${pre}-content-canvas`}></div>
      <div className={`${pre}-content-right`}>{renderRight()}</div>
    </div>
  );
};

function mapStateToProps(state: any) {
  console.log("---3", state);
  return {
    select: state.paint.Tool?.select,
  };
}

export default connect(mapStateToProps)(Content);
