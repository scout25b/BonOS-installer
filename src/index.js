import JSZip from 'jszip';
import BonOS from './BonOS.folder'
import lagoonBoot from './lagoon-boot.folder'
let button = document.createElement("button")
button.textContent = "Install BonOS"
button.id = "install"

let settings = {
 username:"installer",
 updatedLook: false,
 password: ""
}

function showMenuInput(min, max, handler) {
  const input = document.createElement("input");
  input.type = "text";
  input.id = "menuInput";
  input.maxLength = 2;
  input.style.background = settings.updatedLook ? "#222" : "black";
  input.style.color = settings.updatedLook ? "#00ffea" : "lime";
  input.style.fontFamily = settings.updatedLook ? "'Segoe UI', 'Courier New', monospace" : '"Courier New"';
  input.style.fontSize = settings.updatedLook ? "18px" : "16px";
  input.style.border = settings.updatedLook ? "1px solid #00ffea" : "1px solid lime";
  input.style.width = "3em";
  input.style.marginRight = "1em";
  input.style.outline = "none";

  const asciiEnter = document.createElement("pre");
  asciiEnter.id = "asciiEnter";
  asciiEnter.textContent = `
+---------+
|  ENTER  |
+---------+
`;
  asciiEnter.style.display = "inline-block";
  asciiEnter.style.cursor = "pointer";
  asciiEnter.style.color = settings.updatedLook ? "#00ffea" : "lime";
  asciiEnter.style.margin = "0";
  asciiEnter.style.verticalAlign = "middle";
  asciiEnter.onclick = () => {
    input.remove()
    asciiEnter.remove()
    const val = input.value.trim();
    const num = Number(val);
    if (num >= min && num <= max) {
      handler(num);
    } else {
      clearTerminal();
      typeWriter("Invalid option. Try again.\n", 50).then(() => handler("invalid"));
    }
  };

  document.body.appendChild(input);
  document.body.appendChild(asciiEnter);
  input.focus();
}


function showTextInput(handler) {
  const input = document.createElement("input");
  input.type = "text";
  input.id = "menuInput";
//   input.maxLength = 2;
  input.style.background = settings.updatedLook ? "#222" : "black";
  input.style.color = settings.updatedLook ? "#00ffea" : "lime";
  input.style.fontFamily = settings.updatedLook ? "'Segoe UI', 'Courier New', monospace" : '"Courier New"';
  input.style.fontSize = settings.updatedLook ? "18px" : "16px";
  input.style.border = settings.updatedLook ? "1px solid #00ffea" : "1px solid lime";
  input.style.width = "3em";
  input.style.marginRight = "1em";
  input.style.outline = "none";

  const asciiEnter = document.createElement("pre");
  asciiEnter.id = "asciiEnter";
  asciiEnter.textContent = `
+---------+
|  ENTER  |
+---------+
`;
  asciiEnter.style.display = "inline-block";
  asciiEnter.style.cursor = "pointer";
  asciiEnter.style.color = settings.updatedLook ? "#00ffea" : "lime";
  asciiEnter.style.margin = "0";
  asciiEnter.style.verticalAlign = "middle";
  asciiEnter.onclick = () => {
    input.remove()
    input.remove()
    asciiEnter.remove()
    handler(input.value);
  };

  document.body.appendChild(input);
  document.body.appendChild(asciiEnter);
  input.focus();
}


const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function typeWriter(text, delay) {
  for (let i = 0; i < text.length; i++) {
    document.querySelector("p").textContent += text[i];
    await sleep(settings.fastType==true?1:delay);
  }
}



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
    let br = document.createElement("br")
    document.querySelector("p").appendChild(br)
    let progress = document.createElement("progress")
    progress.max=1
    document.querySelector("p").appendChild(progress)
    let br2 = document.createElement("br")
    document.querySelector("p").appendChild(br2)

    let mi = Object.keys(zip.files).length
    let i = 0;
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
        progress.value = ((i++)/mi)*1
    }
    document.querySelector("p").innerHTML+=("Installed "+dirName+"!<br>")

});

}
InstallZip(BonOS, "BonOS")
InstallZip(lagoonBoot, "lagoon-boot")
let root = await rootDir.getDirectoryHandle("BonOS", { create: true });
let usr = await root.getDirectoryHandle("usr", {create: true})
const fsAPI = {}
fsAPI.writeFile = async function(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();

  // Write the contents of the file to the stream.
  await writable.write(contents);

  // Close the file and write the contents to disk.
  await writable.close();
}
fsAPI.writeFile(await usr.getFileHandle("settings.json", {create:true}), JSON.stringify(settings))

})
;(async()=>{
await typeWriter("What's your name?\n", 50)
showTextInput(async(text)=>{
    let username = text
    await typeWriter("Hello, "+text+"\n", 50)
    await typeWriter("Enter your new password\n", 50)
    showTextInput(async(text2)=>{
        let password = text2
        await typeWriter("Select a folder to install BonOS and lagoon boot to\n", 100)
        document.querySelector("p").appendChild(button)
        settings.password = password
        settings.username = username
    })
})
})();
