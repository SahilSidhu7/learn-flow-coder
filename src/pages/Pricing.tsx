import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pricingOptions = [
  {
    credits: 3,
    price: 399,
    features: [
      "3 CHO credits",
      "Valid for all coding challenges",
      "Instant access after purchase",
    ],
    button: "Buy 3 Credits",
  },
  {
    credits: 12,
    price: 999,
    features: [
      "12 CHO credits",
      "Best value for frequent learners",
      "Instant access after purchase",
    ],
    button: "Buy 12 Credits",
  },
];

const Pricing = () => (
  <div className="container mx-auto px-4 py-16 flex flex-col items-center min-h-[80vh]">
    <Card className="max-w-2xl w-full mb-10 text-center">
      <CardHeader>
        <CardTitle className="text-3xl">Pricing</CardTitle>
        <CardDescription className="text-lg mt-2">
          Unlock more CHO credits to keep learning and solving coding
          challenges!
        </CardDescription>
      </CardHeader>
    </Card>
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full">
      {pricingOptions.map((option) => (
        <Card
          key={option.credits}
          className="w-full max-w-xs flex flex-col items-center p-6 shadow-lg"
        >
          <CardHeader className="w-full text-center">
            <CardTitle className="text-2xl mb-2">
              {option.credits} Credits
            </CardTitle>
            <div className="text-3xl font-bold mb-2">₹{option.price}</div>
          </CardHeader>
          <CardContent className="flex-1 w-full flex flex-col items-center">
            <ul className="mb-6 text-muted-foreground text-left list-disc list-inside">
              {option.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <Button className="w-full mt-auto">{option.button}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Pricing;
