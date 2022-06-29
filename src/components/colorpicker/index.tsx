import { useState } from "react";
import { SketchPicker } from "react-color";
import { toHexString } from "@/board/colorChange";
import "./index.less";

interface ColorProps {
  color?: string;
  onChange: (color: string) => void;
}

export default (props: ColorProps) => {
  const { color, onChange } = props;
  const [showColor, setColor] = useState(color || "#000");

  const handleChange = (color: any, event: any) => {
    const hexColor: string = toHexString(color.rgb);
    setColor(hexColor);
    onChange(hexColor);
  };

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
    </div>
  );
};
