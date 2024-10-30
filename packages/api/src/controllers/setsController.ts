import { Request, Response } from "express";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../clients/awsClients";

const TABLE_NAME = "development-TCGPriceGuide-ReferenceData";
const CONTENT_TYPE_HEADER = { "Content-Type": "application/vnd.api+json" };

const gameNameMap: Record<string, string> = {
  "one-piece": "OnePiece",
  "pokemon": "Pokemon",
};

// Helper function to validate game and retrieve gameName
const getGameName = (game: string): string | null => gameNameMap[game] || null;

/**
 * Returns *all* sets
 */
export const sets = async (req: Request, res: Response) => {
  res.set(CONTENT_TYPE_HEADER);

  try {
    const params = {
      TableName: TABLE_NAME,
      IndexName: "sorkKeyAsPrimaryKey",
      KeyConditionExpression: "SK = :skValue",
      ExpressionAttributeValues: {
        ":skValue": "SET",
      },
    };

    const response = await docClient.send(new QueryCommand(params));

    if (response.Items?.length) {
      res.status(200).json({ data: response.Items });
    } else {
      res.status(404).json({ message: "No sets found." });
    }
  } catch (error) {
    console.error("Error retrieving sets:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

/**
 * Returns *all* sets for a specified game
 */
export const setsByGame = async (req: Request, res: Response) => {
  res.set(CONTENT_TYPE_HEADER);

  const { game } = req.params;
  const gameName = getGameName(game);
  if (!gameName) {
    return res.status(400).json({ message: "Invalid game specified." });
  }

  const params = {
    TableName: TABLE_NAME,
    IndexName: "sortKeyAndSetIdIndex",
    KeyConditionExpression: "SK = :skValue AND begins_with(SetID, :pkPrefix)",
    ExpressionAttributeValues: {
      ":skValue": "SET",
      ":pkPrefix": `${gameName}#`,
    },
  };

  try {
    const response = await docClient.send(new QueryCommand(params));

    if (response.Items?.length) {
      res.status(200).json({ data: response.Items });
    } else {
      res.status(404).json({ message: "No sets found for the specified game." });
    }
  } catch (error) {
    console.error("Error retrieving sets by game:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

function formatSetName(input: string): string {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Returns cards by set and card number
 */
export const cardsBySetAndCardNumber = async (req: Request, res: Response) => {
  res.set(CONTENT_TYPE_HEADER);

  const { game, setName, cardNumber } = req.params;

  // Validate and format game name
  const gameName = getGameName(game);
  if (!gameName) {
    return res.status(400).json({ message: "Invalid game specified." });
  }

  const formattedSetName = formatSetName(setName);
  console.log(formattedSetName)
  const skPrefix = `CARD#${cardNumber.toUpperCase()}`;

  const params = {
    TableName: TABLE_NAME,
    IndexName: "setNameAndSortKeyIndex",
    KeyConditionExpression: "SetName = :setName AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":setName": formattedSetName,
      ":skPrefix": skPrefix,
    },
  };

  try {
    const response = await docClient.send(new QueryCommand(params));

    if (response.Items && response.Items.length > 0) {
      res.status(200).json({
        data: response.Items,
      });
    } else {
      res.status(404).json({ message: "Cards not found for the specified set and card number." });
    }
  } catch (error) {
    console.error("Error retrieving cards by set and card number:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};