import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface ActionMenuProps {
  // onEdit?: () => void;
  // onDelete?: () => void;
  children?: ReactNode;
}

export function ActionMenu({ children }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
          <MoreVertical className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {children}

        <DropdownMenuItem>
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 transition-colors">
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
