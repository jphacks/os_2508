import "./InputArea.css";

type InputAreaProps = {
  row?: number;
  col?: number;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  type?: string; // "text", "datetime-local" など
};

const InputArea = ({ row = 5, col = 50, placeholder = "", value, onChange, type = "textarea" }: InputAreaProps) => {
  if (type === "textarea") {
    return (
      <textarea
        className="InputArea"
        rows={row}
        cols={col}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  } else {
    return (
      <input
        className="InputArea"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  }
};

export default InputArea;
