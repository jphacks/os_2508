import './Auth.css';
import ConfirmButton from '../../Components/ConfirmButton/ConfirmButton';
import InputField from '../../Components/InputField/InputField';


function Auth() {
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
                            label="submit"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default Auth;