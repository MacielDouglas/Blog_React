import { useEffect, useState } from "react";
import moment from "moment";
import "moment/dist/locale/pt-br";

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [comment]);

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={loading ? "" : user.profilePicture}
          alt={loading ? "Carregando..." : user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {loading
              ? "Carregando..."
              : user
              ? `@${user.username}`
              : "Usuário anônimo"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).locale("pt-br").fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
}