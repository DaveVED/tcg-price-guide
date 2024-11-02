import { Header } from "@/components/header";
import { SearchForm } from "@/components/search-form";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SearchForm />
      </main>
    </div>
  );
}

export default App;
