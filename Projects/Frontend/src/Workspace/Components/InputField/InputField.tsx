import "./InputField.css"
type InputField = {
    name: string;
    placeholder: string;
    type: string;
}
const InputField = ({name, placeholder, type}: InputField) => {
    return (
        <input className="InputField" name={name} type={type} placeholder={placeholder} />
    )
}
export default InputField;
