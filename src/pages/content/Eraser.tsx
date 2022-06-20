import Sider from "@/components/sliderCard";
// import ColorPicker from "@/components/colorPicker";
import { Board } from "@/board";

interface EraserProps {
  board: Board;
}

const Pencil = (props: EraserProps) => {
  const { board } = props;

  const handleChange = (type: string, value: number | string) => {
    board.setShowCanvas({ [type]: value });
  };

  return (
    <>
      <Sider
        title="Eraser Thickness"
        options={{ max: 20, min: 1 }}
        onChange={(value: number) => handleChange("lineWidth", value)}
      />
      {/* <ColorPicker onChange={(color: string) => handleChange("color", color)} /> */}
    </>
  );
};

export default Pencil;
