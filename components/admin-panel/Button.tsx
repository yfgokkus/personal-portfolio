import { cn } from "@/lib/cn";

type ButtonProps = {
  onClick: () => void;
  text: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function Button({
  onClick,
  text,
  disabled,
  loading,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50",
        className,
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {text}
        </span>
      ) : (
        text
      )}
    </button>
  );
}
