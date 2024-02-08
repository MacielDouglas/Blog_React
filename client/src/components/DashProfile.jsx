import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  // Seleciona os dados do usuário e erros do estado global Redux
  const { currentUser, error } = useSelector((state) => state.user);

  // Estados para armazenar dados do formulário e estados de upload de imagem
  const [formState, setFormState] = useState({
    username: currentUser.username,
    email: currentUser.email,
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  // Estados para mensagens de sucesso e erro durante a atualização do usuário e modal
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Referência para o elemento de entrada de arquivo no DOM
  const filePickerRef = useRef();

  // Dispatcher Redux para despachar ações de atualização e exclusão do usuário
  const dispatch = useDispatch();

  // Efeito para iniciar o upload da imagem quando um arquivo é selecionado
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Manipulador de evento para alterar a imagem selecionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // Função para upload da imagem para o Firebase Storage
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    // Evento para acompanhar o progresso do upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Não foi possível fazer upload da imagem (o arquivo deve ter menos de 2 MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        // Upload concluído com sucesso
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setImageFileUploadProgress(100);
          setImageFileUploading(false);
          setFormState({ ...formState, profilePicture: downloadUrl });
        });
      }
    );
  };

  // Manipulador de evento para alterar dados do formulário
  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    });
  };

  // Função para lidar com o envio do formulário de atualização do usuário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formState).length === 0) {
      setUpdateUserError("Nenhuma alteração foi feita");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Aguarde o upload da imagem");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Perfil do usuário atualizado com sucesso");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  // Função para lidar com a exclusão do usuário
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Renderização do componente
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      {/* Título da página */}
      <h1 className="my-7 text-center font-semibold text-3xl">Perfil</h1>
      {/* Formulário de atualização do perfil */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Input de arquivo para selecionar uma nova imagem de perfil */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        {/* Preview da imagem de perfil atual ou selecionada */}
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {/* Barra de progresso circular para exibir o progresso do upload */}
          {imageFileUploadProgress > 0 && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          {/* Imagem de perfil atual ou a imagem selecionada */}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="imagem do usuário"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {/* Exibe mensagem de erro de upload, se houver */}
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        {/* Campos de entrada para nome de usuário, e-mail e senha */}
        <TextInput
          type="text"
          id="username"
          placeholder="usuário"
          value={formState.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          value={formState.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="senha"
          onChange={handleChange}
        />
        {/* Botão para enviar o formulário de edição do perfil */}
        <Button type="submit" color="dark" outline>
          Alterar
        </Button>
      </form>
      {/* Opções para deletar a conta ou fazer logout */}
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModal(true)} className="cursor-pointer">
          Deletar Conta
        </span>
        <span className="cursor-pointer">Sair</span>
      </div>
      {/* Exibe mensagens de sucesso e erro */}
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}
      {/* Modal de confirmação para deletar a conta */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Tem certeza de que deseja excluir sua conta?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Sim, quero excluir!
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Não, cancelar!
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
