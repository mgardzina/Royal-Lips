interface FormButtonProps {
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function FormButton({
  type = "button",
  variant = "primary",
  onClick,
  disabled = false,
  children,
  className = "",
}: FormButtonProps) {
  const baseClasses =
    "py-4 font-light text-sm tracking-widest transition-all uppercase";

  const variantClasses = {
    primary:
      "bg-primary-taupe text-text-light hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed border-2 border-primary-taupe/30 hover:border-accent-warm shadow-md",
    secondary:
      "border-2 border-text-dark/30 text-text-dark hover:bg-bg-main/50 hover:border-text-dark/50 shadow-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
