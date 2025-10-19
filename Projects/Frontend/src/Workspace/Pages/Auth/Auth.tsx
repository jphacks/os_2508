import './Auth.css';
import ConfirmButton from '../../Components/ConfirmButton/ConfirmButton';
import InputField from '../../Components/InputField/InputField';
import React, { useState } from "react";


function Auth() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");

    const handleCreate = () => {
        fetch("/Event/Create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ title, date })
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
                        {/* <InputField name="invitedKey" type="password" placeholder="invite code" /> */}
                        <InputField
                            name="invitedKey"
                            type="text"
                            placeholder="Invite Code"
                        />
                    </div>
                    <div className="AuthSubmit">
                        {/* <ConfirmButton type="submit" label="submit" /> */}
                        <ConfirmButton
                            type="submit"
                            onClick={(handleCreate) }
                            label="submit"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Auth;