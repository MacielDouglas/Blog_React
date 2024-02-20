import { Table, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        if (currentUser) {
          const res = await fetch(
            `/api/post/getPosts?userId=${currentUser._id}`
          );
          if (res.ok) {
            const data = await res.json();
            setUserPosts(data.posts);
            if (data.posts.length < 9) {
              setShowMore(false);
            }
          } else {
            setError(
              "Falha ao carregar as postagens. Tente novamente mais tarde."
            );
          }
        }
      } catch (error) {
        setError("Falha ao carregar as postagens. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <Spinner className="mx-auto my-8" color="teal" size="xl" />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          {currentUser.isAdmin && userPosts.length > 0 ? (
            <>
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Data envio</Table.HeadCell>
                  <Table.HeadCell>Imagem postada</Table.HeadCell>
                  <Table.HeadCell>Titulo da postagem</Table.HeadCell>
                  <Table.HeadCell>Categoria</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Editar</span>
                  </Table.HeadCell>
                </Table.Head>
                {userPosts.map((post) => (
                  <Table.Body className="divide-y" key={post._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-20 h-10 object-cover bg-gray-500"
                          />
                        </Link>
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        <Link to={`/post/${post.slug}`}>{post.title}</Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span className="font-medium text-red-500 hover:underline cursor-pointer">
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link
                          className="text-teal-500 hover:underline"
                          to={`/update-post/${post._id}`}
                        >
                          <span>Editar</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
              {showMore && (
                <button
                  onClick={handleShowMore}
                  className="w-full text-teal-500 text-sm py-7"
                >
                  Mostrar Mais
                </button>
              )}
            </>
          ) : (
            <p className="text-center">
              {currentUser
                ? "Você ainda não tem postagens!"
                : "Faça login para ver suas postagens."}
            </p>
          )}
        </>
      )}
    </div>
  );
}
