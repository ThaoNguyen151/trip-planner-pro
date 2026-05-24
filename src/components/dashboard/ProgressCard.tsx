import {Card, CardContent} from '@/components/ui/card';
import { ProgressChart } from './ProgressChart';

type ChartCardProps = {
    name: string,
    past: number,
    total: number
}

export function ProgressCard(props: ChartCardProps) {
    return(
    <div className='max-w-full max-h-full'>
        <Card className='overflow-visible min-w-fit'>
            <CardContent>
                <div className='flex flex-row items-center justify-between min-w-fit'>
                    {props.total > 0 
                    ? <p className='text-foreground font-bold text-transform: uppercase'>{props.name}</p> : <p className='text-foreground italic'>No {props.name} yet</p>}
                    
                    {props.total > 0 && <div className='h-full'><ProgressChart pastC={props.past} totalC={props.total}></ProgressChart></div>}
                    
                </div>
            </CardContent>
        </Card>
    </div>
    )
}