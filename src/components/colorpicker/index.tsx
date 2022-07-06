import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { toHexString } from "@/tool/colorChange";
import "./index.less";
import { getToolIcon } from "@/pages/utils/tool";
import Action from "@/action";
import { connect } from "react-redux";
import { RootState, StrawState } from "@/models/type";
import { Tool } from "@/tool";

interface ColorProps {
  color?: string;
  onChange: (color: string) => void;
  straw: StrawState;
}

const ColorPicker = (props: ColorProps) => {
  const { color, onChange, straw } = props;
  const [showColor, setColor] = useState(color || "#000");

  const handleChange = (color: any, event: any) => {
    if (Tool.strawColor !== "") {
      Tool.strawColor = "";
    }
    const hexColor: string = toHexString(color.rgb);
    setColor(hexColor);
    onChange(hexColor);
  };

  useEffect(() => {
    setColor(straw.strawColor);
  }, [straw.strawColor]);

  useEffect(() => {
    setColor(color);
  }, [color]);

  return (
    <div className="colorBox">
      <h3>Color</h3>
      <SketchPicker
        className="colorBox-picker"
        width="100%"
        disableAlpha={false}
        color={showColor}
        onChange={handleChange}
      />
      <span
        className={`straw-color ${straw.strawFlag ? "selected-straw" : ""}`}
        onClick={() => {
          Tool.strawFlag = true;
          Action.emit("paint.straw", {
            strawFlag: true,
          });
        }}
      >
        {getToolIcon("strawIcon")}
      </span>
    </div>
  );
};
function mapStateToProps(state: RootState) {
  console.log("==435", state.paint.straw);
  return {
    straw: state.paint.straw,
  };
}

export default connect(mapStateToProps)(ColorPicker);
