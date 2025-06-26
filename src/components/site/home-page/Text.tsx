import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Counter } from "./custom-components/Counter"

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Test = () => {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="inria-serif-regular bg-red-300 h-8 w-8 p-0">
        <span className="sr-only inria-serif-regular">Open menu</span>
        <MoreHorizontal />
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="inria-serif-regular z-50 bg-red-600">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
        // onClick={() => navigator.clipboard.writeText(payment.id)}
        >
        Copy payment ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View customer</DropdownMenuItem>
        <DropdownMenuItem>View payment details</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
  );
};