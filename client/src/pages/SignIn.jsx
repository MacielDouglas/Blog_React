import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  setSignInLoading,
  setSignInSuccess,
  setSignInFailure,
} from "../redux/user/userSlice";
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
  placeholder: PropTypes.string.isRequired, // Adiciona validação para a propriedade placeholder
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const SubmitButton = ({ loading, children }) => (
  <Button gradientDuoTone="pinkToOrange" type="submit" disabled={loading}>
    {loading ? (
      <>
        <Spinner size="sm" />
        <span className="pl-3">Loading.....</span>
      </>
    ) : (
      children
    )}
  </Button>
);

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(setSignInFailure("Preencha todos os campos."));
      // return setErrorMessage("Preencha todos os campos.");
    }

    try {
      dispatch(setSignInLoading());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(setSignInFailure(data.message));
        // return setErrorMessage("Credenciais inválidas.");
      }

      // setLoading(false);
      if (res.ok) {
        dispatch(setSignInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(setSignInFailure(error.message));
      // setErrorMessage("Ocorreu um erro. Tente novamente mais tarde.");
      // setLoading(false);
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
              label="Seu email"
              type="text"
              placeholder="alguem@email.com"
              id="email"
              onChange={handleChange}
            />
            <FormField
              label="Sua senha"
              type="password"
              placeholder="***************"
              id="password"
              onChange={handleChange}
            />
            <SubmitButton loading={loading}>Entrar</SubmitButton>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Ainda não tem uma conta?</span>
            <Link to="/sign-up" className="text-blue-500">
              {" "}
              Inscreva-se
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
};

export default SignIn;

// import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
// import { Link, useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import { useState } from "react";

// const FormField = ({ label, type, placeholder, id, onChange }) => (
//   <div>
//     <Label value={label} />
//     <TextInput
//       type={type}
//       placeholder={placeholder}
//       id={id}
//       onChange={onChange}
//     />
//   </div>
// );

// FormField.propTypes = {
//   label: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   placeholder: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired, // Adiciona a validação para a propriedade onChange
// };

// export default function SignIn() {
//   const [formData, setFormData] = useState({});
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       return setErrorMessage("Por favor, preencha todos os campos.");
//     }

//     try {
//       setLoading(true);
//       setErrorMessage(null);
//       const res = await fetch("/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();

//       if (data.success === false) {
//         return setErrorMessage(data.message);
//       }
//       setLoading(false);
//       if (res.ok) {
//         navigate("/");
//       }
//     } catch (error) {
//       setErrorMessage(error.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen mt-20">
//       <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
//         {/* Esquerda */}
//         <div className="flex-1">
//           <Link
//             to="/"
//             className="font-bold self-center whitespace-nowrap dark:text-white text-4xl"
//           >
//             <span className="px-2 py-1 bg-gradient-to-t from-orange-500 via-orange-500 to-rose-500 rounded-lg text-white">
//               Orange
//             </span>
//             Blog
//           </Link>
//           <p className="text-sm mt-5">
//             Este é um projeto de demonstração. Você pode se inscrever com seu
//             e-mail e senha ou com o Google.
//           </p>
//         </div>
//         {/* Direita */}
//         <div className="flex-1">
//           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//             <FormField
//               label="Seu email"
//               type="text"
//               placeholder="alguem@email.com"
//               id="email"
//               onChange={handleChange}
//             />
//             <FormField
//               label="Sua senha"
//               type="password"
//               placeholder="***************"
//               id="password"
//               onChange={handleChange}
//             />
//             <Button
//               gradientDuoTone="pinkToOrange"
//               type="submit"
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Spinner size="sm" />
//                   <span className="pl-3">Loading.....</span>
//                 </>
//               ) : (
//                 "Entrar"
//               )}
//             </Button>
//           </form>
//           <div className="flex gap-2 text-sm mt-5">
//             <span>Ainda não tem uma conta?</span>
//             <Link to="/sign-up" className="text-blue-500">
//               {" "}
//               Inscreva-se
//             </Link>
//           </div>
//           {errorMessage && (
//             <Alert className="mt-5" color="failure">
//               {errorMessage}
//             </Alert>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
