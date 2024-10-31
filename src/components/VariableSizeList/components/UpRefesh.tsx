import React, { RefObject, useLayoutEffect } from "react";
import Loading from "../../Loading";

interface UpRefreshProps {
  refs: RefObject<HTMLDivElement>;
  dataId: string | number;
  bottomLoadMoreCallback: () => void;
  hasMoreBottomData: boolean;
  loaderAtBottom?: JSX.Element;
}

const UpRefesh: React.FC<UpRefreshProps> = ({
  refs,
  dataId,
  bottomLoadMoreCallback,
  hasMoreBottomData,
  loaderAtBottom,
}) => {
  useLayoutEffect(() => {
    if (!hasMoreBottomData) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          bottomLoadMoreCallback();
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
  }, [hasMoreBottomData]);

  return (
    <div
      ref={refs}
      className="infinite-list-item infinite-pull-down-refesh"
      data-id={dataId}
      // style={{ display: hasMoreBottomData ? 'block' : 'none' }}
    >
      {loaderAtBottom ? loaderAtBottom : <Loading hasMore={hasMoreBottomData} />}
    </div>
  );
};

export default UpRefesh;
