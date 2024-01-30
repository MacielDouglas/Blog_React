import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  setSignInLoading,
  setSignInSuccess,
  setSignInFailure,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  // Inicialização das instâncias do Firebase e do Redux
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Função para lidar com o login usando a conta do Google
  const handleGoogle = async () => {
    // Configuração do provedor de autenticação do Google
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Realiza o login com o popup do Google
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      // Processa os resultados do login com o Google
      await handleGoogleSignInResults(resultsFromGoogle.user);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para processar os resultados do login com o Google
  const handleGoogleSignInResults = async (user) => {
    const { displayName, email, photoUrl } = user;

    try {
      // Atualiza o estado de carregamento no Redux
      dispatch(setSignInLoading());

      // Chama a API para autenticar o usuário com o backend
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: displayName,
          email,
          googlePhotoUrl: photoUrl,
        }),
      });

      // Verifica se a resposta da API foi bem-sucedida
      if (res.ok) {
        const data = await res.json();
        // Atualiza o estado de sucesso no Redux e redireciona para a página principal
        dispatch(setSignInSuccess(data));
        navigate("/");
      } else {
        // Se a resposta não for bem-sucedida, atualiza o estado de falha no Redux
        dispatch(setSignInFailure("Erro ao autenticar com o Google"));
      }
    } catch (error) {
      console.log(error);
      // Se ocorrer um erro durante o processamento, atualiza o estado de falha no Redux
      dispatch(setSignInFailure("Erro ao processar resposta do Google"));
    }
  };

  return (
    <Button type="button" color="dark" outline onClick={handleGoogle}>
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continuar com Google
    </Button>
  );
}
