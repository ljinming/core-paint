import { connect, useSelector, shallowEqual } from "react-redux";
import ToolType from "./ToolType";
import "./index.less";
import FabricJSCanvas from "./canvas";
import { RootState } from "@/models/type";
import Board from "@/board";
import Pencil from "./Pencil";
import Shape from "./Shape";
interface ContentProps {
  pre: string;
  tool: string;
  backgroundColor: string;
  canvasSize: {
    width: number;
    height: number;
  };
}

const Content = (props: ContentProps) => {
  const { pre, tool, backgroundColor, canvasSize } = props;

  // const tool = useSelector((state: RootState) => {
  //   console.log("select---", state);
  //   return {
  //     tool: state.paint.tool.select
  //   };
  // }, shallowEqual);

  console.log("==", tool);
  const renderRight = () => {
    let right = <>test</>;
    switch (tool) {
      case "PEN":
        return <Pencil board={Board} />;
      case "SHAPE":
        return <Shape board={Board} />;
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={tool} />
      <div className={`${pre}-content-canvas`}>
        <FabricJSCanvas canvasSize={canvasSize} tool={tool} board={Board} backgroundColor={backgroundColor} />
      </div>
      <div className={`${pre}-content-right`}>{renderRight()}</div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  console.log("=====", state);
  return {
    tool: state.paint.tool.select
  };
}

export default connect(mapStateToProps)(Content);

//export default Content;
