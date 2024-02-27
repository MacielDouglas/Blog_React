import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import OAuth from "../components/OAuth";

const FormField = ({ label, type, placeholder, id, onChange }) => (
  <div>
    <Label value={label} />
    <TextInput
      type={type}
      placeholder={placeholder}
      id={id}
      onChange={onChange}
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired, // Adiciona a validação para a propriedade onChange
};

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Por favor, preencha todos os campos.");
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Esquerda */}
        <div className="flex-1">
          <Link
            to="/"
            className="font-bold self-center whitespace-nowrap dark:text-white text-4xl"
          >
            <span className="px-3 mr-1 py-1 bg-gradient-to-t from-orange-500 via-orange-500 to-rose-500 rounded-lg text-white">
              Orange
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Este é um projeto de demonstração. Você pode se inscrever com seu
            e-mail e senha ou com o Google.
          </p>
        </div>
        {/* Direita */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <FormField
              label="Seu usuário"
              type="text"
              placeholder="Usuário"
              id="username"
              onChange={handleChange}
            />
            <FormField
              label="Seu email"
              type="text"
              placeholder="alguem@email.com"
              id="email"
              onChange={handleChange}
            />
            <FormField
              label="Sua senha"
              type="password"
              placeholder="Senha"
              id="password"
              onChange={handleChange}
            />
            <Button color="dark" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading.....</span>
                </>
              ) : (
                "Inscreva-se"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Já tem uma conta?</span>
            <Link to="/sign-in" className="text-blue-500">
              {" "}
              Conecte-se
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
