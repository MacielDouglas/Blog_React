import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react"; // Importa Hooks do React
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

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user); // Extrai o usuário atual do estado global usando o seletor Redux
  const [imageFile, setImageFile] = useState(null); // Estado para armazenar o arquivo de imagem selecionado
  const [imageFileUrl, setImageFileUrl] = useState(null); // Estado para armazenar a URL da imagem
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(0); // Estado para acompanhar o progresso do upload da imagem
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // Estado para armazenar mensagens de erro de upload
  const filePickerRef = useRef(); // Referência para o elemento de entrada de arquivo no DOM

  // Manipulador de evento para alterar a imagem selecionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file)); // Cria uma URL para visualização da imagem
    }
  };

  // Efeito colateral para iniciar o upload da imagem quando um arquivo é selecionado
  useEffect(() => {
    if (imageFile) {
      uploadImage(); // Inicia o processo de upload da imagem
    }
  }, [imageFile]);

  // Função para upload da imagem para o Firebase Storage
  const uploadImage = async () => {
    const storage = getStorage(app); // Obtém a instância de armazenamento do Firebase
    const fileName = new Date().getTime() + imageFile.name; // Gera um nome de arquivo único
    const storageRef = ref(storage, fileName); // Cria uma referência de armazenamento para o arquivo
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // Inicia o upload do arquivo

    // Evento para acompanhar o progresso do upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calcula o progresso em porcentagem
        setImageFileUploadProgress(progress.toFixed(0)); // Atualiza o estado de progresso do upload
      },
      (error) => {
        // Manipula erros de upload
        setImageFileUploadError(
          "Não foi possível fazer upload da imagem (o arquivo deve ter menos de 2 MB)"
        );
        setImageFileUploadProgress(0); // Reinicia o progresso do upload para 0
        setImageFile(null); // Limpa o arquivo de imagem selecionado
        setImageFileUrl(null); // Limpa a URL da imagem
      },
      () => {
        // Upload concluído com sucesso
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl); // Define a URL da imagem após o upload
          setImageFileUploadProgress(100); // Define o progresso do upload como 100 ao concluir
        });
      }
    );
  };

  // Renderização do componente
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Perfil</h1>
      <form className="flex flex-col gap-4">
        {/* Input de arquivo para selecionar uma nova imagem de perfil */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        {/* Div para exibir a imagem de perfil atual */}
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
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="senha" />
        {/* Botão para enviar o formulário de edição do perfil */}
        <Button type="submit" color="dark" outline>
          Alterar
        </Button>
      </form>
      {/* Opções para deletar a conta ou fazer logout */}
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Deletar Conta</span>
        <span className="cursor-pointer">Sair</span>
      </div>
    </div>
  );
}
