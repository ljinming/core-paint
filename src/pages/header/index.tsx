import { getToolIcon } from "../utils/tool";
import board from "@/board";
import Board from "@/board";

interface HeaderProps {
  pre?: string;
}

const handleChange = (type: string) => {
  switch (type) {
    case "clearAll":
      board.clearAll();
      break;
    case "undo":
      board.tapHistoryBtn(-1);
      break;
    case "redo":
      board.tapHistoryBtn(1);
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
    </div>
  );
};
