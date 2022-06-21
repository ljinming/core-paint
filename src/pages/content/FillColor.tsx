import ColorPicker from "@/components/colorPicker";
import { Board } from "@/board";

interface FillColorProps {
  board: Board;
  onChange: (color: string) => void;
}

const FillColor = (props: FillColorProps) => {
  const { board, onChange } = props;

  const handleChange = (value) => {
    //board.setShowCanvas({ [type]: value });
    board.fillColor = value;
    onChange(value);
  };

  return (
    <>
      <ColorPicker onChange={(color: string) => handleChange(color)} />
    </>
  );
};

export default FillColor;
