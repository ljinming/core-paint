import Sider from "@/components/sliderCard";
import { Select } from "antd";
import ColorPicker from "@/components/colorPicker";
import board, { Board } from "@/board";

const { Option } = Select;

interface TextProps {
  board: Board;
}
const textFamily = [
  "Barlow-ExtraBold",
  "DIN-AlternateBold",
  "Trebuchet-MSBold",
  "Trebuchet-MS",
  "Poppins-Bold",
  "Poppins-Light",
  "Poppins-Medium",
  "Poppins-Regular",
  "Poppins-SemiBold",
];

const Text = (props: TextProps) => {
  const handleChange = (type, value) => {
    console.log("==text", type, value);
    board.setTextStyle(type, value);
  };

  return (
    <div className="text">
      <div>
        <h3>Font</h3>
        <Select
          style={{ width: "100%" }}
          onChange={(value) => handleChange("fontFamily", value)}
        >
          {textFamily.map((va) => {
            return (
              <Option key={va} value={va}>
                {va}
              </Option>
            );
          })}
        </Select>
      </div>
      {/* <div className="font">
        <Sider
          title="Letter Spacing"
          options={{ max: 8, min: 1 }}
          onChange={(value: number) =>
            handleChange("letterSpacing", value + "px")
          }
        />
      </div> */}
      <div className="font">
        <Sider
          title="Font Size"
          options={{ max: 72, min: 12 }}
          onChange={(value: number) => handleChange("fontSize", value)}
        />
      </div>
      <div className="font">
        <Sider
          title="Line Height"
          options={{ max: 56, min: 24 }}
          onChange={(value: number) => handleChange("lineHeight", value)}
        />
      </div>
      <ColorPicker onChange={(color: string) => handleChange("fill", color)} />
    </div>
  );
};

export default Text;
