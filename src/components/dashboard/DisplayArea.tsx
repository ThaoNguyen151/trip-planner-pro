// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
// import { ProgressCard } from "./ProgressCard";

import { ProgressCard } from "./ProgressCard";

export function DisplayArea() {
    return (
        // <ResizablePanelGroup orientation="vertical" className=" w-screen min-h-screen">
        //     <ResizablePanel defaultSize={33} className="bg-amber-300">
        //         <ResizablePanelGroup orientation="horizontal" className="w-full h-full">
        //             <ResizablePanel defaultSize={33} className="bg-blue-300">
        //                 <ProgressCard></ProgressCard>
        //             </ResizablePanel>
        //             <ResizablePanel defaultSize={33} className="bg-blue-500">
        //                 {/* <ProgressCard></ProgressCard> */}
        //             </ResizablePanel><ResizablePanel defaultSize={30} className="bg-blue-300">
        //                 {/* <ProgressCard></ProgressCard> */}
        //             </ResizablePanel>
        //         </ResizablePanelGroup>
        //     </ResizablePanel>
        //     <ResizableHandle></ResizableHandle>
        //     <ResizablePanel defaultSize={70} className="bg-amber-700"></ResizablePanel>
        // </ResizablePanelGroup>
        <div className="">
            <div className="md:h-3/10  md:gap-[5%] flex flex-col min-[830px]:flex-row">
                <div className="md:w-3/10">
                    <ProgressCard></ProgressCard>
                </div>
                <div className="md:w-3/10">
                    <ProgressCard></ProgressCard>
                </div>
                <div className="md:w-3/10">
                    <ProgressCard></ProgressCard>
                </div>
            </div>
            <div className="md:h-7/10 bg-amber-800">
                <p>hello</p>
            </div>
        </div>
    )
}