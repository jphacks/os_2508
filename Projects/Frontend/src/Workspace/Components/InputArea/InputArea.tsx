import "./InputArea.css"

type InputArea = {
    row: number;
    col: number;
    placeholder: string;

}
const InputArea = ({row, col, placeholder}: InputArea) => {
    return (
        <textarea className="inputArea" rows={row} cols={col} placeholder={placeholder} />
    )
}
export default InputArea;
