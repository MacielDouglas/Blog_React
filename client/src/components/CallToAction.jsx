import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="bg-[rgb(34,34,34)] flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl text-gray-100">Gostou desse projeto?</h2>
        <p className="text-gray-500 my-2">
          Fale comigo e criaremos um projeto junto, seja página web, aplicativo
          ou back-end.
        </p>
        <Button color="dark" className="rounded-tl-xl rounded-bl-none">
          <a
            href="https://macield.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Maciel.D
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          className="border"
          src="https://img.freepik.com/vetores-gratis/ilustracao-de-devops-de-tecnologia-de-design-plano_23-2149356401.jpg?w=996&t=st=1708614351~exp=1708614951~hmac=4757c9bfb9ebdde094476ec60061972905d1ddd80e2f04227b5d4f79fd5b55ff"
          alt=""
        />
      </div>
    </div>
  );
}
