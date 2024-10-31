import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import VariableSizeList from "../../src/components/VariableSizeList";
// import { VariableSizeList } from "virtual-list-down-up";
import { VariableSizeList } from "../../dist";
import * as faker from "faker";

import "./index.css";
// eslint-disable-next-line @typescript-eslint/no-require-imports

let pageTop = 1;
let pageBottom = 1;
//所有列表数据
const listData = new Array(20).fill(true).map((_, index) => `第0页第${index + 1}个: ${faker.lorem.sentences()}`);

const Index = () => {
  const [hasMoreTopData, setHasMoreTopData] = React.useState(true);
  const [hasMoreBottomData, setHasMoreBottomData] = React.useState(true);
  const ref = React.useRef(null);

  // 模拟一个2秒后返回数据的请求
  const requestTopData = async () => {
    // 设置一个2秒的延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (pageTop > 3) {
      setHasMoreTopData(false);
      return [];
    }

    pageTop += 1;

    // 返回模拟数据
    return new Array(20)
      .fill(true)
      .map((_, index) => `第${-1 * (pageTop - 1)}页${index + 1}个: ${faker.lorem.sentences()}`);
  };

  // 模拟一个2秒后返回数据的请求
  const requestBottomData = async () => {
    // 设置一个2秒的延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (pageBottom > 3) {
      setHasMoreBottomData(false);
      return [];
    }
    pageBottom += 1;

    // 返回模拟数据
    return new Array(20)
      .fill(true)
      .map((_, index) => `第${pageBottom - 1}页第${index + 1}个: ${faker.lorem.sentences()}`);
  };

  const Row = ({ item, index }) => {
    const click = () => {
      if (window.confirm(`您确定要删除${index}吗？`)) {
        ref?.current?.delItem(index);
      }
    };

    return (
      <div className="my-list-item" key={index} onClick={click}>
        <span>{item}</span>
        {/* {index == 1 && <img src={`https://picsum.photos/200/300`} />} */}
      </div>
    );
  };

  return (
    <div className="wrap">
      <div className="my-list">
        <VariableSizeList
          ref={ref}
          listData={listData}
          estimatedItemSize={90}
          bufferScale={1}
          pullDownCallback={requestTopData}
          pullUpCallback={requestBottomData}
          hasMoreTopData={hasMoreTopData}
          hasMoreBottomData={hasMoreBottomData}
          loaderAtTop={<div className="my-list-loader">{hasMoreTopData ? "loading..." : "No more !"}</div>}
          loaderAtBottom={<div className="my-list-loader">{hasMoreBottomData ? "loading..." : "No more !"}</div>}
        >
          {Row}
        </VariableSizeList>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Index />
  </StrictMode>
);
