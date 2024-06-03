import "./Button.css";

function Button({ children, onClick, className }) {
  return (
    <button onClick={onClick ? onClick : () => {}} className={className}>
      {children}
    </button>
  );
}

export default Button;
