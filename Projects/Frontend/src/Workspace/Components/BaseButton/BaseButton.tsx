import "./BaseButton.css"

type BaseButton = {
    label: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
}

const BaseButton = ({label, onClick, type}: BaseButton) => {
    return (
        <button onClick = {onClick} className="BaseButton" type={type}>
            <p>{label}</p>
        </button>
    )
}
export default BaseButton;
