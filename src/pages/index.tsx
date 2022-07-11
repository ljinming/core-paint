import Header from "./header";
import Content from "./content";
import "./index.less";
import "./font.css";
import { useState, useEffect, useImperativeHandle } from "react";
import { Tool } from "../tool";
interface HomeProps {
  backgroundColor?: string;
  width?: number;
  height?: number;
  imgSrc?: string;
  cRef?: any;
  id: string;
}

function getImageSize(url: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload = function () {
      resolve({
        width: image.width,
        height: image.height,
      });
    };
    image.onerror = function () {
      reject(new Error("error"));
    };
    image.src = url;
  });
}

//https://bafybeie3y4v25vj3owiqc5jxdhpcqld5klixy32fhcfytyfyve7k5ssyv4.ipfs.dweb.link/orign.png
//"https://bafybeicgvg3vwtv5c633cjexbykjp75yjt755qhma4o7vgusa4ldvocz44.ipfs.dweb.link/orign.png",
export default (props: HomeProps) => {
  const pre = `core-paint`;
  const {
    imgSrc = "https://bafybeicgvg3vwtv5c633cjexbykjp75yjt755qhma4o7vgusa4ldvocz44.ipfs.dweb.link/orign.png",
    width,
    height,
    cRef,
    id,
  } = props;
  const [size, setSize] = useState({ width, height });

  const loadImgSize = async (src: string) => {
    const size = await getImageSize(src);
    setSize(size);
  };

  useImperativeHandle(cRef, () => ({
    getCurrentImageData: () => {
      // const canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`);
      // const imageData = canvasElem.toDataURL("image/png");
      return Tool.canvas.toDataURL();
    },
  }));

  useEffect(() => {
    if (imgSrc) {
      loadImgSize(imgSrc);
    } else {
      if (width && height) {
        setSize({ width, height });
      }
    }
  }, [width, height, imgSrc]);

  return (
    <div className={pre}>
      <Header pre={pre} />
      <Content
        pre={pre}
        canvasSize={size}
        imgSrc={imgSrc}
        backgroundColor={"#fff"}
      />
    </div>
  );
};
