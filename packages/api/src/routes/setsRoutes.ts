import { Router } from "express";
import {
  cardsBySetAndCardNumber,
  cardsBySetName,
  sets,
  setsByGame,
} from "../controllers/setsController";

const router: Router = Router();

const setsPath = "/v1/sets";

router.get(setsPath, sets);
router.get(`${setsPath}/:game`, setsByGame);
router.get(`${setsPath}/:game/:setName/cards`, cardsBySetName);
router.get(`${setsPath}/:game/:setName/cards/number/:cardNumber`, cardsBySetAndCardNumber);

export default router;
