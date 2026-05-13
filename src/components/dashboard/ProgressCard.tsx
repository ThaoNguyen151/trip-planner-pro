import {Card, CardContent} from '@/components/ui/card';
import { ProgressChart } from './ProgressChart';

export function ProgressCard() {
    return(
    <div className='max-w-full max-h-full'>
        <Card className='overflow-visible min-w-fit'>
            <CardContent>
                <div className='flex flex-row items-center justify-between min-w-fit w-full'>
                    <p className='text-foreground font-bold text-transform: uppercase'>Itinerary</p>
                    <div className='h-full'><ProgressChart></ProgressChart></div>
                </div>
            </CardContent>
        </Card>
    </div>
    )
}