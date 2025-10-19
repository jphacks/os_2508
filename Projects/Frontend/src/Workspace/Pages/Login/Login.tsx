import "./Login.css";
import ConfirmButton from "../../Components/ConfirmButton/ConfirmButton";
import InputField from "../../Components/InputField/InputField";
import BaseButton from "../../Components/BaseButton/BaseButton";
import { useRef } from "react";


function Login() {
  const titleRef = useRef<HTMLInputElement>(null);
    const handleCreate = () => {
        const title = titleRef.current?.value || "";

        fetch("/Event/Create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => {
                console.error(err);
                alert(`エラーが発生しました: ${err.message}`);
            });
    };
  return (
    <form action="/Login/Submit" method="POST">
      <div className="LoginBackground">
        <div className="LoginPosition">
          <div className="LoginField">
            <InputField name="userId" type="text" placeholder="UserID" />
            <InputField name="password" type="password" placeholder="Passward" />
          </div>
          <div className="LoginBox">
             <ConfirmButton
                            type="submit"
                            onClick={(handleCreate)}
                            label="submit"
                        />
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
