import { useEffect, useRef, useLayoutEffect } from "react";
import { RefObject } from "react";
import DownRefresh from "./DownRefresh";
import UpRefesh from "./UpRefesh";

interface RowProps {
  topLoadMoreCallback: () => void;
  bottomLoadMoreCallback: () => void;
  listConDomRef: RefObject<HTMLElement>;
  hasMoreTopData: boolean;
  hasMoreBottomData: boolean;
  isFirstRender: { current: boolean };
  oldHeight: number;
  start: number;
  setStart: (value: number) => void;
  index: number;
  item: any;
  updatePostionAndOffset: () => void;
  children: React.ReactNode | Function;
  loaderAtTop: boolean;
  loaderAtBottom: boolean;
  len: number;
}

const Row: React.FC<RowProps> = ({
  topLoadMoreCallback,
  bottomLoadMoreCallback,
  listConDomRef,
  hasMoreTopData,
  hasMoreBottomData,
  isFirstRender,
  oldHeight,
  start,
  setStart,
  index,
  item,
  updatePostionAndOffset,
  children,
  loaderAtTop,
  loaderAtBottom,
  len,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const isFirsrRef = useRef(false);
  const lastItemRef = useRef(null);
  const shoulScrollUpToHidePullDom = index === 1 && isFirstRender.current;

  // 判断是否隐藏下拉刷新，第一次渲染且第一个dom加载完毕，会往上滚动，不展示下拉刷新
  useEffect(() => {
    hideDownDom();
  }, []);

  useLayoutEffect(() => {
    updatePostionAndOffset();
    updateScrollTopWithoutSideEffect();
  }, [item]);

  // updateScrollTop是副作用函数，解决严格模式下预发环境会执行2次问题
  const updateScrollTopWithoutSideEffect = () => {
    if (!isFirsrRef || lastItemRef.current !== item) {
      updateScrollTop();
    }
    lastItemRef.current = item;
    isFirsrRef.current = true;
  };

  const updateScrollTop = () => {
    if (!rowRef.current || !listConDomRef.current) return;

    const height = rowRef.current.getBoundingClientRect().height;
    const dValue = height - oldHeight;

    // 有高度变化，且是视口上方的 dom
    if (dValue && index <= start) {
      listConDomRef.current.scrollTop = listConDomRef.current.scrollTop + dValue;
    }
  };

  const hideDownDom = () => {
    if (!shoulScrollUpToHidePullDom) return;

    isFirstRender.current = false;
    setStart(1);
    rowRef.current?.scrollIntoView();
  };

  if (index === 0) {
    return (
      <DownRefresh
        key={index}
        refs={rowRef}
        dataId={index}
        topLoadMoreCallback={topLoadMoreCallback}
        hasMoreTopData={hasMoreTopData}
        loaderAtTop={loaderAtTop}
      />
    );
  }

  if (index === len - 1)
    return (
      <UpRefesh
        key={index}
        refs={rowRef}
        dataId={index}
        bottomLoadMoreCallback={bottomLoadMoreCallback}
        hasMoreBottomData={hasMoreBottomData}
        loaderAtBottom={loaderAtBottom}
      />
    );

  return (
    <div ref={rowRef} className="infinite-list-item" key={index} data-id={index}>
      {typeof children === "function" ? children({ item, index: index - 1 }) : children}
    </div>
  );
};

export default Row;
