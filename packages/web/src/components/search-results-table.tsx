import React, { useState } from "react"
import { useSearchForm } from "./search-form"
import { Table, TableHeader, TableRow, TableCell, TableBody, TableHead } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"


export const SearchResultsTable: React.FC = () => {
  const { searchData } = useSearchForm()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!searchData || !searchData.data || searchData.data.length === 0) {
    return <div>No results found.</div>
  }

  return (
    <>
      <Table className="w-full mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Card Name</TableHead>
            <TableHead>Rarity</TableHead>
            <TableHead>Card Number</TableHead>
            <TableHead>Market Price</TableHead>
            <TableHead>Set Name</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>TCG Player</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searchData.data.map((card: any) => (
            <TableRow key={card.SK}>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src={`https://cdn.tcg-price-guide.com/${card.S3Key}`}
                      alt={`${card.CardName} image`}
                      className="w-10 h-15 object-cover cursor-pointer"
                      onClick={() => setSelectedImage(`https://cdn.tcg-price-guide.com/${card.S3Key}`)}
                    />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <div className="mt-4">
                      <img
                        src={selectedImage || "/placeholder.svg?height=300&width=200"}
                        alt={`${card.CardName} full image`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>{card.CardName}</TableCell>
              <TableCell>{card.Rarity}</TableCell>
              <TableCell>{card.SK.split("#")[1]}</TableCell>
              <TableCell>${parseFloat(card.Price).toFixed(2)}</TableCell>
              <TableCell>{card.SetName}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {card.AlternateArt && <Badge variant="secondary">Alt Art</Badge>}
                  {card.Manga && <Badge variant="secondary">Manga</Badge>}
                  {card.Parallel && <Badge variant="secondary">Parallel</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={`https://www.tcgplayer.com/product/${card.CardName.replace(/\s+/g, '-').toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    TCG Player <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}