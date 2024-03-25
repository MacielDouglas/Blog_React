import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useQuery } from "@apollo/client";
import { FILTER_POST } from "../graphql/queries/post.query";

function usePostFilter() {
  const [filters, _upadateFilters] = useState({
    title: undefined,
    category: undefined,
  });
  console.log(filters);

  const updateFilter = (filterType, value) => {
    console.log(filterType);
    console.log(value);
    _upadateFilters({
      ...filters,
      [filterType]: value,
    });
    console.log(filters);
  };
  console.log(filters);

  return {
    models: { filters },
    operations: { updateFilter },
  };
}

export default function Search() {
  const { operations, models } = usePostFilter();

  const { data, loading, error, refetch } = useQuery(FILTER_POST, {
    variables: {
      input: {
        filter: models.filters,
      },
    },
  });

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setPosts(data.filterPost);
    }
  }, [data]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    operations.updateFilter("title", sidebarData.searchTerm);
    operations.updateFilter("category", sidebarData.category);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex   items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Pesquisar por:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Ordenar:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Mais recente</option>
              <option value="asc">Mais antigo</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Categoria:</label>
            <Select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Todos</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline color="dark">
            Filtrar
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          Resultado da pesquisa:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {posts.length === 0 && (
            <p className="text-xl text-gray-500">
              Nenhuma postagem encontrada.
            </p>
          )}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Mostrar mais
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// import { Button, Select, TextInput } from "flowbite-react";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import PostCard from "../components/PostCard";
// import { useQuery } from "@apollo/client";
// import { FILTER_POST } from "../graphql/queries/post.query";

// function usePostFilter() {
//   const [filters, _upadateFilters] = useState({
//     title: undefined,
//     category: undefined,
//   });

//   const updateFilter = (filterType, value) => {
//     _upadateFilters({
//       [filterType]: value,
//     });
//   };

//   return {
//     models: { filters },
//     operations: { updateFilter },
//   };
// }

// export default function Search() {
//   const { operations, models } = usePostFilter();

//   const { data, loading, error, refresh } = useQuery(FILTER_POST);

//   const [sidebarData, setSidebarData] = useState({
//     searchTerm: "",
//     sort: "desc",
//     category: "uncategorized",
//   });

//   console.log(data);
//   console.log(sidebarData);

//   const [posts, setPosts] = useState([]);
//   const [showMore, setShowMore] = useState(false);

//   const location = useLocation();

//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   const urlParams = new URLSearchParams(location.search);
//   //   const searchTermFromUrl = urlParams.get("searchTerm");
//   //   const sortFromUrl = urlParams.get("sort");
//   //   const categoryFromUrl = urlParams.get("category");
//   //   if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
//   //     setSidebarData((prevSidebarData) => ({
//   //       ...prevSidebarData,
//   //       searchTerm: searchTermFromUrl,
//   //       sort: sortFromUrl,
//   //       category: categoryFromUrl,
//   //     }));
//   //   }

//   //   const fetchPosts = async () => {
//   //     setLoading(true);
//   //     const urlParams = new URLSearchParams(location.search);
//   //     const searchQuery = urlParams.toString();
//   //     console.log(urlParams);
//   //     let url = `/api/post/getposts?${searchQuery}`;

//   //     if (sidebarData.category === "uncategorized") {
//   //       url = url.replace("&category=uncategorized", "");
//   //     }

//   //     const res = await fetch(url);

//   //     if (!res.ok) {
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     if (res.ok) {
//   //       const data = await res.json();
//   //       setPosts(data.posts);
//   //       setLoading(false);
//   //       if (data.posts.length === 9) {
//   //         setShowMore(true);
//   //       } else {
//   //         setShowMore(false);
//   //       }
//   //     }
//   //   };

//   //   fetchPosts();
//   // }, [location.search]);

//   if (loading) return <div>Loading</div>;

//   const handleChange = (e) => {
//     if (e.target.id === "searchTerm") {
//       setSidebarData({ ...sidebarData, searchTerm: e.target.value });
//     }
//     if (e.target.id === "sort") {
//       const order = e.target.value || "desc";
//       setSidebarData({ ...sidebarData, sort: order });
//     }
//     if (e.target.id === "category") {
//       const category = e.target.value || "uncategorized";
//       const categoryToSend = category === "uncategorized" ? null : category;
//       setSidebarData({ ...sidebarData, category: categoryToSend });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const urlParams = new URLSearchParams(location.search);
//     urlParams.set("searchTerm", sidebarData.searchTerm);
//     urlParams.set("sort", sidebarData.sort);
//     urlParams.set("category", sidebarData.category);
//     const searchQuery = urlParams.toString();
//     navigate(`/search?${searchQuery}`);
//   };

//   const handleShowMore = async () => {
//     const numberOfPosts = posts.length;
//     const startIndex = numberOfPosts;
//     const urlParams = new URLSearchParams(location.search);
//     urlParams.set("startIndex", startIndex);
//     const searchQuery = urlParams.toString();
//     const res = await fetch(`/api/post/getposts?${searchQuery}`);
//     if (!res.ok) {
//       return;
//     }
//     if (res.ok) {
//       const data = await res.json();
//       setPosts([...posts, ...data.posts]);
//       if (data.posts.length === 9) {
//         setShowMore(true);
//       } else {
//         setShowMore(false);
//       }
//     }
//   };
//   if (error) return <div>Error</div>;
//   return (
//     <div className="flex flex-col md:flex-row">
//       <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
//         <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
//           <div className="flex   items-center gap-2">
//             <label className="whitespace-nowrap font-semibold">
//               Pesquisar por:
//             </label>
//             <TextInput
//               placeholder="Search..."
//               id="searchTerm"
//               type="text"
//               value={sidebarData.searchTerm}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="font-semibold">Ordenar:</label>
//             <Select onChange={handleChange} value={sidebarData.sort} id="sort">
//               <option value="desc">Mais recente</option>
//               <option value="asc">Mais antigo</option>
//             </Select>
//           </div>
//           <div className="flex items-center gap-2">
//             <label className="font-semibold">Categoria:</label>
//             <Select
//               onChange={handleChange}
//               value={sidebarData.category}
//               id="category"
//             >
//               <option value="uncategorized">Todos</option>
//               <option value="reactjs">React.js</option>
//               <option value="nextjs">Next.js</option>
//               <option value="javascript">JavaScript</option>
//             </Select>
//           </div>
//           <Button type="submit" outline color="dark">
//             Filtrar
//           </Button>
//         </form>
//       </div>
//       <div className="w-full">
//         <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
//           Resultado da pesquisa:
//         </h1>
//         <div className="p-7 flex flex-wrap gap-4">
//           {!loading && posts.length === 0 && (
//             <p className="text-xl text-gray-500">
//               Nenhuma postagem encontrada.
//             </p>
//           )}
//           {loading && <p className="text-xl text-gray-500">Loading...</p>}
//           {!loading &&
//             posts &&
//             posts.map((post) => <PostCard key={post._id} post={post} />)}
//           {showMore && (
//             <button
//               onClick={handleShowMore}
//               className="text-teal-500 text-lg hover:underline p-7 w-full"
//             >
//               Mostrar mais
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
