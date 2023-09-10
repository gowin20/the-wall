import defaultLayout from "./defaultLayout.mjs";
import userLayout from "./layout/userLayout.mjs";


const makeUserLayout = async (options) => {
    const layout = userLayout();
    layout.init(options,()=>{
        console.log('Callback!');
    })
}

const makeDefaultLayout = async (options) => {
    defaultLayout().init(options, ()=> {
        console.log('YEAH WOOHOO!')
    })
}

/*

makeUserLayout({
    username:'64f3db0f831d677c80b1726f',
    saveFiles:true,
    generate:true
})
*/
makeDefaultLayout({
    saveFiles:true,
    name:'stitched-1015-3',
    generate:true
});

/*


Armin Taheri: 64f3db0f831d677c80b17259
George Owen: 64f3db0f831d677c80b1725f
Oliver Melgrove: 64f3db0f831d677c80b1726e
Shreya Chatterjee: 64f3db0f831d677c80b1726f

*/