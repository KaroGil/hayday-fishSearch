import Image from "next/image";
export default function FishName({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={`/fish/${name.split(" ").join("_")}.webp`}
        alt={`${name} fish`}
        width={48}
        height={48}
        className="inline-block mx-1"
      />
      <p className="font-bold">{name}</p>
    </div>
  );
}
