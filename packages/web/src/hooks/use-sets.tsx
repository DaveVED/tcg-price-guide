import useSWR from "swr";

const API_BASE_URL = "http://localhost:5001/v1/sets";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export type SetCategories = "all" | "one-piece" | "pokemon";

export const useSets = (selectedCategory: SetCategories) => {
    const url = selectedCategory === "all" 
      ? API_BASE_URL 
      : `${API_BASE_URL}/${selectedCategory}`;
  
    const { data: sets, error: setsError, isLoading: setsLoading } = useSWR(url, fetcher);
  
    // Function to fetch a specific card by set and card number
    const fetchCardByNumber = async (game: SetCategories, setName: string, cardNumber: string) => {
      const fetchUrl = `${API_BASE_URL}/${game}/${setName}/number/${cardNumber}`;
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
      sets,
      setsError,
      setsLoading,
      fetchCardByNumber,
    };
  };
  