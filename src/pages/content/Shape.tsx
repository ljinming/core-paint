import { Select } from "antd";
import { Board } from "@/board";
import shape_line from "@/assets/icon/shape_line.svg";
import shape_rect from "@/assets/icon/shape_rect.svg";
import shape_circle from "@/assets/icon/shape_circle.svg";
import shape_rhombus from "@/assets/icon/shape_rhombus.svg";
import shape_triangle from "@/assets/icon/shape_triangle.svg";
import shape_pentagon from "@/assets/icon/shape_pentagon.svg";
import shape_sexangle from "@/assets/icon/shape_sexangle.svg";
import shape_arrowtop from "@/assets/icon/shape_arrowtop.svg";
import shape_arrowright from "@/assets/icon/shape_arrowright.svg";
import shape_arrowdown from "@/assets/icon/shape_arrowdown.svg";
import shape_arrowleft from "@/assets/icon/shape_arrowleft.svg";
import shape_fourstar from "@/assets/icon/shape_fourstar.svg";
import ColorPicker from "@/components/colorPicker";

interface pencilProps {
  board: Board;
}

const Shape = (props: pencilProps) => {
  const { board } = props;

  const handleChange = (type: string, value: number | string) => {
    board.setShowCanvas({ [type]: value });
  };
  const shapes = [
    {
      type: "LINE",
      img: shape_line,
      title: "直线",
    },
    {
      type: "RECT",
      img: shape_rect,
      title: "矩形",
    },
    {
      type: "CIRCLE",
      img: shape_circle,
      title: "圆（椭圆）",
    },
    {
      type: "RHOMBUS",
      img: shape_rhombus,
      title: "菱形",
    },
    {
      type: "TRIANGLE",
      img: shape_triangle,
      title: "三角形",
    },
    {
      type: "PENTAGON",
      img: shape_pentagon,
      title: "五边形",
    },
    {
      type: "SEXANGLE",
      img: shape_sexangle,
      title: "六边形",
    },
    {
      type: "ARROW_TOP",
      img: shape_arrowtop,
      title: "上箭头",
    },
    {
      type: "ARROW_RIGHT",
      img: shape_arrowright,
      title: "右箭头",
    },
    {
      type: "ARROW_DOWN",
      img: shape_arrowdown,
      title: "下箭头",
    },
    {
      type: "ARROW_LEFT",
      img: shape_arrowleft,
      title: "左箭头",
    },
    {
      type: "FOUR_STAR",
      img: shape_fourstar,
      title: "四角星",
    },
  ];

  return (
    <div className="shape">
      <h3>Shape</h3>
      <Select
        style={{ width: "100%" }}
        defaultValue={"SOLID"}
        onChange={(value) => (board.shapeLine = value)}
      >
        <Select.Option value={"SOLID"}>solid line</Select.Option>
        <Select.Option value={"DOTTED"}>dotted line</Select.Option>
      </Select>
      <div className="shape-content">
        {shapes.map((shape) => (
          <img
            src={shape.img}
            key={shape.img}
            title={shape.title}
            className={"shape-item"}
            onClick={() => {
              board.setShape({ shapeType: shape.type });
            }}
          />
        ))}
      </div>
      <ColorPicker onChange={(color: string) => handleChange("color", color)} />
    </div>
  );
};

export default Shape;
