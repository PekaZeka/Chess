/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  ReactElement,
  MouseEvent,
} from "react";
import Tile from "../Tile/Tile";
import { GRID_SIZE, Piece, Position, samePosition } from "../../Constants";
import "./chessboard.css";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

function Chessboard({ playMove, pieces }: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const chessboardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess_piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.floor(
        (800 - (e.clientY - chessboard.offsetTop)) / GRID_SIZE
      );
      setGrabPosition({
        x: grabX,
        y: grabY,
      });
      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      setActivePiece(element);
    }
  }

  function movePiece(e: MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }
      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e: MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.floor(
        (800 - (e.clientY - chessboard.offsetTop)) / GRID_SIZE
      );
      const currentPiece = pieces.find((p) =>
        samePosition(p.position, grabPosition)
      );
      if (currentPiece) {
        const success = playMove(currentPiece, { x, y });

        if (!success) {
          // RESET THE PIECE POSITION
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  const [board, setBoard] = useState<ReactElement[]>([]);
  const verticalAxis: string[] = useMemo(
    () => ["1", "2", "3", "4", "5", "6", "7", "8"],
    []
  );
  const horizontalAxis: string[] = useMemo(
    () => ["a", "b", "c", "d", "e", "f", "g", "h"],
    []
  );

  useEffect(() => {
    const newBoard = [];
    for (let j = verticalAxis.length - 1; j >= 0; j -= 1) {
      for (let i = 0; i < horizontalAxis.length; i += 1) {
        const coordinates = i + j + 2;
        const piece = pieces.find((p) =>
          samePosition(p.position, { x: i, y: j })
        );
        const image = piece ? piece.image : undefined;
        const currentPiece =
          activePiece != null
            ? pieces.find((p) => samePosition(p.position, grabPosition))
            : undefined;
        const highlight = currentPiece?.possibleMoves
          ? currentPiece.possibleMoves.some((p) =>
              samePosition(p, { x: i, y: j })
            )
          : false;

        newBoard.push(
          <Tile
            key={`${i},${j}`}
            image={image}
            coordinates={coordinates}
            highlight={highlight}
          />
        );
      }
    }
    setBoard(newBoard);
  }, [horizontalAxis, verticalAxis, pieces, grabPosition, activePiece]);
  const verticalAxisItems = verticalAxis.map((item) => (
    <div className="axis_items" key={item}>
      {item}
    </div>
  ));
  const horizontalAxisItems = horizontalAxis.map((item) => (
    <div className="axis_items" key={item}>
      {item}
    </div>
  ));

  return (
    <div className="Chessboard">
      <div className="vertical">{verticalAxisItems}</div>
      <div>
        <div
          className="board"
          onMouseDown={(e) => grabPiece(e)}
          onMouseMove={(e) => movePiece(e)}
          onMouseUp={(e) => dropPiece(e)}
          ref={chessboardRef}
        >
          {board}
        </div>
        <div className="horizontal">{horizontalAxisItems}</div>
      </div>
    </div>
  );
}

export default Chessboard;
