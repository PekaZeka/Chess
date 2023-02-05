export const GRID_SIZE = 100;

export interface Position {
  x: number;
  y: number;
}
export enum PieceType {
  ROOK,
  BISHOP,
  KNIGHT,
  QUEEN,
  KING,
  PAWN,
}
export enum TeamType {
  OUR,
  OPPONENT,
}
export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
  enPassant?: boolean;
}

export const initialBoardState: Piece[] = [
  {
    image: `assets/images/white_rook.png`,
    position: { x: 0, y: 0 },
    type: PieceType.ROOK,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_knight.png`,
    position: { x: 1, y: 0 },
    type: PieceType.KNIGHT,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_bishop.png`,
    position: { x: 2, y: 0 },
    type: PieceType.BISHOP,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_queen.png`,
    position: { x: 3, y: 0 },
    type: PieceType.QUEEN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_king.png`,
    position: { x: 4, y: 0 },
    type: PieceType.KING,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_bishop.png`,
    position: { x: 5, y: 0 },
    type: PieceType.BISHOP,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_knight.png`,
    position: { x: 6, y: 0 },
    type: PieceType.KNIGHT,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_rook.png`,
    position: { x: 7, y: 0 },
    type: PieceType.ROOK,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 0, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 1, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 2, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 3, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 4, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 5, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 6, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/white_pawn.png`,
    position: { x: 7, y: 1 },
    type: PieceType.PAWN,
    team: TeamType.OUR,
  },
  {
    image: `assets/images/black_rook.png`,
    position: { x: 0, y: 7 },
    type: PieceType.ROOK,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_knight.png`,
    position: { x: 1, y: 7 },
    type: PieceType.KNIGHT,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_bishop.png`,
    position: { x: 2, y: 7 },
    type: PieceType.BISHOP,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_queen.png`,
    position: { x: 3, y: 7 },
    type: PieceType.QUEEN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_king.png`,
    position: { x: 4, y: 7 },
    type: PieceType.KING,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_bishop.png`,
    position: { x: 5, y: 7 },
    type: PieceType.BISHOP,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_knight.png`,
    position: { x: 6, y: 7 },
    type: PieceType.KNIGHT,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_rook.png`,
    position: { x: 7, y: 7 },
    type: PieceType.ROOK,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 0, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 1, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 2, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 3, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 4, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 5, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 6, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
  {
    image: `assets/images/black_pawn.png`,
    position: { x: 7, y: 6 },
    type: PieceType.PAWN,
    team: TeamType.OPPONENT,
  },
];
