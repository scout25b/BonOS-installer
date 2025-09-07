export default function loader(source,name) {
    console.log("b", name)
    return `export default ${JSON.stringify(source)}`;
}