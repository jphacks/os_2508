import "./SeveralButton.css"
type SeveralButton = {
    label: string; 
    onClick: () => void; 


}
const SeveralButton = ({label, onClick}: SeveralButton) => {
    return (
        <button onClick={onClick} className="SeveralButton">
            <p>{label}</p>
        </button>
    )
}
export default SeveralButton;
