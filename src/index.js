import JSZip from 'jszip';
import BonOS from './BonOS.folder'
import lagoonBoot from './lagoon-boot.folder'
let button = document.createElement("button")
button.textContent = "Install BonOS"
document.body.appendChild(button)
button.addEventListener("click", async()=>{
let rootDir = await window.showDirectoryPicker()
function basename(path) {
    let e = path.split("/")
    if(e[e.length-1]==""){
        return e[e.length-2]
    }
    return e[e.length-1]
}

function InstallZip(zip, dirName){
var new_zip = new JSZip();
// more files !
new_zip.loadAsync(zip)
.then(async function(zip) {
    console.log(zip.files)
    let root = await rootDir.getDirectoryHandle(dirName, { create: true });
    // async function InstallDir(dir, handle){
    //     Object.keys(dir).forEach(async path=>{
    //     let f = dir[path]
    //     let fname = basename(f.name)
    //     console.log(fname, f.name)
    //     if(f.dir==true){
    //         let folder = await handle.getDirectoryHandle(fname, { create: true });
    //         InstallDir(dir.files, folder)
    //     }else{
    //         let data = await dir.file(f.name).async("arraybuffer")
    //         const fileHandle = await handle.getFileHandle(fname, { create: true });
    //         const writable = await fileHandle.createWritable();
    //         await writable.write(data);
    //         await writable.close();
    //     }
    // })
    // }
    // await InstallDir(zip, root)
    for(let path of Object.keys(zip.files)){
        let e = path.split("/").filter(e=>e!="")
        let handle = root
        while(e.length>=2){
            handle = await handle.getDirectoryHandle(e[0])
            e.splice(0,1)
        }
        console.log(handle)
        if(zip.files[path].dir==true){
            let folder = await handle.getDirectoryHandle(basename(path), { create: true });
        }else{
            let data = await zip.file(path).async("arraybuffer")

            const fileHandle = await handle.getFileHandle(basename(path), { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(data);
            await writable.close();
        }
    }
    alert("Installed "+dirName+"!")

});

}
InstallZip(BonOS, "BonOS")
InstallZip(lagoonBoot, "lagoon-boot")
})
