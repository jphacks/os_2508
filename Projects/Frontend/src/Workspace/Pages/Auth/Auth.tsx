import './Auth.css';
import ConfirmButton from '../../Components/ConfirmButton/ConfirmButton';
import InputField from '../../Components/InputField/InputField';
import { useRef } from "react";


function Auth() {
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
        <form action="/CheckAuth" method="POST">
            <div className="AuthBackground">
                <div className="AuthBox">
                    <div className="AuthInvite">
                        <InputField name="invitedKey" type="password" placeholder="Invite code" />
                    </div>
                    <div className="AuthSubmit">
                        <ConfirmButton
                            type="submit"
                            onClick={(handleCreate)}
                            label="submit"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Auth;