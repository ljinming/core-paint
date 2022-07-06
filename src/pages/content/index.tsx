import { connect, useSelector, shallowEqual } from "react-redux";
import ToolType from "./ToolType";
import "./index.less";
import FabricJSCanvas from "./canvas";
import { RootState } from "@/models/type";
import Board from "@/board";
import Pencil from "./Pencil";
import Shape from "./Shape";
import Eraser from "./Eraser";
import Text from "./Text";
import FillColor from "./FillColor";
import { useState } from "react";
import board from "@/board";
interface ContentProps {
  pre: string;
  tool: string;
  backgroundColor: string;
  imgSrc?: string;
  canvasSize: {
    width: number;
    height: number;
  };
  straw: {
    strawFlag: boolean;
    strawColor: string;
  };
}

const Content = (props: ContentProps) => {
  const { pre, tool, imgSrc, backgroundColor, canvasSize, straw } = props;
  const [fillColor, setFillColor] = useState(board.fillColor);
  // const tool = useSelector((state: RootState) => {
  //   console.log("select---", state);
  //   return {
  //     tool: state.paint.tool.select
  //   };
  // }, shallowEqual);

  const renderRight = () => {
    let right = <>test</>;
    switch (tool) {
      case "PEN":
        return <Pencil board={Board} />;
      case "SHAPE":
        return <Shape board={Board} />;
      case "ERASER":
        return <Eraser board={Board} />;
      case "TEXT":
        return <Text board={Board} />;
      case "BUCKET":
        return (
          <FillColor
            board={Board}
            onChange={(color: string) => setFillColor(color)}
          />
        );
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={tool} color={fillColor} />
      <div className={`${pre}-content-canvas`}>
        <FabricJSCanvas
          canvasSize={canvasSize}
          tool={tool}
          imgSrc={imgSrc}
          board={Board}
          straw={straw}
          backgroundColor={backgroundColor}
        />
      </div>
      <div className={`${pre}-content-right`}>{renderRight()}</div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  return {
    tool: state.paint.tool.select,
    straw: state.paint.straw,
  };
}

export default connect(mapStateToProps)(Content);

//export default Content;
