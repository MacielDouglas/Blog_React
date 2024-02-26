import { useEffect, useState } from "react";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";
import { Button, Textarea } from "flowbite-react";

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
    numberOfLikes: PropTypes.number.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
};

export default function Comment({ comment, onLike, onEdit }) {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              rows="3"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" size="sm" color="dark" onClick={handleSave}>
                Salvar
              </Button>
              <Button
                type="button"
                size="sm"
                color="dark"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Editar
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
