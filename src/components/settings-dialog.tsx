
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";

interface SettingsDialogProps {
  slippage: number;
  onSlippageChange: (newSlippage: number) => void;
}

export function SettingsDialog({ slippage, onSlippageChange }: SettingsDialogProps) {
  const [tempSlippage, setTempSlippage] = useState(slippage.toString());
  
  const handleSlippageChange = (value: string) => {
    setTempSlippage(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 100) {
      onSlippageChange(numValue);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-secondary">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Slippage Tolerance (%)</label>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <Button
                  key={value}
                  variant={slippage === value ? "default" : "outline"}
                  onClick={() => handleSlippageChange(value.toString())}
                  className="flex-1"
                >
                  {value}%
                </Button>
              ))}
              <Input
                type="number"
                value={tempSlippage}
                onChange={(e) => handleSlippageChange(e.target.value)}
                className="w-24"
                min="0.01"
                max="100"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
