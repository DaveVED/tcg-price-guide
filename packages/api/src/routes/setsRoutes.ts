import { Router } from "express";
import {
  cardsBySetAndCardNumber,
  cardsBySetName,
  sets,
  setsByGame,
  cardsBySetNameAndCardNumberAndCardName,
  cardsBySetNameAndCardName,
} from "../controllers/setsController";

const router: Router = Router();

const setsPath = "/v1/sets";

router.get(setsPath, sets);
router.get(`${setsPath}/:game`, setsByGame);
router.get(`${setsPath}/:game/:setName/cards`, cardsBySetName);
router.get(
  `${setsPath}/:game/:setName/cards/search`,
  cardsBySetNameAndCardName,
);
router.get(
  `${setsPath}/:game/:setName/cards/number/:cardNumber`,
  cardsBySetAndCardNumber,
);
router.get(
  `${setsPath}/:game/:setName/cards/number/:cardNumber/search`,
  cardsBySetNameAndCardNumberAndCardName,
);
export default router;
