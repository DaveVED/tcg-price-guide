const API_BASE_URL = "https://api.tcg-price-guide.com/v1/cards";
//const API_BASE_URL = "http://localhost:5001/v1/cards";

export type SetCategories = "all" | "one-piece" | "pokemon";

export const useCards = () => {
  // Function to fetch a specific card by set and card number
  const fetchCardsByCardNumber = async (
    game: SetCategories,
    cardNumber: string,
  ) => {
    const fetchUrl = `${API_BASE_URL}/${encodeURIComponent(game)}/number/${encodeURIComponent(cardNumber)}`;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Failed to fetch card data.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching card by number:", error);
      throw error;
    }
  };

  // Function to fetch cards by game and query
  const fetchCardsByGame = async (game: SetCategories, query?: string) => {
    const fetchUrl = query
      ? `${API_BASE_URL}/${encodeURIComponent(game)}/search?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/${encodeURIComponent(game)}`;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Failed to fetch card data.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching cards by game:", error);
      throw error;
    }
  };

  // Function to fetch cards by a generic search query
  const fetchCards = async (query?: string) => {
    const fetchUrl = query
      ? `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/search`;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Failed to fetch card data.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching cards by search:", error);
      throw error;
    }
  };

  const fetchCardsByNumberAndQuery = async (
    game: SetCategories,
    cardNumber: string,
    query: string,
  ) => {
    const fetchUrl = `${API_BASE_URL}/${encodeURIComponent(game)}/number/${encodeURIComponent(cardNumber)}/search?query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error("Failed to fetch card data.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching card by number:", error);
      throw error;
    }
  };
  return {
    fetchCardsByCardNumber,
    fetchCardsByGame,
    fetchCards,
    fetchCardsByNumberAndQuery,
  };
};
