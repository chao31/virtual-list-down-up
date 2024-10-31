import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

import DownRefresh from './DownRefresh';
import UpRefesh from './UpRefesh';

const Row = ({
  topLoadMoreCallback,
  bottomLoadMoreCallback,
  listConDomRef,
  hasMoreTopData,
  hasMoreBottomData,
  pauseScrollListening,
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
  loadMoreCB,
}) => {
  const rowRef = useRef(null);
  const shoulScrollUpToHidePullDom = index === 1 && isFirstRender.current;

  useEffect(() => {
  // useEffect(() => {
    // 上拉加载时，动态渲染出顶部 dom 后，若其高度跟estimatedItemSize不一致，会导致下面dom往下排列，需通过滚动调整使页面不动
    // updateScrollTop();
    // updatePostionAndOffset();
    // 判断是否隐藏下拉刷新，第一次渲染且第一个dom加载完毕，会往上滚动，不展示下拉刷新
    hideDownDom();
  }, []);

  useLayoutEffect(() => {
    updatePostionAndOffset();
    updateScrollTop();
  }, [item]);

  const updateScrollTop = () => {
    const height = rowRef.current.getBoundingClientRect().height;
    const dValue = height - oldHeight;
    console.log('dValue: ', oldHeight, height, index < start && '前');
    console.log('99999', 'row', index, index < start);
    if(dValue) {
      console.log('哈哈', index, start);
    }
    // console.log(111, index , start);

    // 有高度变化，且是视口上方的 dom
    if (dValue && index <= start) {
      // pauseScrollListening.current = true;
      // console.log(55556, '后1' , pauseScrollListening.current);
      listConDomRef.current.scrollTop = listConDomRef.current.scrollTop + dValue;
        // requestAnimationFrame(() => {
          // pauseScrollListening.current = false;
          // console.log(55556, '后2' , pauseScrollListening.current);
        // });
    }
  };

  const hideDownDom = () => {
    if (!shoulScrollUpToHidePullDom) return;

    isFirstRender.current = false;
    setStart(1);
    rowRef.current.scrollIntoView();
  };

  if (index === 0) {
    return (
      <DownRefresh
        key={index}
        refs={rowRef}
        dataId={index}
        topLoadMoreCallback={topLoadMoreCallback}
        loadMoreCB={loadMoreCB}
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
        loadMoreCB={loadMoreCB}
        hasMoreBottomData={hasMoreBottomData}
        loaderAtBottom={loaderAtBottom}
      />
    );

  return (
    <div
      ref={rowRef}
      className="infinite-list-item"
      key={index}
      data-id={index}
    >
      {typeof children === 'function'
        ? children({ item, index: index - 1 })
        : children}
    </div>
  );
};

export default Row;