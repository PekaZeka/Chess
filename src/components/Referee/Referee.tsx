/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useRef, useState } from "react";
import {
  initialBoardState,
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../../Constants";
import {
  getPossiblePawnMoves,
  getPossibleKnightMoves,
  getPossibleBishopMoves,
  getPossibleRookMoves,
  getPossibleQueenMoves,
  getPossibleKingMoves,
  bishopMove,
  kingMove,
  knightMove,
  pawnMove,
  queenMove,
  rookMove,
} from "../../referee/Rules";
import Chessboard from "../Chessboard/Chessboard";

export default function Referee() {
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const modalRef = useRef<HTMLDivElement>(null);

  function getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getPossiblePawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getPossibleKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getPossibleBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getPossibleRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return getPossibleQueenMoves(piece, boardState);
      case PieceType.KING:
        return getPossibleKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  function updatePossibleMoves() {
    setPieces((currentPieces) => {
      return currentPieces.map((p) => {
        p.possibleMoves = getValidMoves(p, currentPieces);
        return p;
      });
    });
  }

  useEffect(() => {
    updatePossibleMoves();
  }, []);

  function isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = pieces.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  function isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType
  ) {
    let validMove = false;
    switch (type) {
      case PieceType.PAWN:
        validMove = pawnMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KNIGHT:
        validMove = knightMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.BISHOP:
        validMove = bishopMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.ROOK:
        validMove = rookMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.QUEEN:
        validMove = queenMove(initialPosition, desiredPosition, team, pieces);
        break;
      case PieceType.KING:
        validMove = kingMove(initialPosition, desiredPosition, team, pieces);
        break;

      default:
        break;
    }

    return validMove;
  }

  function playMove(playedPiece: Piece, destination: Position): boolean {
    const validMove = isValidMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    const pawnDirection = playedPiece.team === TeamType.OUR ? 1 : -1;

    if (enPassantMove) {
      const updatedPieces = pieces.reduce((results, piece) => {
        if (samePosition(piece.position, playedPiece.position)) {
          piece.enPassant = false;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          results.push(piece);
        } else if (
          !samePosition(piece.position, {
            x: destination.x,
            y: destination.y - pawnDirection,
          })
        ) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else if (validMove) {
      // UPDATES THE PIECE POSITION
      // AND IF A PIECE IS ATTACKED, REMOVES IT
      const updatedPieces = pieces.reduce((results, piece) => {
        if (samePosition(piece.position, playedPiece.position)) {
          // SPECIAL MOVE
          piece.enPassant =
            Math.abs(playedPiece.position.y - destination.y) === 2 &&
            piece.type === PieceType.PAWN;

          piece.position.x = destination.x;
          piece.position.y = destination.y;

          const promotionRow = piece.team === TeamType.OUR ? 7 : 0;

          if (destination.y === promotionRow && piece.type === PieceType.PAWN) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn(piece);
          }
          results.push(piece);
        } else if (
          !samePosition(piece.position, { x: destination.x, y: destination.y })
        ) {
          if (piece.type === PieceType.PAWN) {
            piece.enPassant = false;
          }
          results.push(piece);
        }

        return results;
      }, [] as Piece[]);

      updatePossibleMoves();
      setPieces(updatedPieces);
    } else {
      return false;
    }
    return true;
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === undefined) {
      return;
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if (samePosition(piece.position, promotionPawn.position)) {
        piece.type = pieceType;
        const teamType = piece.team === TeamType.OUR ? "white" : "black";
        piece.image = `assets/images/${teamType}_${PieceType[
          pieceType
        ].toLowerCase()}.png`;
      }
      results.push(piece);
      return results;
    }, [] as Piece[]);
    updatePossibleMoves();
    setPieces(updatedPieces);
    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.OUR ? "white" : "black";
  }

  return (
    <>
      <div className="modal-overlay hidden" ref={modalRef}>
        <div className="modal-body">
          <img
            onClick={() => promotePawn(PieceType.ROOK)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_rook.png`}
            alt="rook"
          />
          <img
            onClick={() => promotePawn(PieceType.BISHOP)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_bishop.png`}
            alt="bishop"
          />
          <img
            onClick={() => promotePawn(PieceType.KNIGHT)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_knight.png`}
            alt="knight"
          />
          <img
            onClick={() => promotePawn(PieceType.QUEEN)}
            className="promotion-piece"
            src={`/assets/images/${promotionTeamType()}_queen.png`}
            alt="queen"
          />
        </div>
      </div>
      <Chessboard playMove={playMove} pieces={pieces} />
    </>
  );
}
