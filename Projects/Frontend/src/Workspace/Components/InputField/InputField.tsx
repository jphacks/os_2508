import "./InputField.css"
type InputFieldProps = {
    name: string;
    placeholder: string;
    type: string;
}
const InputField = ({name, placeholder, type}: InputFieldProps) => {
    return (
        <input className="InputField" name={name} type={type} placeholder={placeholder} />
    )
}
export default InputField;
