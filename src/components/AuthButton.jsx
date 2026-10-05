export default function AuthButton({
  children,
  onClick,
  variant = "primary",
}) {
  const styles =
    variant === "primary"
      ? "bg-[#08B9A4] text-white"
      : "bg-[#E8E8E8] text-gray-700";

  return (
    <button
      onClick={onClick}
      className={`h-12 w-full rounded-full text-sm font-medium transition active:scale-[0.98] ${styles}`}
    >
      {children}
    </button>
  );
}