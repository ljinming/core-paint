import Sider from "@/components/sliderCard";
// import ColorPicker from "@/components/colorPicker";
import { Board } from "@/board";
import { Eraser } from "@/tool";

interface EraserProps {
  board: Board;
}

const EraserRight = (props: EraserProps) => {
  const { board } = props;

  const handleChange = (type: string, value: number) => {
    // board.setShowCanvas({ [type]: value });
    Eraser.setEraserStyle(value);
  };

  return (
    <>
      <Sider
        title="Eraser Thickness"
        options={{ max: 200, min: 1 }}
        defaultValue={20}
        onChange={(value: number) => handleChange("lineWidth", value)}
      />
      {/* <ColorPicker onChange={(color: string) => handleChange("color", color)} /> */}
    </>
  );
};

export default EraserRight;
