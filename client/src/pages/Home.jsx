import { Link } from "react-router-dom";
import CallToAction from "./../components/CallToAction";
// import { useEffect, useState } from "react";
import PostCard from "./../components/PostCard";
import { useQuery } from "@apollo/client";
import { ALL_POSTS } from "../graphql/queries/post.query.js";

export default function Home() {
  const { data } = useQuery(ALL_POSTS);

  const posts = data?.allPosts;

  // console.log("Posts", data?.allPosts);
  // const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setPosts(data?.allPosts);
  //     // const {data} = useQuery(ALL_POSTS)
  //     // const res = await fetch("/api/post/getPosts");
  //     // const data = await res.json();
  //     // setPosts(data.posts);
  //   };
  //   fetchPosts();
  // }, []);

  // console.log(posts);

  return (
    <div>
      <div className="flex flex-col gap-6 px-3 p-28 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Bem vindo ao{" "}
          <span className="font-extrabold text-orange-500">Orange</span>{" "}
          <span className="font-extrabold text-stone-900 dark:text-white">
            Blog
          </span>
        </h1>
        <p className="text-gray-500 text-md sm:test-sm">
          Aqui você encontrará uma variedade de artigos e tutoriais sobre
          tópicos como desenvolvimento web, engenharia de software e linguagens
          de programação.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          Veja todas as postagens
        </Link>
      </div>
      <div className="p-9 bg-gray-200 dark:bg-slate-700">
        <CallToAction />
      </div>
      <div className="max-w-8xl mx-auto mt-4 p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl my-8 font-semibold text-center">
              Postagens Recentes
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((posts) => (
                <PostCard key={posts.id} post={posts} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              Veja mais postagens
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
