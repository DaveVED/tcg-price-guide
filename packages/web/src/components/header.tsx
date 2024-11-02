import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  return (
    <header className="border-b font-sans">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="text-purple-600">TCG</span>
          <span className="text-slate-700 dark:text-slate-300 ml-2">
            Price Guide
          </span>
          <span className="ml-2 text-[0.65rem] bg-purple-600 px-1.5 py-[0.15rem] rounded-md text-white uppercase tracking-wide self-center leading-tight">
            Beta
          </span>
        </h1>
        <ModeToggle />
      </div>
    </header>
  );
};
