import "./tile.css";

interface Props {
  image?: string;
  coordinates: number;
}

function Tile({ coordinates, image }: Props) {
  if (coordinates % 2 === 0) {
    return (
      <div className="Chessboard-tile black-tile">
        <img src={image} alt="piece" />
      </div>
    );
  }
  return (
    <div className="Chessboard-tile white-tile">
      <img src={image} alt="piece" />
    </div>
  );
}

Tile.defaultProps = {
  image: "",
};

export default Tile;
