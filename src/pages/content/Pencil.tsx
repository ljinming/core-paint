import Sider from "@/components/sliderCard";
import Action from "@/action";
import { connect, shallowEqual, useSelector } from "react-redux";
import ColorPicker from "@/components/colorpicker";

interface pencilProps {
  option: {
    fontSize: number;
    color: string;
  };
}

const Pencil = (props: pencilProps) => {
  const { option } = props;

  const handleChange = (type: string, value: number | string) => {
    Action.emit("paint.pencil", { [type]: value });
  };

  return (
    <>
      <Sider
        title="Brush thickness"
        options={{ max: 20, min: 1, value: option.fontSize }}
        onChange={(value: number) => handleChange("fontSize", value)}
      />
      <ColorPicker color={option.color} onChange={(color: string) => handleChange("color", color)} />
    </>
  );
};

// function mapStateToProps(state: any) {
//   return {
//     option: state.paint.pencil
//   };
// }

// export default connect(mapStateToProps)(Pencil);

export default Pencil;
