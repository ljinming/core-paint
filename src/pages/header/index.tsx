import { getToolIcon } from "../utils/tool";
import board from "@/board";
import Board from "@/board";
import { Tool } from "@/tool";

interface HeaderProps {
  pre?: string;
}

const handleChange = (type: string) => {
  switch (type) {
    case "clearAll":
      Tool.clearAll();
      //board.clearAll();
      break;
    case "undo":
      Tool.tapHistoryBtn(-1);
      //board.tapHistoryBtn(-1);
      break;
    case "redo":
      Tool.tapHistoryBtn(1);
      // board.tapHistoryBtn(1);
      break;
  }
};

export default (props: HeaderProps) => {
  const { pre } = props;
  return (
    <div className={`${pre}-header`}>
      <span
        title="Clear All"
        className="operator-item"
        onClick={() => handleChange("clearAll")}
      >
        {getToolIcon("clearIcon")}
      </span>
      <span
        title="Undo"
        className="operator-item"
        onClick={() => handleChange("undo")}
      >
        {getToolIcon("undoIcon")}
      </span>
      <span
        title="Redo"
        style={{ transform: "rotateY(180deg)" }}
        className="operator-item"
        onClick={() => handleChange("redo")}
      >
        {getToolIcon("undoIcon")}
      </span>
      <span
        className="operator-item"
        onClick={() => {
          if (Tool.stateArr.length > 0) {
            console.log("==34", Tool.stateArr[0]);
          }
          //console.log("-保存--345", Tool.canvas.toDataURL());
        }}
      >
        保存
      </span>
      <span
        className="operator-item"
        onClick={() => {
          if (Tool.stateArr.length > 0) {
            console.log("==34", Tool.stateArr[0]);
            Tool.canvas.loadFromJSON(Tool.stateArr[0], (vw) => {
              console.log("--345", vw);
            });
          }
          //console.log("-保存--345", Tool.canvas.toDataURL());
        }}
      >
        油漆桶
      </span>
    </div>
  );
};
