import React, { RefObject, useLayoutEffect } from "react";
import Loading from "../../Loading/";

interface DownRefreshProps {
  refs: RefObject<HTMLDivElement>;
  dataId: string | number;
  topLoadMoreCallback: () => void;
  hasMoreTopData: boolean;
  loaderAtTop?: JSX.Element;
}

const DownRefresh: React.FC<DownRefreshProps> = ({
  refs,
  dataId,
  topLoadMoreCallback,
  hasMoreTopData,
  loaderAtTop,
}) => {
  useLayoutEffect(() => {
    if (!hasMoreTopData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          topLoadMoreCallback();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0,
      }
    );

    refs.current && observer.observe(refs.current);

    return () => {
      // clean函数之前之前，ref 已经没有了，所以上面要用 useLayoutEffect
      refs.current && observer.unobserve(refs.current);
    };
  }, [hasMoreTopData]);

  return (
    <div
      ref={refs}
      className="infinite-list-item infinite-list-pull-refesh"
      data-id={dataId}
      // style={{ display: hasMoreTopData ? 'block' : 'none' }}
    >
      {loaderAtTop ? loaderAtTop : <Loading hasMore={hasMoreTopData} />}
    </div>
  );
};

export default DownRefresh;
