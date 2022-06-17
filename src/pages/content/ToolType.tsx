import { ToolTypeList } from "@/pages/utils";
import { getToolIcon } from "@/pages/utils/tool";
import { toolItem } from "@/pages/utils/tsType";
import { connect, useStore } from "react-redux";
import Action from "@/action";

interface ToolProps {
  prefix: string;
  select?: string;
}

const ToolType = (props: ToolProps) => {
  const { prefix, select } = props;

  return (
    <ul className={`${prefix}-tool`}>
      {ToolTypeList.map((va: toolItem) => {
        return (
          <li
            title={va.title}
            className={`${
              select === va.key ? "tool-item select" : "tool-item"
            }`}
            key={va.key}
            onClick={() => {
              Action.emit("paint.Tool", {
                select: va.key,
              });
            }}
          >
            {getToolIcon(va.icon)}
            {va.key === "Bucket" && <span className="bucket-icon" />}
          </li>
        );
      })}
    </ul>
  );
};

export default ToolType;
