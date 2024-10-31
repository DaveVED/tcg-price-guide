import { ModeToggle } from "./mode-toggle";

export function Header() {
    return (
        <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="bg-gradient-to-r from-purple-400 to-pink-300 text-transparent bg-clip-text">
            TCG Price Guide
          </span>
          <span className="ml-2 text-xs bg-purple-700 px-2 py-1 rounded-full text-purple-200 uppercase tracking-wide">
            Beta
          </span>
        </h1>          <ModeToggle />
        </div>
      </header>
    );
}