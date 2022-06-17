import { Slider } from "antd";
import "./index.less";

interface sliderProps {
  title?: string;
  value?: number;
  options?: any;
  onChange?: (value: number) => void;
}

export default (props: sliderProps) => {
  const { title, options = {}, value, onChange } = props;
  return (
    <div className="silderCard">
      {title && <h3>{title}</h3>}
      <div className="show-silder">
        <Slider
          className="slider-step"
          defaultValue={2}
          {...options}
          onChange={onChange}
        />
        {options.max && <span>max :{options.max}</span>}
      </div>
    </div>
  );
};
