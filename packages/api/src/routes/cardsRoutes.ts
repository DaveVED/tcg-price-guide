import { Router } from "express";
import {
  cards,
  cardsByCardNumber,
  cardsByGame,
  cardsByCardNumberAndCardName,
} from "../controllers/cardsController";

const router: Router = Router();

const cardsPath = "/v1/cards";

/** Add base route and games route for all cards etc. */
router.get(`${cardsPath}/search`, cards);
router.get(`${cardsPath}/:game/number/:cardNumber`, cardsByCardNumber);
router.get(
  `${cardsPath}/:game/number/:cardNumber/search`,
  cardsByCardNumberAndCardName,
);

router.get(`${cardsPath}/:game/search`, cardsByGame);

export default router;
