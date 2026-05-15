import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

export default function BudgetPreviewCard() {
    return (
    <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Budget Usage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-1">
          <div className='flex flex-row justify-between'>
            <p className="text-4xl font-bold">$4200</p>
          </div >
 
          <div>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden mb-5 mt-1">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `35%` }}
              />
            </div>
          </div>
 
          <div className="flex justify-between items-center">
            <Card className='bg-primary w-[50%]'>
                <CardContent>
                    <p className="text-sm font-semibold text-primary-foreground">$7800</p>
                    <p className="text-xs text-primary-foreground uppercase tracking-wide">Remaining</p>
                </CardContent>
            </Card>
            <div>
              <p className="text-sm font-semibold">$12000</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>)
}