import Sider from "@/components/sliderCard";
import ColorPicker from "@/components/colorPicker";
import { Board } from "@/board";

interface pencilProps {
  board: Board;
}

const Pencil = (props: pencilProps) => {
  const { board } = props;

  const handleChange = (type: string, value: number | string) => {
    board.setShowCanvas({ [type]: value });
  };

  return (
    <>
      <Sider
        title="Brush thickness"
        options={{ max: 20, min: 1 }}
        onChange={(value: number) => handleChange("lineWidth", value)}
      />
      <ColorPicker onChange={(color: string) => handleChange("color", color)} />
    </>
  );
};

export default Pencil;
