export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div>
          <h1 className="text-3xl font font-semibold text-center my-7">
            Sobre o Orange Blog
          </h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Bem vindo ao Orange Blog!! Este blog foi criado por{" "}
              <span className="font-bold italic">Maciel D.</span> como um
              projeto pessoal para compartilhar seus pensamentos e ideias com o
              mundo. <span className="font-bold italic">Maciel D.</span> é um
              desenvolvedor apaixonado por tecnologia, codificação e tudo o
              mais.
            </p>
            <p>
              Este blog foi desenvolvido pensando em demonstrar conhecimento em
              desenvolvimento de software, usando a tecnologia de React JS, bem
              como sua biblioteca. Também está usando Firebase, e MongoDb para
              guarder essas informações.
            </p>
            <p>
              Se gostou desse projeto, ou tem algo a acrescentar, fique a
              vontade para usar. Pode criar uma conta simples com email e senha,
              ou pode fazer login com uma conta google.
            </p>
            <p>
              Se quiser entrar em contato comigo, por favor acesse me portfólio.
            </p>
            <p>
              Obrigado, <span className="font-bold italic">Maciel D.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
