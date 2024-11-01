import { Request, Response } from "express";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../clients/awsClients";

const TABLE_NAME = "production-TCGPriceGuide-ReferenceData";

function normalizeString(input: string): string {
  return input.replace(/[\W_]+/g, " ").trim().toLowerCase();
}

const gameNameMap: Record<string, string> = {
  "one-piece": "OnePiece",
  "pokemon": "Pokemon",
};

const getGameName = (game: string): string | null => gameNameMap[game] || null;

export const cards = async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/vnd.api+json");
  
    try {
      const { query } = req.query;
      console.log(`QUERY IS: ${query}`);
  
      let params: any = {
        TableName: TABLE_NAME,
      };
  
      if (query) {
        const normalizedQuery = normalizeString(query as string);
        params.FilterExpression = "contains(NormalizedCardName, :query)";
        params.ExpressionAttributeValues = {
          ":query": normalizedQuery,
        };
      }
  
      const command = new ScanCommand(params);
      const response = await docClient.send(command);
  
      if (response.Items && response.Items.length > 0) {
        res.status(200).json({
          data: response.Items,
        });
      } else {
        res.status(404).json({ message: "Cards not found." });
      }
    } catch (error) {
      console.error("Error retrieving cards:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };

export const cardsByGame = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/vnd.api+json");

  try {
    const { game } = req.params;
    const { query } = req.query;
    console.log(`QUERY IS: ${query}`);

    const gameName = getGameName(game);
    if (!gameName) {
      return res.status(400).json({ message: "Invalid game specified." });
    }

    let params: any = {
      TableName: TABLE_NAME,
      IndexName: "gameNameAsPrimaryKey",
      KeyConditionExpression: "Game = :game",
      ExpressionAttributeValues: {
        ":game": gameName,
      },
    };

    if (query) {
      const normalizedQuery = normalizeString(query as string);
      params.FilterExpression = "contains(NormalizedCardName, :query)";
      params.ExpressionAttributeValues[":query"] = normalizedQuery;
    }

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    if (response.Items && response.Items.length > 0) {
      res.status(200).json({
        data: response.Items,
      });
    } else {
      res.status(404).json({ message: "Cards not found." });
    }
  } catch (error) {
    console.error("Error retrieving card:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const cardsByCardNumber = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/vnd.api+json");

  try {
    const { game, cardNumber } = req.params;
    const gameName = getGameName(game);
    if (!gameName) {
      return res.status(400).json({ message: "Invalid game specified." });
    }

    const skPrefix = `CARD#${cardNumber}#`;

    const params = {
      TableName: TABLE_NAME,
      IndexName: "gameNameAndSortKeyIndex",
      KeyConditionExpression: "Game = :game AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":game": gameName,
        ":skPrefix": skPrefix,
      },
    };

    const command = new QueryCommand(params);
    const response = await docClient.send(command);

    if (response.Items && response.Items.length > 0) {
      res.status(200).json({
        data: response.Items,
      });
    } else {
      res.status(404).json({ message: "Set cards not found." });
    }
  } catch (error) {
    console.error("Error retrieving card:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const cardsByCardNumberAndCardName = async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/vnd.api+json");
  
    try {
      const { game, cardNumber } = req.params;
      const { query } = req.query;
      console.log(`QUERY IS: ${query}`);
      const gameName = getGameName(game);
      if (!gameName) {
        return res.status(400).json({ message: "Invalid game specified." });
      }
  
      const skPrefix = `CARD#${cardNumber}#`;
  
      const params: any = {
        TableName: TABLE_NAME,
        IndexName: "gameNameAndSortKeyIndex",
        KeyConditionExpression: "Game = :game AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":game": gameName,
          ":skPrefix": skPrefix,
        },
      };
      

  if (query) {
    const normalizedQuery = normalizeString(query as string);
    params.FilterExpression = "contains(NormalizedCardName, :query)";
    params.ExpressionAttributeValues![":query"] = normalizedQuery;
  }
  
      const command = new QueryCommand(params);
      const response = await docClient.send(command);
  
      if (response.Items && response.Items.length > 0) {
        res.status(200).json({
          data: response.Items,
        });
      } else {
        res.status(404).json({ message: "Set cards not found." });
      }
    } catch (error) {
      console.error("Error retrieving card:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
