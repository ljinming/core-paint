import { connect, useSelector, shallowEqual } from "react-redux";
import ToolType from "./ToolType";
import "./index.less";
import FabricJSCanvas from "./canvas";
import Pencil from "./Pencil";
import { RootState, PencilState } from "@/models/type";

interface ContentProps {
  pre: string;
  select: string;
  pencil: PencilState;
  backgroundColor: string;
  canvasSize: {
    width: number;
    height: number;
  };
}

const Content = (props: ContentProps) => {
  const { pre, select, pencil, backgroundColor, canvasSize } = props;
  // useSelector((state: any) => {
  //   console.log("====3", state);

  //   return {
  //     select: state.paint.Tool?.select
  //   };
  // });

  const renderRight = () => {
    let right = <>test</>;
    switch (select) {
      case "PEN":
        return <Pencil option={{ ...pencil }} />;
      default:
        break;
    }
    return right;
  };

  return (
    <div className={`${pre}-content`}>
      <ToolType prefix={`${pre}-content`} select={select} />
      <div className={`${pre}-content-canvas`}>
        <FabricJSCanvas canvasSize={canvasSize} backgroundColor={backgroundColor} select={select} />
      </div>
      <div className={`${pre}-content-right`}>{renderRight()}</div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  return {
    select: state.paint.tool.select,
    pencil: state.paint.pencil
  };
}

export default connect(mapStateToProps)(Content);

//export default Content;
