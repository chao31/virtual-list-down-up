import React, { useState, useRef, useLayoutEffect, useImperativeHandle } from "react";
import { Row } from "./components/";
import { binarySearch } from "@/utils";

import "./index.css";

interface VariableSizeListProps {
  listData: any[];
  estimatedItemSize: number;
  bufferScale?: number;
  children: React.ReactNode | Function;
  pullDownCallback?: Function;
  pullUpCallback?: Function;
  hasMoreTopData?: boolean;
  hasMoreBottomData?: boolean;
  loaderAtTop?: JSX.Element;
  loaderAtBottom?: JSX.Element;
}

export interface ExposeListData {
  getListData: Function;
}

// https://www.totaltypescript.com/forwardref-with-generic-components
function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement
): (props: P & React.RefAttributes<T>) => React.ReactElement {
  // @ts-ignore
  return React.forwardRef(render) as any;
}

let topMoreLen = 0;
let bottomYBeforeMore = 0;

const Index = fixedForwardRef<ExposeListData, VariableSizeListProps>((props, ref) => {
  const {
    // 列表数据
    listData = [],
    // 预估的列表项高度
    estimatedItemSize = 40,
    // 缓冲区的比例
    bufferScale = 1,
    children,
    pullDownCallback,
    pullUpCallback,
    hasMoreTopData = true,
    hasMoreBottomData = true,
    loaderAtTop,
    loaderAtBottom,
  } = props;
  const [screenHeight, setScreenHeight] = useState(0);
  const [start, setStart] = useState(0);

  const [vlistData, setVlistData] = useState([{ id: "267e90" }, ...listData, { id: "23ff8" }]);

  // 根据预估item高度，初始化一份list高度数组
  const initPositions = (len?: number) => {
    const list = new Array(len || vlistData.length).fill(true);
    return list.map((_, index) => ({
      index,
      height: estimatedItemSize,
      top: index * estimatedItemSize,
      bottom: (index + 1) * estimatedItemSize,
    }));
  };
  const [positions, setPositions] = useState(initPositions);

  const isTopLoading = useRef(false);
  const isBottomLoading = useRef(false);
  const listConDomRef = useRef<HTMLDivElement>(null);
  const listVisibleDomRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const vlistCbRef = useRef("");
  // 引用类型start在callback中使用
  const startRef = useRef(0);
  const positionsRef = useRef(positions);

  // 列表总高度
  const listHeight = positions[positions.length - 1].bottom;
  // 可显示的列表项数
  const visibleCount = Math.ceil(screenHeight / estimatedItemSize);
  // 此时的结束索引
  const end = start + visibleCount;
  // 缓冲区item个数，可能是小数，所以需要取整
  const bufferCount = Math.floor(bufferScale * visibleCount);
  // 上方缓冲区的item个数
  const aboveCount = Math.min(start, bufferCount);
  // 下方缓冲区的item个数
  const belowCount = Math.min(vlistData.length - end, bufferCount);
  // 实际渲染出来的列表的偏移
  const offset = positions[start - aboveCount].top;

  //获取真实显示列表数据
  const visibleData = vlistData.slice(start - aboveCount, end + belowCount);

  // 返回给父元素，获取和设置当前渲染的listData（比如删除的item的时候使用）
  useImperativeHandle(
    ref,
    () => {
      return {
        // 首尾是加载更多，中间才是真实的listData
        getListData() {
          return [...vlistData.slice(1, vlistData.length - 1)];
        },
        // 单个删除
        delItem(_index: number) {
          // 游标排除首尾loading，不在数组内，return
          if (_index < 0 || _index >= vlistData.length - 2) return;

          const newList = [...vlistData];
          // 第一个是loading，所以index + 1
          const index = _index + 1;
          newList.splice(index, 1);
          // 删除 Item 后，更新其后每一个 Item 的高度
          const _positions = [...positions];
          const height = positions[index].height;
          _positions.splice(index, 1);
          for (let k = index; k < _positions.length; k++) {
            _positions[k].top = _positions[k - 1].bottom;
            _positions[k].bottom = _positions[k].bottom - height;
            _positions[k].index = k;
          }

          setPositions(_positions);
          positionsRef.current = _positions;
          setVlistData(newList);
        },
      };
    },
    [vlistData]
  );

  // 如果某个 Item 的高度变化，需要当前 Item 的 bottom，以及后面 Item 的 top 和 bottom
  const updatePositions = (pos?: any) => {
    if (!listVisibleDomRef.current) return;

    const oldPositions = pos || positions;
    let nodes = listVisibleDomRef.current.children;
    if (nodes && nodes.length > 0) {
      const _positions = [...oldPositions];
      Array.from(nodes).forEach((node: any) => {
        let rect = node.getBoundingClientRect();
        let height = rect.height;
        let index = +(node.dataset.id as string);
        let oldHeight = oldPositions[index].height;
        let dValue = oldHeight - height;
        //存在差值
        if (dValue) {
          _positions[index].bottom = _positions[index].bottom - dValue;
          _positions[index].height = height;
          for (let k = index + 1; k < _positions.length; k++) {
            _positions[k].top = _positions[k - 1].bottom;
            _positions[k].bottom = _positions[k].bottom - dValue;
          }
        }
      });
      setPositions(_positions);
      positionsRef.current = _positions;
    }
  };

  //获取列表起始索引
  const getStartIndex = (scrollTop = 0) => {
    //二分法查找
    const _start = binarySearch(positions, scrollTop);
    return _start;
  };

  // clean函数之前之前，ref 已经没有了，所以要用 useLayoutEffect
  useLayoutEffect(() => {
    const listConDom = listConDomRef.current as HTMLElement;
    // 监听container的高度变化，比如缩放窗口时，容器高度会变化
    const observer = observerContainerHeightResize();
    observer?.observe(listConDom);

    return () => {
      observer?.unobserve(listConDom);
    };
  }, []);

  useLayoutEffect(() => {
    updatePositions();
  }, [start]);

  const bottomLoadMoreCallback = async () => {
    if (isBottomLoading.current || !pullUpCallback) return;

    isBottomLoading.current = true;
    const newList = await pullUpCallback();
    isBottomLoading.current = false;

    // 因为callback更新拿不到上下文，所以通过ref获取最新的start
    const start = startRef.current;

    if (newList.length === 0) {
      return;
    }

    // 记录下一页dom挂载前，页面位置的高度
    bottomYBeforeMore = positionsRef.current[start].bottom - (listConDomRef.current as HTMLElement).scrollTop;
    // 设置下一页dom挂载后、重绘前，页面位置的高度
    vlistCbRef.current = "recoverBottomScrollY";

    // 上拉和下拉加载的callback会有竞态，所以需要拿到上一个vlistData
    renderBottomMoreList(newList);
  };

  const renderBottomMoreList = (newList: any[]) => {
    setVlistData((vlistData) => {
      updatePositions(initPositions(vlistData.length + newList.length));
      return [...vlistData.slice(0, vlistData.length - 1), ...newList, vlistData[vlistData.length - 1]];
    });
  };

  useLayoutEffect(() => {
    // 恢复页面滚动位置
    recoverScrollY();
  }, [vlistData]);

  const recoverScrollY = () => {
    if (!vlistCbRef.current) return;

    // 下拉加载，重绘前恢复页面位置
    if (vlistCbRef.current === "recoverTopScrollY") {
      recoverTopScrollY();
    }

    // 上拉加载，重绘前恢复页面位置
    if (vlistCbRef.current === "recoverBottomScrollY") {
      recoverBottomScrollY();
    }

    vlistCbRef.current = "";
  };

  const recoverTopScrollY = () => {
    const newStart = start + topMoreLen;
    setStart(newStart);
    // 恢复滚动高度分2步：1、重置scrollTop,可以选择当前start元素的top或者bottom 2、再补齐dvalue
    // 因为当前start如果是顶部more元素，下拉一页后替代more位置的元素不是同一个，高度会变，如果选择top补齐dvalue就会有问题，所以选择bottom
    const dValue = positions[start].bottom - (listConDomRef.current as HTMLElement).scrollTop;
    (listConDomRef.current as HTMLElement).scrollTop = positions[newStart].bottom - dValue;

    // 如果选择top，需要下面这样改，同时row里的if (dValue && index <= start) 需要去掉等号 =，会发现露出loading时滚动位置不对
    // 因为当height变化，不会影响top的位置，但会影响bottom的位置，所以选top时，不需要 =， index < start
    // const dValue = listConDomRef.current.scrollTop - positions[start].top;
    // listConDomRef.current.scrollTop = positions[newStart].top + dValue;
  };

  const recoverBottomScrollY = () => {
    (listConDomRef.current as HTMLElement).scrollTop = positions[start].bottom - bottomYBeforeMore;
    bottomYBeforeMore = 0;
  };

  // 监听下拉 dom 出现
  const topLoadMoreCallback = async () => {
    if (isTopLoading.current || !pullDownCallback) return;

    isTopLoading.current = true;
    const newList = await pullDownCallback();
    isTopLoading.current = false;

    topMoreLen = newList.length;

    vlistCbRef.current = "recoverTopScrollY";
    // 渲染顶部加载更多list
    renderTopMoreList(newList);
  };

  const renderTopMoreList = (newList: any[]) => {
    // 上拉和下拉加载的callback会有竞态，所以需要拿到上一个vlistData
    setVlistData((vlistData) => {
      updatePositions(initPositions(vlistData.length + newList.length));
      return [vlistData[0], ...newList, ...vlistData.slice(1)];
    });
  };

  const handleScrollEvent = () => {
    //当前滚动位置
    let scrollTop = (listConDomRef.current as HTMLElement).scrollTop;
    //此时的开始索引
    const newStart = getStartIndex(scrollTop);

    if (newStart === null) return;

    setStart(newStart);
    startRef.current = newStart;
  };

  const observerContainerHeightResize = () => {
    if (!("ResizeObserver" in window)) {
      setScreenHeight((listConDomRef.current as HTMLElement).clientHeight);
      console.error("浏览器不支持ResizeObserver，请pollyfill！");
      return;
    }

    // 创建一个 ResizeObserver 实例，并传入回调函数
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      // contentBoxSize 属性较新，担心有兼容性问题，contentRect 较老但未来可能被抛弃
      const newHeight = entry.contentBoxSize ? entry.contentBoxSize[0].blockSize : entry.contentRect.height;
      setScreenHeight(newHeight);
      handleScrollEvent();
    });

    return resizeObserver;
  };

  return (
    <div ref={listConDomRef} className="infinite-list-container" onScroll={handleScrollEvent}>
      <div className="infinite-list-phantom" style={{ height: listHeight + "px" }}></div>
      <div ref={listVisibleDomRef} className="infinite-list" style={{ transform: `translate3d(0, ${offset}px, 0)` }}>
        {visibleData.map((item, index) => {
          // 拿到在ListData中真实的index
          const key = positions[index + start - aboveCount]?.index;
          // 当vlistData变长后，end也会更新，但positions有个间隔时期没有更新过来，所以会出现vlistData的key和positions对不上的问题
          if (key === undefined) return null;

          return (
            <Row
              bottomLoadMoreCallback={bottomLoadMoreCallback}
              topLoadMoreCallback={topLoadMoreCallback}
              listConDomRef={listConDomRef}
              hasMoreTopData={hasMoreTopData}
              hasMoreBottomData={hasMoreBottomData}
              isFirstRender={isFirstRender}
              oldHeight={positions[key].height}
              start={start}
              key={key}
              index={key}
              item={item}
              updatePositions={updatePositions}
              children={children}
              loaderAtTop={loaderAtTop}
              loaderAtBottom={loaderAtBottom}
              len={vlistData.length}
              setStart={setStart}
            />
          );
        })}
      </div>
    </div>
  );
});

export default Index;
