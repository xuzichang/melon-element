export default function(){
    if(PROD){
        const logo=`looooooooooooooogo`;
        const rainbowGradient=`
            background:linear-gradient(135deg,orange 60%,cyan);
            background-clip:text;
            color:transparent;
            font-size:16px;
            line-height:1,
            font-family:monospace;
            font-weight:600;
        `;
        console.log(`%c${logo}`,rainbowGradient);
    }else if(DEV){
        console.log("[MelonUI]:dev mode...")
    }
}