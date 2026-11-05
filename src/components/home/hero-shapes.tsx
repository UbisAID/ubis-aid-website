import { Photo } from "@/components/sections/photo";

const PHOTOS = [
  { query: "young friends talking on stairs", orientation: "portrait" as const, pick: 2 },
  { query: "teenager smiling outdoors portrait", orientation: "portrait" as const, pick: 0 },
];

/**
 * Hero composition: photos cropped to half-circles that pair with solid brand
 * half-circles, forming two offset "split suns". Decorative layout around two
 * real photos.
 */
export async function HeroShapes({
  alts,
  tonight,
}: {
  alts: [string, string];
  tonight: string;
}) {
  const half = "aspect-[1/2] w-full";
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {/* Row 1: photo (left half) + coral (right half) */}
        <Photo
          {...PHOTOS[0]}
          alt={alts[0]}
          tint="peach"
          priority
          sizes="(min-width: 1024px) 180px, 33vw"
          className={`${half} rounded-l-full rounded-r-none`}
          imageClassName="object-[60%_center]"
          credit={false}
        />
        <div aria-hidden="true" className={`${half} rounded-l-none rounded-r-full bg-primary`} />
        <div aria-hidden="true" className="relative flex items-start justify-center pt-6">
          <div className="grid aspect-square w-[80%] place-items-center rounded-full bg-sage p-3 text-center">
            <span className="font-heading text-[0.7rem] leading-tight font-bold text-secondary sm:text-base">
              {tonight}
            </span>
          </div>
        </div>

        {/* Row 2, offset: butter (left half) + photo (right half) */}
        <div className="relative -mt-[38%]" />
        <div aria-hidden="true" className={`${half} -mt-[38%] rounded-l-full rounded-r-none bg-butter`} />
        <Photo
          {...PHOTOS[1]}
          alt={alts[1]}
          tint="butter"
          sizes="(min-width: 1024px) 180px, 33vw"
          className={`${half} -mt-[38%] rounded-l-none rounded-r-full`}
          imageClassName="object-[40%_center]"
          credit={false}
        />
      </div>


    </div>
  );
}
