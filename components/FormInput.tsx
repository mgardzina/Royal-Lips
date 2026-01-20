interface FormInputProps {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  pattern?: string;
  title?: string;
  className?: string;
}

export default function FormInput({
  label,
  type = "text",
  required = false,
  value,
  onChange,
  onFocus,
  placeholder,
  pattern,
  title,
  className = "",
}: FormInputProps) {
  return (
    <div>
      <label className="block text-xs font-light text-text-dark mb-3 tracking-wider uppercase">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        pattern={pattern}
        title={title}
        className={`w-full px-4 py-3 border border-text-dark/20 bg-bg-main/50 focus:border-primary-taupe outline-none transition-colors font-light ${className}`}
        placeholder={placeholder}
      />
    </div>
  );
}
