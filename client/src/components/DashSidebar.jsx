import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  // Extrair o valor da aba da URL usando o hook de efeito
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    setTab(tabFromUrl || "");
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Link para o perfil com a aba "profile" na URL */}
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label="Perfil"
            labelColor="dark"
            as="div"
          />
          <Link to="/dashboard?tab=profile">Perfil</Link>

          {/* Item de sair com ícone e classe de cursor */}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sair
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
