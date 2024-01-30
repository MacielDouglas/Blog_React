import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsLinkedin, BsGithub, BsTwitterX } from "react-icons/bs";

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-orange-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-3 mr-1 py-1 bg-gradient-to-t from-orange-500 via-orange-500 to-rose-500 rounded-lg text-white">
                Orange
              </span>
              Blog
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <Footer.Title title="Sobre" />
            <Footer.LinkGroup col>
              <Footer.Link
                href="https://macield.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meu Portfólio
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Conheça Melhor" />
            <Footer.LinkGroup col>
              <Footer.Link
                href="https://github.com/MacielDouglas"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="Outros projetos" />
            <Footer.LinkGroup col>
              <Footer.Link
                href="https://imobiliaria-olinda.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Olinda Imóveis
              </Footer.Link>
              <Footer.Link
                href="https://cafe-bourbon.web.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Café Bourbon
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="https://macield.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            by="MacielD."
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon
              href="https://github.com/MacielDouglas"
              icon={BsGithub}
              className="hover:text-orange-500"
            />
            <Footer.Icon
              href="https://www.linkedin.com/in/douglas-maciel-4943461b0/"
              icon={BsLinkedin}
              className="hover:text-orange-500"
            />
            <Footer.Icon
              href="#"
              icon={BsFacebook}
              className="hover:text-orange-500"
            />
            <Footer.Icon
              href="https://twitter.com/Maciel_dev"
              icon={BsTwitterX}
              className="hover:text-orange-500"
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}
