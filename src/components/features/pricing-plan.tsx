'use client';

import { CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { PricingPlan as PricingPlanType } from '@/lib/types';
import Image from 'next/image';

interface PricingPlanProps {
  plan: PricingPlanType;
  onSelect: (plan: PricingPlanType) => void;
  isCurrentPlan?: boolean;
}

export function PricingPlan({
  plan,
  onSelect,
  isCurrentPlan = false,
}: PricingPlanProps) {
  let { name, price, features, buttonText, popular, img } = plan;
  if(plan.id === 'free' && !isCurrentPlan){
    buttonText = 'Downgrade to Free'
  }

  return (
    <Card className={`w-full max-w-sm mx-auto flex flex-col h-full ${popular ? 'border-primary shadow-md' : ''}`}>
      {popular && (
        <div className="rounded-t-lg bg-primary py-1 text-xs text-center font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader>
      <div className='rounded-xl flex fitems-center items-center'>
        <CardTitle>{name}</CardTitle>
          <Image
          className="rounded-xl"
          src={img}
          alt="Pro Logo"
          width={40}
          height={40}
          />
      </div>
        <CardDescription>
          <span className="text-2xl font-bold">{price}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <span className="rounded-full bg-primary/10 p-1 text-primary">
                <CheckIcon className="h-4 w-4" />
              </span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? 'outline' : popular ? 'default' : 'outline'}
          onClick={() => onSelect(plan)}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? 'Current Plan' : buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
