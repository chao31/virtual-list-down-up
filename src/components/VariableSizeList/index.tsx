import React, {
  useState,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import { Row } from './components/';
import { binarySearch } from '../../utils';

import './index.css';

declare global {
  interface Window {
    ResizeObserver: any;
    setScreenHeight: any;
    positions: any;
    setStart: any;
    setStartOffset: any;
    vlistData: any;
    setPositions: any;
    setVlistData: any;
    handleScrollEvent: any;
    r1: any;
    r2: any;
    r3: any;
    updatePostionAndOffset: any;
  }
}

interface VariableSizeListProps {
  listData: string[];
  estimatedItemSize: number;
  bufferScale: number;
  pullDownCallback: Function;
  pullUpCallback: Function;
  hasMoreTopData: boolean;
  hasMoreBottomData: boolean;
  loaderAtBottom: JSX.Element;
}

export interface ExposeListData {
  getListData: Function;
  setListData: Function;
}

// https://www.totaltypescript.com/forwardref-with-generic-components
function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement
): (props: P & React.RefAttributes<T>) => React.ReactElement {
  // @ts-ignore
  return React.forwardRef(render) as any;
}

const Index = fixedForwardRef<ExposeListData, VariableSizeListProps>(
  (props: any, ref) => {
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
    const [startOffset, setStartOffset] = useState(0);
    const [start, setStart] = useState(0);

    const [vlistData, setVlistData] = useState([null, ...listData, null]);
    window.vlistData = vlistData;
    window.setVlistData = setVlistData;
    window.setStart = setStart;

    // 根据预估item高度，初始化一份list高度数组
    const initPositions = (len?) => {
      const list = new Array(len || vlistData.length).fill(true);
      return list.map((_, index) => ({
        index,
        height: estimatedItemSize,
        top: index * estimatedItemSize,
        bottom: (index + 1) * estimatedItemSize,
      }));
    };

    const [positions, setPositions] = useState(initPositions);
    window.positions = positions;
    window.setPositions = setPositions;

    const isTopLoading = useRef(false);
    const isBottomLoading = useRef(false);
    const listConDomRef = useRef(null);
    const listVisibleDomRef = useRef(null);
    const pauseScrollListening = useRef(false);
    const isFirstRender = useRef(true);
    // 引用类型start在callback中使用
    const startRef = useRef(0);

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
          // 给返回的listdata加上首尾加载更多组件
          setListData(listData) {
            // 因为callback更新拿不到上下文，所以通过ref获取最新的start
            const start = startRef.current;
            const newStart = start;
            console.log('newStart: ', newStart);
            const yOld = getBottomDistance(start);

            // 渲染顶部加载更多list
            setVlistData([null, ...listData, null]);

            // 先将新newStart滚动到视口处
            // scrollIntoView(newStart);
            // const yNew = getBottomDistance(newStart);
            // const dValue = yNew - yOld;
            // // 微补滚动距离
            // patchScrollDistance(dValue);
          },
          delItem(_index) {
            // 游标排除首尾loading，不在数组内，return
            if (_index < 0 || _index >= vlistData.length - 2) return;

            const newList = [...vlistData];
            // 第一个是loading，所以index + 1
            const index = _index + 1;
            newList.splice(index, 1);

            const _positions = [...positions];
            const height = positions[index].height;
            _positions.splice(index, 1);
            for (let k = index; k < _positions.length; k++) {
              _positions[k].top = _positions[k - 1].bottom;
              _positions[k].bottom = _positions[k].bottom - height;
              _positions[k].index = k;
            }

            setPositions(_positions);
            setVlistData(newList);
          },
        };
      },
      [vlistData]
    );

    // 如果某个 Item 的高度变化，需要当前 Item 的 bottom，以及后面 Item 的 top 和 bottom
    const updatePositions = (pos?: any) => {
      const oldPositions = pos || positions;
      let nodes = listVisibleDomRef.current.children;
      if (nodes && nodes.length > 0) {
        const _positions = [...oldPositions];
        Array.from(nodes).forEach((node: HTMLElement) => {
          let rect = node.getBoundingClientRect();
          let height = rect.height;
          let index = +node.dataset.id;
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
      }
    };

    // 渲染出来的第一个元素的top就是每次需要Offset的距离
    const updateStartOffset = (newStart = start) => {
      const aboveCount = Math.min(newStart, bufferCount);
      const startOffset = positions[newStart - aboveCount].top;
      setStartOffset(startOffset);
    };

    //获取列表起始索引
    const getStartIndex = (scrollTop = 0) => {
      //二分法查找
      const _start = binarySearch(positions, scrollTop);
      return _start;
    };

    // clean函数之前之前，ref 已经没有了，所以要用 useLayoutEffect
    useLayoutEffect(() => {
      const listConDom = listConDomRef.current;
      // 监听container的高度变化，比如缩放窗口时，容器高度会变化
      const observer = observerContainerHeightResize();
      observer.observe(listConDom);

      return () => {
        observer.unobserve(listConDom);
      };
    }, []);

    useLayoutEffect(() => {
      updatePostionAndOffset();
    }, [start]);

    const updatePostionAndOffset = () => {
      updatePositions();
      updateStartOffset();
    };
    window.updatePostionAndOffset = updatePostionAndOffset;

    // useLayoutEffect(() => {
    //   const resetPositions = initPositions();
    //   updatePositions(resetPositions);
    //   // setPositions(initPositions());
    // }, [vlistData]);

    const bottomLoadMoreCallback = async () => {
      if (isBottomLoading.current) return;

      isBottomLoading.current = true;
      const newList = await pullUpCallback();
      isBottomLoading.current = false;

      // 因为callback更新拿不到上下文，所以通过ref获取最新的start
      const start = startRef.current;

      if (newList.length === 0) {
        // updatePostionAndOffset();
        updatePositions();
        updateStartOffset(start);
        return;
      }

      const yOld = getBottomDistance(start);
      console.log(111, vlistData);

      // 上拉和下拉加载的callback会有竞态，所以需要拿到上一个vlistData
      setVlistData(vlistData => {
        updatePositions(initPositions(vlistData.length + newList.length));
        return [
          ...vlistData.slice(0, vlistData.length - 1),
          ...newList,
          vlistData[vlistData.length - 1],
        ];
      });

      // updatePositions(resetPsitions);

      // 先将新newStart滚动到视口处
      scrollIntoView(start);
      const yNew = getBottomDistance(start);
      const dValue = yNew - yOld;
      // 微补滚动距离
      patchScrollDistance(dValue);
    };

    // 监听下拉 dom 出现
    const topLoadMoreCallback = async () => {
      if (isTopLoading.current) return;

      isTopLoading.current = true;
      const newList = await pullDownCallback();
      isTopLoading.current = false;

      // 因为callback更新拿不到上下文，所以通过ref获取最新的start
      const start = startRef.current;
      const newStart = start + newList.length;
      const yOld = getBottomDistance(start);
      // 渲染顶部加载更多list
      renderTopMoreList(newList);
      // 先将新newStart滚动到视口处
      scrollIntoView(newStart);
      const yNew = getBottomDistance(newStart);
      const dValue = yNew - yOld;
      // 微补滚动距离
      patchScrollDistance(dValue);
    };

    const getBottomDistance = start => {
      const rect = listConDomRef.current.querySelector(
        `.infinite-list-item[data-id="${start}"]`
      );
      return rect?.getBoundingClientRect()?.bottom || 0;
    };

    const renderTopMoreList = newList => {
      // 上拉和下拉加载的callback会有竞态，所以需要拿到上一个vlistData
      setVlistData(vlistData => {
        updatePositions(initPositions(vlistData.length + newList.length));
        return [vlistData[0], ...newList, ...vlistData.slice(1)];
      });
    };

    const scrollIntoView = start => {
      setStart(start);
      startRef.current = start;

      const rect = listConDomRef.current.querySelector(
        `.infinite-list-item[data-id="${start}"]`
      );
      rect?.scrollIntoView();
    };

    const patchScrollDistance = distanceY => {
      const listConDom = listConDomRef.current;
      listConDom.scrollTop = listConDom.scrollTop + distanceY;
    };

    // // 引用类型start在callback中使用
    // useEffect(() => {
    //   startRef.current = start;
    // }, [start]);

    const handleScrollEvent = () => {
      if (pauseScrollListening.current) return;

      // if (!listConDomRef.current) return;
      //当前滚动位置
      let scrollTop = listConDomRef.current.scrollTop;
      //此时的开始索引
      const newStart = getStartIndex(scrollTop);
      if (newStart === null) return;

      setStart(newStart);
      startRef.current = newStart;
      // 拉到列表最底部时，resize窗口时，需要快速更新视图
      updateStartOffset(newStart);
    };
    window.handleScrollEvent = handleScrollEvent;

    const observerContainerHeightResize = () => {
      if (!('ResizeObserver' in window)) {
        setScreenHeight(listConDomRef.current.clientHeight);
        console.error('浏览器不支持ResizeObserver，请pollyfill！');
        return;
      }

      // 创建一个 ResizeObserver 实例，并传入回调函数
      const resizeObserver = new window.ResizeObserver(entries => {
        const entry = entries[0];
        // contentBoxSize 属性较新，担心有兼容性问题，contentRect 较老但未来可能被抛弃
        const newHeight = entry.contentBoxSize
          ? entry.contentBoxSize[0].blockSize
          : entry.contentRect.height;
        setScreenHeight(newHeight);
        handleScrollEvent();
      });

      return resizeObserver;
    };

    return (
      <div
        ref={listConDomRef}
        className="infinite-list-container"
        onScroll={handleScrollEvent}
      >
        <div
          className="infinite-list-phantom"
          style={{ height: listHeight + 'px' }}
        ></div>
        <div
          ref={listVisibleDomRef}
          className="infinite-list"
          style={{ transform: `translate3d(0, ${startOffset}px, 0)` }}
        >
          {visibleData.map((item, index) => {
            // 拿到在ListData中真实的index
            const key = positions[index + start - aboveCount]?.index;
            // 当vlistData变长后，end也会更新，但positions有个间隔时期没有更新过来，所以会出现vlistData的key和positions对不上的问题
            if (key === undefined) return null;

            return (
              <Row
                topLoadMoreCallback={topLoadMoreCallback}
                bottomLoadMoreCallback={bottomLoadMoreCallback}
                listConDomRef={listConDomRef}
                hasMoreTopData={hasMoreTopData}
                hasMoreBottomData={hasMoreBottomData}
                pauseScrollListening={pauseScrollListening}
                isFirstRender={isFirstRender}
                oldHeight={positions[key].height}
                start={start}
                key={key}
                index={key}
                item={item}
                updatePostionAndOffset={updatePostionAndOffset}
                children={children}
                loaderAtTop={loaderAtTop}
                loaderAtBottom={loaderAtBottom}
                len={vlistData.length}
              />
            );
          })}
        </div>
      </div>
    );
  }
);

export default Index;
