import "./ConfirmButton.css"

type BaseButton = {
    label: string;
    onClick?: () => void;
}

const BaseButton = ({label, onClick}: BaseButton) => {
    return (
        <button onClick = {onClick} className="BaseButton" >
            <p>{label}</p>
        </button>
    )
}
export default BaseButton;
