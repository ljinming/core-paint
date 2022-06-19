import { SketchPicker } from "react-color";

import "./index.less";

interface ColorProps {
  color?: string;
  onChange: (color: string) => void;
}

export default (props: ColorProps) => {
  const { color, onChange } = props;
  const handleChange = (color: any, event: any) => {
    onChange(color.hex);
  };

  return (
    <div className="colorBox">
      <h3>Color</h3>
      <SketchPicker
        className="colorBox-picker"
        width="100%"
        disableAlpha={false}
        color={color}
        onChange={handleChange}
      />
    </div>
  );
};
