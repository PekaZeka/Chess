import "./tile.css";

interface Props {
  coordinates: number;
}

function Tile({ coordinates }: Props) {
  if (coordinates % 2 === 0) {
    return <div className="Chessboard-tile black-tile" />;
  }
  return <div className="Chessboard-tile white-tile" />;
}

export default Tile;
