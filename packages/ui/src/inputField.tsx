import {colors} from "../../../apps/web/src/constants/colors"


type InputFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
};

export function InputField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  autoComplete,
  required = false,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2" style={{ color: colors.dark.text }}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        onChange={(e: any) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none text-white placeholder:text-gray-500"
        style={{
          backgroundColor: colors.dark.bg,
          borderColor: colors.dark.border,
        }}
        onFocus={(e: any) => (e.currentTarget.style.borderColor = colors.primary[500])}
        onBlur={(e: any) => (e.currentTarget.style.borderColor = colors.dark.border)}
      />
    </div>
  );
}
