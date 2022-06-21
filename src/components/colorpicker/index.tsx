import { useState } from "react";
import { SketchPicker } from "react-color";

import "./index.less";

interface ColorProps {
  color?: string;
  onChange: (color: string) => void;
}

export default (props: ColorProps) => {
  const { color, onChange } = props;
  const [showColor, setColor] = useState(color || "");

  const handleChange = (color: any, event: any) => {
    setColor(color.hex);
    onChange(color.hex);
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
