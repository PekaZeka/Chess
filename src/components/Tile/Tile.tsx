import "./tile.css";

interface Props {
  image?: string;
  coordinates: number;
}

function Tile({ coordinates, image }: Props) {
  const className =
    coordinates % 2 === 0
      ? "Chessboard-tile black-tile"
      : "Chessboard-tile white-tile";
  return (
    <div className={className}>
      {image && (
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="chess_piece"
        />
      )}
    </div>
  );
}

Tile.defaultProps = {
  image: "",
};

export default Tile;
