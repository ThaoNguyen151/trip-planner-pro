import {Card, CardContent} from '@/components/ui/card';
import { ProgressChart } from './ProgressChart';

export function ProgressCard() {
    return(
    <div>
        <Card>
            <CardContent>
                <p className='text-foreground font-bold text-transform: uppercase'>Itinerary</p>
                <ProgressChart></ProgressChart>
            </CardContent>
        </Card>
    </div>
    )
}