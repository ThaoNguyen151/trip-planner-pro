import {Card, CardContent} from '@/components/ui/card';
import { ProgressChart } from './ProgressChart';

export function ProgressCard() {
    return(
    <div>
        <Card>
            <CardContent>
                <div className='flex flex-row items-center justify-between'>
                    <p className='text-foreground font-bold text-transform: uppercase'>Itinerary</p>
                    <div className='w-30 h-30'><ProgressChart></ProgressChart></div>
                </div>
            </CardContent>
        </Card>
    </div>
    )
}