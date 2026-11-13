import Image from "next/image";
import { MenuItem, MenuData, ItemRow } from "./menu-constants";

interface Props {
  data: MenuData;
  scaleFactor: number;
}

export default function MenuWithOrders({ data, scaleFactor }: Props) {
  const fuchka = data.items.filter((i) => i.category === "fuchka");
  const chatpati = data.items.filter((i) => i.category === "chatpati");
  const corn = data.items.filter((i) => i.category === "corn");

  return (
    <div
      className="p-5 lg:p-7 flex gap-6 lg:gap-8 font-sans"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: `${100 / scaleFactor}vw`,
        height: `${100 / scaleFactor}vh`,
        transform: `scale(${scaleFactor})`,
        transformOrigin: "top left",
      }}
    >
      <div className="w-28 lg:w-36 shrink-0 flex flex-col justify-between h-full py-1">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Jhupri Logo"
            width={110}
            height={110}
            priority
            className="rounded-full border-2 border-[#c47a35]/80 shadow-xl shadow-black/80 w-[88px] h-[88px] lg:w-[110px] lg:h-[110px] object-cover"
          />
          <span className="text-[#c47a35] text-[11px] lg:text-xs font-bold tracking-wider mt-1.5 text-center whitespace-nowrap">
            টক • ঝাল • মিষ্টি
          </span>
        </div>

        <div className="flex-1 my-3 rounded-2xl border border-white/20 bg-black/25 backdrop-blur-xs flex flex-col items-center justify-between py-5 px-2 shadow-xl shadow-black/40">
          <span className="text-[#dfa369] text-xs font-semibold tracking-wider text-center">
            এখন চলছে
          </span>
          <span
            className="font-serif font-black text-[#e8b958] tabular-nums leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{ fontSize: "clamp(3.5rem, 5.5vw, 5rem)" }}
          >
            {data.currentOrder}
          </span>
          <span className="text-white/40 text-[9px] tracking-widest font-semibold uppercase text-center">
            CURRENT ORDER
          </span>
        </div>

        <div className="flex-1 rounded-2xl border border-white/20 bg-black/25 backdrop-blur-xs flex flex-col items-center justify-between py-5 px-2 shadow-xl shadow-black/40">
          <span className="text-[#dfa369] text-xs font-semibold tracking-wider text-center">
            পরবর্তী
          </span>
          <span
            className="font-serif font-black text-white tabular-nums leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{ fontSize: "clamp(3.5rem, 5.5vw, 5rem)" }}
          >
            {data.currentOrder + 1}
          </span>
          <span className="text-white/40 text-[9px] tracking-widest font-semibold uppercase text-center">
            NEXT ORDER
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between h-full min-w-0 relative">
        <div className="flex gap-6 items-center justify-between h-[49%] min-h-0 pt-4 lg:pt-6">
          <div className="flex-1 flex flex-col justify-center h-full max-w-xl pr-4">
            <div>
              <div className="flex items-baseline justify-between pb-1.5">
                <h2 className="text-white font-extrabold text-xl lg:text-2xl tracking-wide">
                  ফুচকা{" "}
                  <span className="text-white/70 text-base font-normal tracking-wider">
                    | FUCHKA
                  </span>
                </h2>
                <span className="text-[#e58a3d] text-[11px] font-bold tracking-widest uppercase">
                  CRISPY & TANGY
                </span>
              </div>
              <div className="h-px bg-[#a85a2b]/40 w-full mb-3" />
            </div>

            <div className="flex flex-col gap-3">
              {fuchka.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>

          <div className="w-[48%] h-full relative flex items-center justify-center shrink-0">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-[4%] left-[49%] -translate-x-1/2 w-[34%] aspect-[290/296] z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]">
                <Image
                  src="/food-items/corn.png"
                  alt="Jhupri Masala Corn"
                  fill
                  sizes="25vw"
                  priority
                  className="object-contain object-bottom"
                />
              </div>

              <div className="absolute bottom-[2%] left-0 w-[56%] aspect-[659/456] z-20 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
                <Image
                  src="/food-items/fuchka.png"
                  alt="Jhupri Special Fuchka"
                  fill
                  sizes="35vw"
                  priority
                  className="object-contain object-bottom"
                />
              </div>

              <div className="absolute bottom-[3%] right-0 w-[52%] aspect-[611/413] z-20 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
                <Image
                  src="/food-items/chatpati.png"
                  alt="Jhupri Special Chatpati"
                  fill
                  sizes="35vw"
                  priority
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8 lg:gap-12 h-[48%] items-start pt-10 lg:pt-14 min-h-0">
          <div className="flex-1 flex flex-col justify-start h-full min-w-0">
            <div>
              <div className="flex items-baseline justify-between pb-1.5">
                <h2 className="text-white font-extrabold text-xl lg:text-2xl tracking-wide">
                  চটপটি{" "}
                  <span className="text-white/70 text-base font-normal tracking-wider">
                  </span>
                </h2>
                <span className="text-[#e58a3d] text-[11px] font-bold tracking-widest uppercase">
                </span>
              </div>
              <div className="h-px bg-[#a85a2b]/40 w-full mb-3" />
            </div>

            <div className="flex flex-col gap-3.5 lg:gap-4">
              {chatpati.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start h-full min-w-0">
            <div>
              <div className="flex items-baseline justify-between pb-1.5">
                <h2 className="text-white font-extrabold text-xl lg:text-2xl tracking-wide">
                  মাসালা কর্ন{" "}
                  <span className="text-white/70 text-base font-normal tracking-wider">
                    | CORN
                  </span>
                </h2>
                <span className="text-[#e58a3d] text-[11px] font-bold tracking-widest uppercase">
                  SWEET & SPICY
                </span>
              </div>
              <div className="h-px bg-[#a85a2b]/40 w-full mb-3" />
            </div>

            <div className="flex flex-col gap-3.5 lg:gap-4">
              {corn.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

