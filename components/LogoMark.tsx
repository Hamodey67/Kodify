import Image from "next/image";

export default function LogoMark() {
  return (
    <Image
      src="/kodify.png"
      alt="Logo"
      width={40}
      height={20}
      priority
      className="h-12 w-auto"
    />
  );
}
