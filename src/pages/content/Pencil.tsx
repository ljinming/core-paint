import Sider from "@/components/sliderCard";
import Action from "@/action";
import { connect } from "react-redux";

interface pencilProps {
  option: {
    fontSize: number;
    color: string;
  };
}

const Pencil = (props: pencilProps) => {
  const { option } = props;
  const handleChange = (type: string, value: number) => {
    Action.emit("paint.pencil", { [type]: value });
  };

  return (
    <>
      <Sider
        title="Brush thickness"
        options={{ max: 20, min: 1, value: option.fontSize }}
        onChange={(value: number) => handleChange("fontSize", value)}
      />
    </>
  );
};

function mapStateToProps(state: any) {
  return {
    option: state.paint.pencil,
  };
}

export default connect(mapStateToProps)(Pencil);