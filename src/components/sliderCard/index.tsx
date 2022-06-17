import { Slider } from "antd";
import "./index.less";

interface sliderProps {
  title?: string;
  value?: number;
}

export default (props: sliderProps) => {
  const { title, value } = props;
  return (
    <div className="silderCard">
      {title && <h3>{title}</h3>}
      <Slider defaultValue={2} />
    </div>
  );
};
