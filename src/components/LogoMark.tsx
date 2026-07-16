interface Props {
  size?: number
  className?: string
}

export const LogoMark = ({ size = 64, className }: Props) => (
  <div
    className={`flex items-center justify-center overflow-hidden rounded-[26%] bg-white shadow-sm ring-1 ring-black/[0.06] ${className ?? ''}`}
    style={{ width: size, height: size }}
  >
    <img src="/icons/mark.png" alt="Loop" width={size} height={size} className="h-full w-full object-cover" />
  </div>
)
