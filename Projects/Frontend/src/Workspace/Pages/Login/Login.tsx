import "./Login.css";
import ConfirmButton from "../../Components/ConfirmButton/ConfirmButton";
import InputField from "../../Components/InputField/InputField";
import BaseButton from "../../Components/BaseButton/BaseButton";

function Login() {
  return (
    <form action="/Login/Submit" method="POST">
      <div className="LoginBackground">
        <div className="LoginPosition">
          <div className="LoginField">
            <InputField name="userId" type="text" placeholder="UserID" />
            <InputField name="password" type="password" placeholder="Passward" />
          </div>
          <div className="LoginBox">
            <ConfirmButton label="Login" type="submit" />
          </div>
        </div>
        <div className="LoginHomeButton">
          <BaseButton label="Home" onClick={ () => window.location.href = "/Home"} type="button"/>
        </div>
      </div>
    </form >
  );
}

export default Login;
