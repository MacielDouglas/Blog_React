import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";

export default function Dashboard() {
  // Obter a localização atual da rota
  const location = useLocation();

  // Estado local para armazenar a aba ativa
  const [tab, setTab] = useState(
    () => new URLSearchParams(location.search).get("tab") || ""
  );

  // Efeito para atualizar a aba com base nos parâmetros da URL
  useEffect(() => {
    // Extrair o valor do parâmetro "tab" da URL
    const tabFromUrl = new URLSearchParams(location.search).get("tab");

    // Definir a aba com base no valor da URL, ou manter vazio se não estiver presente
    setTab(tabFromUrl || "");
  }, [location.search]);

  return (
    // Estrutura principal do painel
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* Renderizar o componente de perfil se a aba for "profile" */}
      {tab === "profile" && <DashProfile />}

      {/* posts  */}
      {tab === "posts" && <DashPosts />}

      {/* users  */}
      {tab === "users" && <DashUsers />}
    </div>
  );
}
