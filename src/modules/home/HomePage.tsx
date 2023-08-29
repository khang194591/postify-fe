import { Empty, Spin } from "antd";
import { useCallback, useEffect } from "react";
import Post from "../posts/Post";
import PostForm from "../posts/PostForm";
import usePostStore from "../posts/store";
export default function HomePage() {
  const over = usePostStore((state) => state.over);
  const loading = usePostStore((state) => state.loading);
  const postList = usePostStore((state) => state.postList);
  const fetchPostList = usePostStore((state) => state.fetchPostList);
  const fetchNextPostList = usePostStore((state) => state.fetchNextPostList);

  // TODO: Xử lý infinite scroll, cần đánh giá lại hiệu năng
  const handleScroll = useCallback(() => {
    if (
      Math.round(window.innerHeight + document.documentElement.scrollTop + 10) <
        document.documentElement.offsetHeight ||
      loading ||
      over
    ) {
      return;
    }
    void fetchNextPostList();
  }, [over, loading, fetchNextPostList]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    void fetchPostList();

    return () => {};
  }, [fetchPostList]);

  return (
    <div className="">
      <div className="mx-auto px-4 sm:max-w-lg flex flex-col gap-4 py-4">
        <PostForm />
        {postList.map((post) => (
          <Post key={post.id} {...post} />
        ))}
        {loading && <Spin />}
        {over && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </div>
    </div>
  );
}
