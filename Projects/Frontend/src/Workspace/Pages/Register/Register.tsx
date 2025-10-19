import './Register.css';
import ConfirmButton from "../../Components/ConfirmButton/ConfirmButton";
import InputField from "../../Components/InputField/InputField";
import BaseButton from "../../Components/BaseButton/BaseButton";
import { useRef } from "react";

function Register() {
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
        <form action="/Register/Submit" method="POST">
            <div className="RegisterBackground">
                <div className="RegisterBox">
                    <div className="RegisterDoubleField">
                        <InputField name="nickname" type="text" placeholder="nickname" />
                        <InputField name="birth" type="text" placeholder="birth (YYYY/MM/DD)" />
                    </div>
                    <div className="RegisterUseridPassword">
                        <InputField name="userId" type="text" placeholder="user ID" />
                        <InputField name="password" type="password" placeholder="password" />
                    </div>
                    <div className="RegisterDoubleField">
                        <InputField name="gradYear" type="text" placeholder="grad. year (YYYY)" />
                        <InputField name="organization" type="search" placeholder="organization" />
                    </div>
                    <div className="RegisterMessage">
                        <InputField name="comment" class-name="textbox" type="text" placeholder="message" />
                    </div>
                    <div className="RegisterButton">
                        <ConfirmButton
                            type="submit"
                            onClick={(handleCreate)}
                            label="Register"
                        />
                    </div>
                </div>
                <div className="RegisterHomeButton">
                    <BaseButton label="Home" onClick={() => window.location.href = "/Home"} type="button"/>
                </div>
            </div>
        </form>
    );
}
export default Register;