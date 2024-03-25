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
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutation/user.mutation.js";

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

const SubmitButton = ({ loading, children }) => (
  <Button color="dark" type="submit" disabled={loading}>
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
  // const { loading, error: errorMessage } = useSelector((state) => state.user);
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(setSignInFailure("Preencha todos os campos."));
    }
    console.log(formData);

    try {
      dispatch(setSignInLoading());

      const { data } = await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      if (data && data.loginUser && data.loginUser.token) {
        const user = {
          username: data.loginUser.username,
          email: data.loginUser.email,
          token: data.loginUser.token,
          profilePicture: data.loginUser.profilePicture,
          isAdmin: data.loginUser.isAdmin,
        };

        dispatch(setSignInSuccess(user));
        navigate("/");
      } else {
        console.log("Não tem nada...");
      }
    } catch (error) {
      dispatch(setSignInFailure(error.message));
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
          {error && (
            <Alert className="mt-5" color="failure">
              <p>Error: {error.message}</p>
              {/* {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage} */}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

SubmitButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
};

// import { useState } from "react";
// import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
// import { Link, useNavigate } from "react-router-dom";
// import PropTypes from "prop-types";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setSignInLoading,
//   setSignInSuccess,
//   setSignInFailure,
// } from "../redux/user/userSlice";
// import OAuth from "../components/OAuth";

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

// const SubmitButton = ({ loading, children }) => (
//   <Button color="dark" type="submit" disabled={loading}>
//     {loading ? (
//       <>
//         <Spinner size="sm" />
//         <span className="pl-3">Loading.....</span>
//       </>
//     ) : (
//       children
//     )}
//   </Button>
// );

// const SignIn = () => {
//   const [formData, setFormData] = useState({});
//   const { loading, error: errorMessage } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       return dispatch(setSignInFailure("Preencha todos os campos."));
//     }

//     try {
//       dispatch(setSignInLoading());
//       const res = await fetch("/api/auth/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       const data = await res.json();

//       if (data.success === false) {
//         dispatch(setSignInFailure(data.message));
//       }

//       if (res.ok) {
//         dispatch(setSignInSuccess(data));
//         console.log("DATA: ", data);
//         console.log("DATA_Message: "), data.message;
//         navigate("/");
//       }
//     } catch (error) {
//       dispatch(setSignInFailure(error.message));
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
//             <span className="px-3 mr-1 py-1 bg-gradient-to-t from-orange-500 via-orange-500 to-rose-500 rounded-lg text-white">
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
//             <SubmitButton loading={loading}>Entrar</SubmitButton>
//             <OAuth />
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
// };

// export default SignIn;

// FormField.propTypes = {
//   label: PropTypes.string.isRequired,
//   type: PropTypes.string.isRequired,
//   placeholder: PropTypes.string.isRequired,
//   id: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
// };
