import {Calendar} from 'lucide-react';

export function DashboardHeader() {
    return(<div>
        <h1 className="text-foreground text-3xl font-semibold">Da Nang Family Trip</h1>
        <div className='flex flex-row space-x-1.5 items-center pt-0.5'>
            <Calendar className='w-3 h-3' />
            <p className='text-muted-foreground font-bold'>Aug 15 - Aug 22, 2024</p>
        </div>
    </div>);
}