import { Input } from "./ui/input";
import { useSearchForm } from "./search-form";

export const SearchFormCardNumber = () => {
  const { cardNumber, setCardNumber } = useSearchForm();

  return (
    <div className="w-full md:w-1/2">
      <Input
        type="text"
        id="cardNumber"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Enter card number"
        className="w-full"
      />
    </div>
  );
};
