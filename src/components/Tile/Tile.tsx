import "./tile.css";

interface Props {
  image?: string;
  coordinates: number;
  highlight: boolean;
}

function Tile({ coordinates, image, highlight }: Props) {
  const className: string = [
    "chessboard-tile",
    coordinates % 2 === 0 ? "black-tile" : "white-tile",
    highlight && "higlight-tile",
    image && "chess-piece_tile",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={className}>
      {image && (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="chess-piece"
        />
      )}
    </div>
  );
}

Tile.defaultProps = {
  image: "",
};

export default Tile;
