# TCG Price Guide - Bot

The **TCG Reference Bot** is a web scraper and DynamoDB integration tool designed to track card data from various Trading Card Games (TCGs). The project scrapes card data from TCGPlayer price guide URLs, processes the data, and stores it both as local CSV and JSON files, while also adding it to an AWS DynamoDB database. This provides an easy reference system for TCG cards, including metadata such as rarity, set, price, and more.

The initial idea behind this project stemmed from the need to reference data for One Piece cards, but there wasn't a simple way to obtain this information. Thankfully, [TCGPlayer](https://www.tcgplayer.com), per their [robots.txt](https://www.tcgplayer.com/robots.txt), allows for the gathering of this data. The goal was to build an initial reference of cards, starting with basic card metadata like rarity and set, using the price guides on TCGPlayer as they were easy to scrape. While prices are collected now, I plan to expand on the price data in future iterations of the project.

## Getting Started

### Using Nix for Development

Once you have [Nix](https://nixos.org/) installed, you can set up your environment easily by following these steps:

1. Clone the repository:
1. Enter the Nix shell, which will install all the necessary dependencies, including Python, Selenium, and AWS CLI:

   ```bash
   nix-shell
   ```

   This will automatically create and activate a virtual environment (venv) and install the required Python packages specified in requirements.txt.

1. After entering the Nix shell, you can run any of the scripts in this project as if all dependencies were installed locally.

### Managing AWS Credentials

To use the AWS CLI and Boto3 within the Nix shell, ensure that your AWS credentials are properly configured. You can do this via:

- AWS CLI configuration (aws configure) within the shell.
- Setting up environment variables for AWS access.

### Adding More Price Guides

To add more TCG price guides for scraping, follow these steps:

1. Navigate to the data/price-guides.txt file.
1. Add the URLs for the new price guides you want to scrape. Each URL should be on its own line. Example:
   ```
   https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/romance-dawn
   https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/paramount-war
   ```
1. After updating the price-guides.txt file, run the scraper script to process the newly added URLs:
   ```bash
   chmod +x ./bot/scrapper.py
   ./bot/scrapper.py
   ```

The new card data will be scraped and added to the CSV and JSON files in the `data/` folder, and you can upload the data to DynamoDB if you wish (of course you need the correct credentials, but the idea is anyone can take these files and use them in there own database if they wish).

## Todo

This is still under development, so I need to add a few more urls, i'm testing wtih a few at the moment. To add:

- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/romance-dawn",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/paramount-war",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/pillars-of-strength",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/kingdoms-of-intrigue",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/awakening-of-the-new-era",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/wings-of-the-captain",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/500-years-in-the-future",
- "https://www.tcgplayer.com/categories/trading-and-collectible-card-games/one-piece-card-game/price-guides/two-legends"

also we should be able to scrape the guides for all the sets we want from the `sitemap`.

- https://www.tcgplayer.com/sitemap/index.xml

from here we could get all the _one piece_ ones for example.

- https://www.tcgplayer.com/sitemap/one-piece-card-game.0.xml
