import songGameHero from "../assets/party-song-hero-v2.png";
import { cn } from "../utils/designTokens";

export default function SongGameArtwork({
  className,
  labelled = false,
}: {
  className?: string;
  labelled?: boolean;
}) {
  return (
    <div
      className={cn("song-game-art relative overflow-hidden", className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? "Slúchadlá a mikrofón v hudobnom štúdiu" : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      <img
        src={songGameHero}
        alt=""
        className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-[center_42%]"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(240,171,252,.18),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090611]/90 via-transparent to-[#120824]/15" />
      <div className="song-game-art-shine absolute inset-0" />
    </div>
  );
}
