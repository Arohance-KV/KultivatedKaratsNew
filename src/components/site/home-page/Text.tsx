import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getProductPriceDetails } from '@/utils/CalculateTotal';

interface RadioCardProps {
  value: string;
  label: string;
  description?: string;
}

const RadioCard: React.FC<RadioCardProps> = ({ value, label, description }) => (
  <div className="flex items-center space-x-2">
    <RadioGroupItem value={value} id={value} className="peer appearance-none w-4 h-4 border border-primary rounded-full focus:ring-2 focus:ring-ring focus:ring-offset-2 checked:bg-primary checked:border-primary" />
    <Label htmlFor={value} className="peer-checked:font-semibold">
      {label}
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
    </Label>
  </div>
);



const ColoursStonePicker = () => {
  const [stoneType, setStoneType] = useState<string | undefined>("gem");
  useEffect(() => {
    const price = getProductPriceDetails({ gemStoneSolWeight: 3.7, gemStonePointerWeight: 0, isGemStoneProduct: true, isChainAdded: false, chainKarat: 14, isColouredDiamond: false, karat: 14, pointersWeight: 0.11 , solitareWeight: 0, multiDiaWeight: 0.1, netWeight: 3.3 });
    console.log(`subTotal: ${price?.subTotal}, total: ${price?.total}, grossWeight: ${price?.grossWeight}, goldRate: ${price?.goldRate}, solitareRate: ${price?.solitareRate}, multiDiaRate: ${price?.multiDiaRate}, pointersRate: ${price?.pointersRate}, diamondRate: ${price?.diamondRate}, makingCharges: ${price?.makingCharges}, pendantChainPrice: ${price?.pendantChainPrice}`)
  }, []);
  return (
    <div className="rounded-md border p-4 space-y-4 w-full max-w-sm">
      <h2 className="text-lg font-semibold">Colours Stone</h2>
      <RadioGroup defaultValue="gem" onValueChange={setStoneType}>
        <RadioCard value="gem" label="Gem Stone" />
        <RadioCard value="lab" label="Lab grown diamond" description="(VVS-VS-EF)" />
      </RadioGroup>
      {stoneType && (
        <p className="text-sm text-muted-foreground">
          Selected Stone Type: <span className="font-medium">{stoneType === "gem" ? "Gem Stone" : "Lab grown diamond (VVS-VS-EF)"}</span>
        </p>
      )}
    </div>
  );
};

export default ColoursStonePicker;