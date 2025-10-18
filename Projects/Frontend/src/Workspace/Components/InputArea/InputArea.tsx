import "./InputArea.css"

type InputArea = {
    row: number;
    col: number;
    placeholder: string;

}
const InputArea = ({row, col, placeholder}: InputArea) => {
    return (
        <textarea className="InputArea"  rows={row} cols={col} placeholder={placeholder} />
    )
}
export default InputArea;
