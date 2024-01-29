import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className=" flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* esquerda  */}
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold self-center whitespace-nowrap dark:text-white text-4xl"
          >
            <span className="px-2 py-1 bg-gradient-to-t from-orange-500 via-orange-500 to-rose-500 rounded-lg text-white">
              Orange
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Este é um projeto de demonstração. Você pode se inscrever com seu
            e-mail e senha ou com o Google.
          </p>
        </div>
        {/* direita */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Seu usuário" />
              <TextInput type="text" placeholder="Usuário" id="username" />
            </div>
            <div className="">
              <Label value="Seu email" />
              <TextInput
                type="text"
                placeholder="alguem@email.com"
                id="email"
              />
            </div>
            <div className="">
              <Label value="Sua senha" />
              <TextInput type="text" placeholder="Senha" id="password" />
            </div>
            <Button gradientDuoTone="pinkToOrange" type="submit">
              Inscreva-se
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Já tem uma conta?</span>
            <Link to="/sign-in" className="text-blue-500">
              Conecte-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
